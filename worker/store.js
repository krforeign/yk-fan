// Data store: Cloudflare D1 (SQLite). Tables are created on first use.
// Without a D1 binding the site is read-only and serves the bundled public/seed.js.
const SCHEMA = [
  'CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL, at INTEGER NOT NULL)',
  'CREATE TABLE IF NOT EXISTS requests (id TEXT PRIMARY KEY, at TEXT NOT NULL, body TEXT NOT NULL, status TEXT NOT NULL DEFAULT \'new\')',
  'CREATE INDEX IF NOT EXISTS requests_at ON requests (at)',
  'CREATE TABLE IF NOT EXISTS rl (k TEXT PRIMARY KEY, n INTEGER NOT NULL, reset INTEGER NOT NULL)',
];

let ready = null;
export const hasStore = env => !!env.DB;
export async function db(env) {
  if (!env.DB) return null;
  if (!ready) ready = env.DB.batch(SCHEMA.map(q => env.DB.prepare(q))).catch(e => { ready = null; throw e; });
  await ready;
  return env.DB;
}

const KEY = env => env.DATA_KEY || 'yonezu:data';

async function seed(env, origin) {
  const r = await env.ASSETS.fetch(new Request(origin + '/seed.js'));
  const src = await r.text();
  return JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));
}

/* The guide data is one JSON document. D1 allows about 2 MB per row, so it is stored in pieces:
     KEY#c000, KEY#c001, ...  text pieces (in order)
     KEY#meta                 {"updated": "...", "n": <number of pieces>}
   Saving first copies the current pieces to KEY:prev#... (one-step backup).
   Older single-row data (KEY) is still read, and moved to the new layout on the next save. */
const PIECE = 400000;            // characters per row: at most ~1.2 MB even if every character is 3-byte UTF-8
const pieceKey = (k, i) => k + '#c' + String(i).padStart(3, '0');

let memo = null; // short in-isolate cache so bursts of page views don't each hit the database
// Returns {text, updated}: the stored JSON text, not parsed (parsing ~1 MB costs CPU time the free plan doesn't have).
export async function load(env, origin, opts = {}) {
  if (memo && !opts.fresh && Date.now() - memo.at < 10000) return memo.data;
  try {
    const data = await loadRaw(env, origin);
    memo = { at: Date.now(), data };
    return data;
  } catch (e) {
    // database unavailable or over its daily quota: stay readable with the last copy we have
    if (opts.fresh) throw e;
    if (memo) return memo.data;
    const sd = await seed(env, origin);
    return { text: JSON.stringify(sd), updated: sd.updated || null };
  }
}
async function loadRaw(env, origin) {
  const d = await db(env);
  if (d) {
    const k = KEY(env);
    const { results } = await d.prepare('SELECT k, v FROM kv WHERE k >= ?1 AND k < ?2 ORDER BY k').bind(k + '#', k + '$').all();
    const meta = results.find(r => r.k === k + '#meta');
    if (meta) {
      const m = JSON.parse(meta.v);
      const parts = results.filter(r => r.k !== k + '#meta');
      if (parts.length !== m.n) throw new Error('stored data is incomplete');
      return { text: parts.map(r => r.v).join(''), updated: m.updated };
    }
    const v = await d.prepare('SELECT v FROM kv WHERE k = ?').bind(k).first('v'); // older single-row layout
    if (v) return { text: v, updated: JSON.parse(v).updated || null };
  }
  const sd = await seed(env, origin);
  return { text: JSON.stringify(sd), updated: sd.updated || null };
}

// Only the "updated" stamp of what is stored now (for the conflict check), without reading the whole document.
export async function currentUpdated(env, origin) {
  const d = await db(env);
  const k = KEY(env);
  const meta = await d.prepare('SELECT v FROM kv WHERE k = ?').bind(k + '#meta').first('v');
  if (meta) return JSON.parse(meta).updated || null;
  return (await loadRaw(env, origin)).updated;
}

export async function save(env, text, updated) {
  const d = await db(env);
  if (!d) { const e = new Error('storage not configured'); e.code = 'no_store'; throw e; }
  const k = KEY(env), p = k + ':prev', now = Date.now();
  const n = Math.max(1, Math.ceil(text.length / PIECE));
  const stmts = [
    // backup: drop the old backup, copy the current pieces (or the older single row) over
    d.prepare('DELETE FROM kv WHERE k >= ?1 AND k < ?2').bind(p + '#', p + '$'),
    d.prepare('INSERT INTO kv (k, v, at) SELECT ?1 || substr(k, ?2), v, at FROM kv WHERE k >= ?3 AND k < ?4').bind(p, k.length + 1, k + '#', k + '$'),
    d.prepare('INSERT INTO kv (k, v, at) SELECT ?1, v, at FROM kv WHERE k = ?2 ON CONFLICT(k) DO UPDATE SET v = excluded.v, at = excluded.at').bind(p, k),
    d.prepare('DELETE FROM kv WHERE k = ?1 OR (k >= ?2 AND k < ?3)').bind(k, k + '#', k + '$'),
  ];
  for (let i = 0; i < n; i++) stmts.push(d.prepare('INSERT INTO kv (k, v, at) VALUES (?1, ?2, ?3)').bind(pieceKey(k, i), text.slice(i * PIECE, (i + 1) * PIECE), now));
  stmts.push(d.prepare('INSERT INTO kv (k, v, at) VALUES (?1, ?2, ?3)').bind(k + '#meta', JSON.stringify({ updated, n }), now));
  await d.batch(stmts); // one transaction: either everything is saved or nothing changes
  memo = { at: now, data: { text, updated } };
}
