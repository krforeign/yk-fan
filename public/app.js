/* 米津玄師 2026 TOUR / GHOST fan site — client app.
   Data: GET /api/data (public). Editing (owner only): token from /api/login, PUT /api/data.
   Auto-fill: pronunciation runs in the browser (kuromoji + /dict, loaded on first use), /api/translate (DeepL). */
(function(){
"use strict";

/* ================= extra strings ================= */
Object.assign(T.ja, {
  st1:'歌詞の原文入力', st2:'発音・翻訳の確認', st3:'歌詞の同期', st4:'コール・合唱の入力',
  st1p:'日本語の原文歌詞を1小節 = 1行で入力してください。LRC / SRT ファイルを読み込むとタイミングも一緒に入ります。',
  st1ph:'発音や翻訳は入れずに、原文だけを小節ごとに入力してください', lrcUpload:'LRC / SRT を読み込む',
  importedTimes:'{n}行分のタイミングを読み込みました。「次へ」で反映されます。', next:'次へ', prev:'戻る',
  mixH:'原文・発音・翻訳をまとめて貼り付け', mixP:'原文の下に発音・翻訳が並んだ形式をそのまま貼り付けると、行ごとに分けて入力します。かな・漢字を含む行は原文、ハングルだけの行は発音・翻訳として扱います。英語だけの行は原文とみなします。すでに歌詞(同期済みのLRCを含む)がある場合は、行を作り直さずに近い行へ発音・翻訳だけを付けます。',
  mixFmt:'並び方', mixPtr:'原文 → 発音 → 翻訳', mixPr:'原文 → 発音', mixTr:'原文 → 翻訳', mixApply:'読み込んで次へ',
  alignH:'原文・発音・翻訳を貼り付けて自動で合わせる', alignP:'原文の下に発音・翻訳が付いたテキストを貼り付けると、内容が近い歌詞の行を探して発音・翻訳を入れます。行の時間(同期)はそのまま残ります。「原文 → 発音 → 翻訳」が1行ずつ交互でも、原文・発音・翻訳がそれぞれまとまっていても大丈夫です。',
  alignOver:'入力済みの発音・翻訳も上書きする', alignBtn:'貼り付けて合わせる',
  alignDone:'{n}行中 {m}行を歌詞に合わせました (発音 {p} · 翻訳 {r})。', alignMiss:'合う歌詞が見つからなかった行 {k}件:', alignJoin:'細かく分かれていた {k}行は、つなげて歌詞 {g}行に入れました。', alignSplit:'{k}行は歌詞 {g}行に分けて入れました。発音・翻訳の区切り位置は自動なので確認してください:',
  mixDone:'{n}行を読み込みました (発音 {p} · 翻訳 {r})。ずれている行がないか確認してください。',
  st2p:'各行の発音(ハングル表記)と韓国語訳を確認して直してください。韓国語モードで歌詞の下に表示されます。+ で行を追加。',
  fOrig:'原文', fPr:'発音', fTr:'翻訳', unsynced:'未設定', bulkH:'1行ずつ貼り付け', bulkPr:'発音 (1行ずつ)', bulkTr:'翻訳 (1行ずつ)', apply:'を反映',
  fillPr:'発音を自動入力', fillTr:'翻訳を自動入力 (DeepL)', fillAll:'入力済みの行も作り直す',
  fillHint:'発音はサーバーの形態素解析で、翻訳は DeepL で作ります。漢字の読みや訳は必ず確認してください。',
  genBusyPr:'発音を作成中… ({m}行)', genBusyTr:'DeepL で翻訳中… ({m}行)',
  genDonePr:'{n}行の発音を入力しました。', genDoneTr:'{n}行を翻訳しました。', genNone:'対象の行がありません。作り直すなら「入力済みの行も作り直す」にチェック。',
  errNoKey:'DEEPL_API_KEY が設定されていません (Cloudflare のシークレット)。', errQuota:'DeepL の今月の文字数上限に達しました。', errBadKey:'DeepL が API キーを受け付けませんでした。',
  genErrOther:'自動入力に失敗しました: ', oneP:'この行の発音を作り直す', oneT:'この行を翻訳し直す',
  st3p:'動画を再生しながら、歌い出しの瞬間に「タップ」(PCはスペースキー。動画をクリックした後は一度ページの空白をクリック)。◎ で記録を始める行を選べます。時刻を押すとその少し前から再生。',
  fromHere:'ここから記録', setNow:'今の時間を入れる', tapBtn:'タップ ⏎', tapNext:'次: ', tapEnd:'最後の行まで記録しました',
  st4p:'① 画面下の呼応バーで種類を選ぶ → ② 歌詞の文字を2回タップして区間を指定(始まり → 終わり)。消しゴムで区間を消せます。歌詞と一緒に出るコールは各行の「この歌詞のコール」に、前奏・間奏など歌詞のない所のコールは「+ 呼応だけの行」に入れてください。',
  pickCheer:'呼応を選択', erase:'消しゴム', customCheer:'オリジナル呼応を追加', ccName:'名前 (日本語)', ccNameKo:'名前 (韓国語)', ccColor:'色', ccIcon:'アイコン', ccAdd:'追加',
  addCheerLine:'呼応だけの行', fLabel:'区間名 (前奏・間奏など)', fCall:'コール内容 (例: オイ!)', memo:'メモ',
  curTime:'現在の時間', backGuide:'曲ページへ', edit:'編集', legendSong:'この曲の呼応',
  noVideo:'動画はまだ登録されていません', noVideoOwner:'編集画面で YouTube かニコニコ動画の URL を入れると、ここに動画が表示されます。', ytApply:'適用',
  timerNote:'動画がないため、タイマーで時間が進みます。', loading:'読み込み中…', loadErr:'データを読み込めませんでした。再読み込みしてください。',
  admin:'管理', adminH:'管理者ログイン', adminP:'管理者パスワードを入力すると、この端末でコールガイドを編集できます (30日間有効)。', password:'パスワード', login:'ログイン', logout:'ログアウト',
  loginErr:'パスワードが違います。', loginRate:'試行回数が多すぎます。15分ほど待ってからもう一度お試しください。', loginNoPw:'ADMIN_PASSWORD が設定されていません。Cloudflare の Settings → Variables and Secrets に「Secret」として追加し、もう一度デプロイしてください。', loggedIn:'ログイン中です。曲ページの「編集」から編集できます。',
  storageOk:'保存先: Upstash Redis に接続済み', storageNo:'保存先が未設定です。README の手順で Upstash Redis を接続してください。それまでは「JSON を書き出す」で保存できます。',
  exportJson:'JSON を書き出す', importJson:'JSON を読み込む', importDone:'JSON を読み込みました。内容を確認して「保存して公開」を押してください。', importErr:'JSON を読み込めませんでした。',
  lrcH:'LRCLIB から同期歌詞を探す', lrcP:'LRCLIB (無料の歌詞データベース) から LRC を探して、原文とタイミングを一度に読み込みます。音源と動画で前奏の長さが違うときは、3段階の「全体を動かす」で合わせてください。',
  lrcQ:'曲名', lrcArtist:'アーティスト', lrcSearch:'検索', lrcBusy:'検索中…', lrcNone:'見つかりませんでした。曲名の表記 (英字・かな) を変えて試してください。',
  lrcSynced:'同期あり', lrcPlain:'歌詞のみ', lrcUse:'読み込む', lrcErr:'LRCLIB に接続できませんでした: ', lrcLoaded:'LRCLIB の「{t}」を読み込みました ({n}行)。内容を確認して「次へ」。',
  lrcRetry:'LRCLIB 側が一時的に混み合っている可能性があります。少し待ってからもう一度検索してください。', fCallJa:'コール (日本語) 例: オイ!', fCallKo:'コール (韓国語) 例: 오이!', fLabelKo:'区間名 (韓国語)',
attCall:'この歌詞のコール (一緒に表示)', attUp:'上の歌詞にくっつける', attDetach:'コールを外す',
  attAll:'離れたコールをまとめて歌詞にくっつける', attAllP:'時間が入っていない「呼応だけの行」を、すぐ上の歌詞の行にまとめます。', attAllDone:'{n}件のコールを歌詞にくっつけました。',
  shiftH:'全体を動かす', shiftP:'すべての時間を同じだけずらします (動画の前奏が音源と違うとき)。', shiftFirst:'最初の歌詞を今の時間に合わせる',
  previewNote:'ファイルを直接開いたプレビューです (閲覧のみ)。ログイン・編集・保存・自動入力はサーバーが必要なので、Cloudflare に公開するか `npm run dev` で開いてください。',
  tabLive:'ライブ', navLives:'ライブ一覧', navReceipt:'レシート',
  livesLabel:'米津玄師・ハチの全ライブ・フェス', livesLead:'行ったライブ・行く予定のライブにチェックすると、参加した公演の数と、いちばん多く聴いた曲をレシートにまとめます。チェックはこの端末のブラウザにだけ保存されます。',
  kS:'ワンマン', kF:'フェス', kE:'イベント・対バン', kAll:'すべて', upcoming:'予定', noSet:'セトリ未登録', showSet:'セトリ', songsN:'{n}曲',
  pickAll:'表示中の公演をすべてチェック', pickNone:'チェックをすべて外す', picked:'{n}公演 選択中', toReceipt:'レシートを見る',
  rcTitle:'LIVE RECEIPT', rcIssued:'発行日', rcItems:'参加公演', rcSub:'小計', rcTotal:'合計', rcUp:'参加予定', rcShows:'公演', rcHeard:'聴いた曲 (延べ)', rcUnique:'聴いた曲 (種類)',
  rcTop:'よく聴いた曲 TOP', rcFirst:'初参加', rcLast:'最近の参加', rcPlaces:'行った地域', rcTimes:'{n}回', rcThanks:'さよーなら、またいつか！', rcEmpty:'上の一覧で、行ったライブにチェックを入れてください。',
  rcNick:'ニックネーム', rcNickPh:'例: ゴースト', rcNickShow:'レシートに表示する', rcGuest:'お客様', rcSave:'画像で保存', rcShare:'共有', rcSaved:'画像を保存しました。', rcNever:'まだ聴いていない曲', rcSrc:'GHOST FAN PAGE · 非公式',
  reqBtn:'リクエスト', sortBy:'並び順', sortAlbum:'アルバム順', sortPlays:'ライブでよく演奏された順', sortTitle:'曲名順', plays:'ライブ {n}回', playsNone:'ライブ未演奏', filterAll:'すべて', filterNone:'この呼応がある曲はまだありません。', filterHint:'呼応をタップすると、その呼応がある曲だけを表示します。', songsShown:'{n}曲', debut:'デビューから', debutUnit:'日目', fYtType:'動画の種類', ytNone:'表示しない', ytMV:'MV', ytLive:'ライブ映像', ytAudio:'音源', ytOther:'その他', miniOn:'動画を小さく', miniOff:'動画を大きく', rcX:'Xでシェア', rcXSaved:'レシート画像を保存しました。開いたXの投稿画面に画像を添付してください。', fab:'リクエスト', banCall:'コールが違う・足りない? 気づいたことを教えてください', banSongs:'曲の情報や歌詞の間違いに気づいたら教えてください', banSongJa:'この曲の歌詞や情報に間違いがある?', banSong:'この曲のコールが違う・足りない?', banGo:'リクエストする', reqLink:'リクエスト・ご意見', reqH:'リクエストを送る', reqP:'コールガイドの修正・追加、情報の追加、ほしい機能などを送ってください。送った内容は管理者だけが見られます。名前や連絡先は不要です。',
  rqCall:'コールの追加・修正', rqInfo:'情報の追加・修正', rqFeature:'機能のアイデア', rqOther:'その他',
  rqSong:'曲', rqSongPick:'曲を選ぶ', rqLine:'どの部分?', rqLineAll:'曲全体 / 前奏・間奏など', rqCheer:'どんな呼応?', rqNone:'わからない',
  rqText:'叫ぶ言葉 (任意) 例: オイ!', rqMemo:'くわしく (任意)', rqBody:'内容', rqPhInfo:'例: 〇〇のライブの日付が違います / メンバー紹介に〇〇を追加してほしい', rqPhFeature:'例: 曲ページで〇〇できるとうれしい', rqPhOther:'自由に書いてください',
  rqSend:'送る', rqSending:'送信中…', rqSent:'送信しました。ありがとうございます!', rqAgain:'もう1件送る', rqClose:'閉じる', rqTime:'動画の時間 {t} も一緒に送ります',
  rqErrRate:'今日はこれ以上送れません。明日またお願いします。', rqErrEmpty:'内容を入力してください。', rqErrStore:'いまはリクエストを受け付けていません。', rqErr:'送信できませんでした。少しあとでもう一度お試しください。',
  rqAdminH:'リクエスト一覧', rqLoad:'更新', rqEmpty:'リクエストはまだありません。', rqOpen:'未処理', rqHold:'保留', rqDone:'完了', rqAll:'すべて',
  rqApply:'編集画面で反映', rqDel:'削除', rqTimes:'{n}件', rqApplied:'編集画面の4段階に下書きとして入れました。確認して「保存して公開」を押してください。', rqNoLine:'該当する歌詞の行が見つからなかったので、曲の先頭に呼応行として入れました。',
  navApp:'アプリで使う', appLabel:'ホーム画面に追加して、アプリのように使う',
  appLead:'ホーム画面に追加すると、アイコンをタップするだけでアドレスバーのない全画面で開きます。会場でもすぐにコールガイドを開けます。',
  appInstall:'アプリとしてインストール', appInstalled:'インストールしました。ホーム画面のアイコンから開けます。', appAlready:'今はアプリとして開いています。',
  appTabAndroid:'Android (Chrome)', appTabSamsung:'Galaxy (Samsung Internet)', appTabIos:'iPhone / iPad', appTabPc:'PC (Chrome / Edge)',
  appStepsAndroid:['右上の「⋮」メニューをタップ','「アプリをインストール」または「ホーム画面に追加」をタップ','「インストール」(または「追加」)をタップ'],
  appStepsSamsung:['下の「≡」メニューをタップ','「現在のページを追加」(または「ページを追加」)をタップ','「ホーム画面」を選んで追加'],
  appStepsIos:['Safariで開いて、下(iPadは上)の共有ボタン(□に↑)をタップ','メニューを上にスクロールして「ホーム画面に追加」をタップ','右上の「追加」をタップ'],
  appStepsPc:['アドレスバー右側のインストールアイコン(画面に↓のマーク)をクリック','「インストール」をクリック','デスクトップやスタートメニューのアイコンから開けます'],
  appNoteIos:'iPhoneのChromeでも、アドレスバーの共有ボタン →「ホーム画面に追加」で同じように追加できます。',
  appNote:'アイコンを消したいときは、ふつうのアプリと同じように長押しして削除してください。',
  usage:'DeepL 使用量', usageBtn:'DeepL 使用量を確認', published:'保存しました。数十秒以内にすべての訪問者に反映されます。',
  errAuth:'ログインの有効期限が切れました。もう一度ログインしてください。', errNoStore:'保存先が未設定です (管理ページ参照)。', errConflict:'別の端末で先に保存されました。ページを再読み込みしてから編集し直してください。', errTooLarge:'データが大きすぎます。'
});
Object.assign(T.ko, {
  st1:'가사 원문 입력', st2:'발음·번역 확인', st3:'가사 싱크', st4:'호응·떼창 입력',
  st1p:'일본어 원문 가사를 한 소절 = 한 줄로 입력하세요. LRC / SRT 파일을 불러오면 타이밍도 함께 들어가요.',
  st1ph:'발음이나 번역은 빼고 원문 가사만 소절 단위로 입력해 주세요', lrcUpload:'LRC / SRT 불러오기',
  importedTimes:'{n}줄의 타이밍을 불러왔어요. \'다음\'을 누르면 반영돼요.', next:'다음', prev:'이전',
  mixH:'원문·발음·번역 함께 붙여넣기', mixP:'원문 아래에 발음·번역이 붙어 있는 형식을 그대로 붙여넣으면 줄마다 나눠서 넣어요. 가나·한자가 있는 줄은 원문, 한글만 있는 줄은 발음·번역으로 처리해요. 영어로만 된 줄은 원문으로 봐요. 이미 가사(싱크된 LRC 포함)가 있으면 줄을 새로 만들지 않고, 비슷한 줄을 찾아 발음·번역만 붙여요.',
  mixFmt:'순서', mixPtr:'원문 → 발음 → 번역', mixPr:'원문 → 발음', mixTr:'원문 → 번역', mixApply:'불러와서 다음으로',
  alignH:'원문·발음·번역 붙여넣어 자동으로 맞추기', alignP:'원문 아래에 발음·번역이 붙은 텍스트를 붙여넣으면, 내용이 비슷한 가사 줄을 찾아 발음·번역을 넣어요. 줄의 시간(싱크)은 그대로 남아요. \'원문 → 발음 → 번역\'이 한 줄씩 번갈아 있어도, 원문·발음·번역이 각각 덩어리로 있어도 돼요.',
  alignOver:'이미 채운 발음·번역도 덮어쓰기', alignBtn:'붙여넣고 맞추기',
  alignDone:'{n}줄 중 {m}줄을 가사에 맞췄어요 (발음 {p} · 번역 {r}).', alignMiss:'맞는 가사를 못 찾은 줄 {k}개:', alignJoin:'더 잘게 나뉜 {k}줄은 이어 붙여서 가사 {g}줄에 넣었어요.', alignSplit:'{k}줄은 가사 {g}줄로 나눠 넣었어요. 발음·번역을 자른 위치는 자동이라 확인해 주세요:',
  mixDone:'{n}줄을 불러왔어요 (발음 {p} · 번역 {r}). 어긋난 줄이 없는지 확인해 주세요.',
  st2p:'각 줄의 발음(한글 표기)과 한국어 번역을 확인하고 고쳐 주세요. 한국어 모드에서 가사 아래에 표시돼요. +로 줄 추가.',
  fOrig:'원문', fPr:'발음', fTr:'번역', unsynced:'미설정', bulkH:'한 줄씩 붙여넣기', bulkPr:'발음 (한 줄씩)', bulkTr:'번역 (한 줄씩)', apply:'반영',
  fillPr:'발음 자동 입력', fillTr:'번역 자동 입력 (DeepL)', fillAll:'이미 채운 줄도 다시 만들기',
  fillHint:'발음은 서버의 형태소 분석으로, 번역은 DeepL로 만들어요. 한자 읽기와 번역은 꼭 확인해 주세요.',
  genBusyPr:'발음 만드는 중… ({m}줄)', genBusyTr:'DeepL로 번역하는 중… ({m}줄)',
  genDonePr:'{n}줄의 발음을 채웠어요.', genDoneTr:'{n}줄을 번역했어요.', genNone:'대상 줄이 없어요. 다시 만들려면 \'이미 채운 줄도 다시 만들기\'를 체크하세요.',
  errNoKey:'DEEPL_API_KEY가 설정되지 않았어요 (Cloudflare 시크릿).', errQuota:'DeepL 이번 달 글자 수 한도에 도달했어요.', errBadKey:'DeepL이 API 키를 거부했어요.',
  genErrOther:'자동 입력에 실패했어요: ', oneP:'이 줄 발음 다시 만들기', oneT:'이 줄 다시 번역',
  st3p:'영상을 재생하면서 가사가 시작되는 순간 \'탭\'(PC는 스페이스바. 영상을 클릭한 뒤엔 페이지 빈 곳을 한 번 클릭). ◎로 기록을 시작할 줄을 고를 수 있어요. 시간을 누르면 조금 앞에서부터 재생.',
  fromHere:'여기서부터 기록', setNow:'현재 시간 넣기', tapBtn:'탭 ⏎', tapNext:'다음: ', tapEnd:'마지막 줄까지 기록했어요',
  st4p:'① 화면 아래 호응 바에서 종류를 고르고 → ② 가사 글자를 두 번 탭해서 구간을 지정(시작 → 끝). 지우개로 구간을 지울 수 있어요. 가사와 같이 나오는 콜은 각 줄의 \'이 가사의 콜\'에, 전주·간주처럼 가사가 없는 부분의 콜은 \'+ 호응 전용 줄\'로 넣어 주세요.',
  pickCheer:'호응 선택', erase:'지우개', customCheer:'커스텀 호응 추가', ccName:'이름 (일본어)', ccNameKo:'이름 (한국어)', ccColor:'색', ccIcon:'아이콘', ccAdd:'추가',
  addCheerLine:'호응 전용 줄', fLabel:'구간 이름 (전주·간주 등)', fCall:'콜 내용 (예: オイ!)', memo:'메모',
  curTime:'현재 시간', backGuide:'곡 페이지로', edit:'편집', legendSong:'이 곡의 호응',
  noVideo:'아직 영상이 등록되지 않았어요', noVideoOwner:'편집 화면에서 YouTube나 니코니코 동화 URL을 넣으면 여기에 영상이 표시돼요.', ytApply:'적용',
  timerNote:'영상이 없어서 타이머로 시간이 흘러가요.', loading:'불러오는 중…', loadErr:'데이터를 불러오지 못했어요. 새로고침해 주세요.',
  admin:'관리', adminH:'관리자 로그인', adminP:'관리자 비밀번호를 입력하면 이 기기에서 콜 가이드를 편집할 수 있어요 (30일 유지).', password:'비밀번호', login:'로그인', logout:'로그아웃',
  loginErr:'비밀번호가 틀렸어요.', loginRate:'시도 횟수가 너무 많아요. 15분쯤 뒤에 다시 시도해 주세요.', loginNoPw:'ADMIN_PASSWORD가 설정되지 않았어요. Cloudflare의 Settings → Variables and Secrets에 ‘Secret’ 유형으로 추가하고 다시 배포해 주세요.', loggedIn:'로그인되어 있어요. 곡 페이지의 \'편집\'에서 편집할 수 있어요.',
  storageOk:'저장소: Upstash Redis 연결됨', storageNo:'저장소가 설정되지 않았어요. README 순서대로 Upstash Redis를 연결하세요. 그 전까지는 \'JSON 내보내기\'로 저장할 수 있어요.',
  exportJson:'JSON 내보내기', importJson:'JSON 불러오기', importDone:'JSON을 불러왔어요. 확인하고 \'저장하고 공개\'를 누르세요.', importErr:'JSON을 읽지 못했어요.',
  lrcH:'LRCLIB에서 싱크 가사 찾기', lrcP:'LRCLIB(무료 가사 데이터베이스)에서 LRC를 찾아 원문과 타이밍을 한 번에 불러와요. 음원과 영상의 전주 길이가 다르면 3단계의 \'전체 이동\'으로 맞춰 주세요.',
  lrcQ:'곡명', lrcArtist:'아티스트', lrcSearch:'검색', lrcBusy:'검색 중…', lrcNone:'찾지 못했어요. 곡명 표기(영문·가나)를 바꿔서 다시 해 보세요.',
  lrcSynced:'싱크 있음', lrcPlain:'가사만', lrcUse:'불러오기', lrcErr:'LRCLIB에 연결하지 못했어요: ', lrcLoaded:'LRCLIB의 \'{t}\'를 불러왔어요 ({n}줄). 확인하고 \'다음\'을 누르세요.',
  lrcRetry:'LRCLIB 쪽이 일시적으로 붐비는 것 같아요. 잠시 뒤 다시 검색해 주세요.', fCallJa:'콜 (일본어) 예: オイ!', fCallKo:'콜 (한국어) 예: 오이!', fLabelKo:'구간 이름 (한국어)',
attCall:'이 가사의 콜 (함께 표시)', attUp:'위 가사에 붙이기', attDetach:'콜 떼기',
  attAll:'떨어진 콜을 가사에 한 번에 붙이기', attAllP:'시간이 없는 \'호응 전용 줄\'을 바로 위 가사 줄로 합쳐요.', attAllDone:'콜 {n}개를 가사에 붙였어요.',
  shiftH:'전체 이동', shiftP:'모든 시간을 같은 만큼 옮겨요 (영상 전주가 음원과 다를 때).', shiftFirst:'첫 가사를 지금 시간에 맞추기',
  previewNote:'파일을 직접 연 미리보기예요 (보기 전용). 로그인·편집·저장·자동 입력은 서버가 필요해서, Cloudflare에 배포하거나 `npm run dev`로 열어 주세요.',
  tabLive:'공연', navLives:'공연 목록', navReceipt:'영수증',
  livesLabel:'요네즈 켄시·하치의 모든 공연·페스티벌', livesLead:'다녀온 공연과 갈 예정인 공연에 체크하면, 참여한 공연 수와 가장 많이 들은 노래를 영수증으로 뽑아 줘요. 체크한 내용은 이 기기의 브라우저에만 저장돼요.',
  kS:'단독 공연', kF:'페스티벌', kE:'이벤트·대반', kAll:'전체', upcoming:'예정', noSet:'셋리스트 미등록', showSet:'셋리스트', songsN:'{n}곡',
  pickAll:'보이는 공연 모두 체크', pickNone:'체크 모두 해제', picked:'{n}개 공연 선택', toReceipt:'영수증 보기',
  rcTitle:'LIVE RECEIPT', rcIssued:'발행일', rcItems:'참여 공연', rcSub:'소계', rcTotal:'합계', rcUp:'참여 예정', rcShows:'공연', rcHeard:'들은 곡 (총)', rcUnique:'들은 곡 (종류)',
  rcTop:'가장 많이 들은 노래 TOP', rcFirst:'첫 참여', rcLast:'최근 참여', rcPlaces:'다녀온 지역', rcTimes:'{n}번', rcThanks:'안녕, 또 언젠가!', rcEmpty:'위 목록에서 다녀온 공연에 체크해 주세요.',
  rcNick:'닉네임', rcNickPh:'예: 유령팬', rcNickShow:'영수증에 표시하기', rcGuest:'손님', rcSave:'이미지로 저장', rcShare:'공유', rcSaved:'이미지를 저장했어요.', rcNever:'아직 못 들은 노래', rcSrc:'GHOST FAN PAGE · 비공식',
  reqBtn:'요청', sortBy:'정렬', sortAlbum:'앨범순', sortPlays:'라이브에서 많이 부른 순', sortTitle:'곡명순', plays:'라이브 {n}회', playsNone:'라이브 미공개', filterAll:'전체', filterNone:'이 호응이 있는 곡이 아직 없어요.', filterHint:'호응을 누르면 그 호응이 있는 곡만 보여 줘요.', songsShown:'{n}곡', debut:'데뷔', debutUnit:'일째', fYtType:'영상 종류', ytNone:'표시 안 함', ytMV:'MV', ytLive:'라이브 영상', ytAudio:'음원', ytOther:'기타', miniOn:'영상 작게', miniOff:'영상 크게', rcX:'X에 공유', rcXSaved:'영수증 이미지를 저장했어요. 열린 X 글쓰기 창에 이미지를 첨부해 주세요.', fab:'요청하기', banCall:'콜이 틀렸거나 빠졌나요? 알게 된 걸 알려 주세요', banSong:'이 곡의 콜이 틀렸거나 빠졌나요?', banGo:'요청하기', reqLink:'요청·의견 보내기', reqH:'요청 보내기', reqP:'콜 가이드 수정·추가, 정보 추가, 원하는 기능 등을 보내 주세요. 보낸 내용은 관리자만 볼 수 있어요. 이름이나 연락처는 필요 없어요.',
  rqCall:'콜 추가·수정', rqInfo:'정보 추가·수정', rqFeature:'기능 제안', rqOther:'기타',
  rqSong:'곡', rqSongPick:'곡 선택', rqLine:'어느 부분인가요?', rqLineAll:'곡 전체 / 전주·간주 등', rqCheer:'어떤 호응인가요?', rqNone:'잘 모르겠어요',
  rqText:'외치는 말 (선택) 예: オイ! / 오이!', rqMemo:'자세한 내용 (선택)', rqBody:'내용', rqPhInfo:'예: ○○ 공연 날짜가 달라요 / 멤버 소개에 ○○을 추가해 주세요', rqPhFeature:'예: 곡 페이지에서 ○○ 할 수 있으면 좋겠어요', rqPhOther:'자유롭게 적어 주세요',
  rqSend:'보내기', rqSending:'보내는 중…', rqSent:'보냈어요. 고마워요!', rqAgain:'하나 더 보내기', rqClose:'닫기', rqTime:'영상 시간 {t}도 함께 보내요',
  rqErrRate:'오늘은 더 보낼 수 없어요. 내일 다시 보내 주세요.', rqErrEmpty:'내용을 입력해 주세요.', rqErrStore:'지금은 요청을 받지 않고 있어요.', rqErr:'보내지 못했어요. 잠시 뒤 다시 시도해 주세요.',
  rqAdminH:'요청 목록', rqLoad:'새로고침', rqEmpty:'아직 요청이 없어요.', rqOpen:'미처리', rqHold:'보류', rqDone:'완료', rqAll:'전체',
  rqApply:'편집 화면에 반영', rqDel:'삭제', rqTimes:'{n}건', rqApplied:'편집 4단계에 임시로 넣었어요. 확인하고 \'저장하고 공개\'를 눌러 주세요.', rqNoLine:'맞는 가사 줄을 못 찾아서, 곡 맨 앞에 호응 줄로 넣었어요.',
  navApp:'앱으로 쓰기', appLabel:'홈 화면에 추가해서 앱처럼 쓰기',
  appLead:'홈 화면에 추가하면 아이콘만 누르면 주소창 없이 전체 화면으로 열려요. 공연장에서도 바로 콜 가이드를 열 수 있어요.',
  appInstall:'앱으로 설치하기', appInstalled:'설치했어요. 홈 화면의 아이콘으로 열 수 있어요.', appAlready:'지금 앱으로 열려 있어요.',
  appTabAndroid:'안드로이드 (크롬)', appTabSamsung:'갤럭시 (삼성 인터넷)', appTabIos:'아이폰 / 아이패드', appTabPc:'PC (크롬 / 엣지)',
  appStepsAndroid:['오른쪽 위 \'⋮\' 메뉴를 눌러요','\'앱 설치\' 또는 \'홈 화면에 추가\'를 눌러요','\'설치\'(또는 \'추가\')를 눌러요'],
  appStepsSamsung:['아래쪽 \'≡\' 메뉴를 눌러요','\'현재 페이지 추가\'(또는 \'페이지 추가\')를 눌러요','\'홈 화면\'을 골라 추가해요'],
  appStepsIos:['Safari로 열고, 아래쪽(아이패드는 위쪽) 공유 버튼(□에 ↑)을 눌러요','메뉴를 위로 올려서 \'홈 화면에 추가\'를 눌러요','오른쪽 위 \'추가\'를 눌러요'],
  appStepsPc:['주소창 오른쪽의 설치 아이콘(화면에 ↓ 모양)을 눌러요','\'설치\'를 눌러요','바탕화면이나 시작 메뉴의 아이콘으로 열 수 있어요'],
  appNoteIos:'아이폰 크롬에서도 주소창의 공유 버튼 → \'홈 화면에 추가\'로 똑같이 추가할 수 있어요.',
  appNote:'아이콘을 지우고 싶으면 다른 앱처럼 길게 눌러서 삭제하면 돼요.',
  usage:'DeepL 사용량', usageBtn:'DeepL 사용량 확인', published:'저장했어요. 수십 초 안에 모든 방문자에게 반영돼요.',
  errAuth:'로그인이 만료됐어요. 다시 로그인해 주세요.', errNoStore:'저장소가 설정되지 않았어요 (관리 페이지 참고).', errConflict:'다른 기기에서 먼저 저장됐어요. 새로고침한 뒤 다시 편집해 주세요.', errTooLarge:'데이터가 너무 커요.'
});

/* ================= helpers ================= */
const root = document.getElementById('root');
const esc = s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = n=>String(n).padStart(2,'0');
const clone = o=>JSON.parse(JSON.stringify(o));
const store = {
  get(k){try{return localStorage.getItem(k)}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,v)}catch(e){}},
  del(k){try{localStorage.removeItem(k)}catch(e){}}
};
const setHTML = (id, html)=>{ const el=document.getElementById(id); if(el) el.innerHTML=html };

/* ================= API ================= */
function tokenInfo(){
  const tok = store.get('yz-token'); if(!tok) return null;
  try{ const d=JSON.parse(atob(tok.split('.')[0].replace(/-/g,'+').replace(/_/g,'/'))); return d.exp>Date.now()?{tok,exp:d.exp}:null }catch(e){ return null }
}
async function api(path, body, method){
  const ti = tokenInfo();
  const r = await fetch(path, {method: method||(body?'POST':'GET'), headers: Object.assign({'Content-Type':'application/json'}, ti?{Authorization:'Bearer '+ti.tok}:{}), body: body?JSON.stringify(body):undefined, cache:'no-store'});
  let j=null; try{ j=await r.json() }catch(e){}
  if(!r.ok){ const e=new Error((j&&j.error)||('HTTP '+r.status)); e.status=r.status; e.code=j&&j.code; throw e }
  return j;
}
// Opened straight from disk (file://): no server, so show the bundled data read-only.
const PREVIEW = location.protocol==='file:';
async function loadData(){
  const seed = ()=>{ if(window.SEED) return clone(window.SEED); throw new Error('load') };
  if(PREVIEW) return seed();
  const ti = tokenInfo();
  try{ const r=await fetch('/api/data'+(ti?'?fresh=1':''),{cache:'no-store', headers: ti?{Authorization:'Bearer '+ti.tok}:{}}); if(r.ok) return await r.json() }catch(e){}
  return seed();
}

/* ================= data ================= */
let DATA = {v:2, updated:'', songs:[], cheers:[], storage:false};
function normSong(s){
  s.note = s.note||{ja:'',ko:''};
  s.ytType = ['mv','live','audio','other'].includes(s.ytType) ? s.ytType : '';
  s.lines = (s.lines||[]).flatMap(l=>{
    if(l.kind) return [Object.assign({t:null,kind:'lyric',ly:'',pr:'',tr:'',marks:[],label:'',labelKo:'',c:'',text:'',textKo:'',nj:'',nk:''}, l)];
    const base={t:l.t==null?null:l.t, nj:l.mj||'', nk:l.mk||'', pr:'', tr:'', marks:[], ly:'', label:'', c:'', text:''};
    if(l.ly){
      return [Object.assign({}, base, {kind:'lyric', ly:l.ly, pr:l.sub||'', c:l.act||'', text:l.call||''})];
    }
    return [Object.assign({}, base, {kind:'cheer', label:l.sec||'', c:l.act||'', text:l.call||''})];
  });
  return s;
}
function normData(d){
  d = d||{}; d.songs = Array.isArray(d.songs)?d.songs:[]; d.songs.forEach(normSong);
  d.cheers = Array.isArray(d.cheers)?d.cheers:[]; return d;
}

const S = {
  lang: store.get('yz-lang')==='ko' ? 'ko' : 'ja',
  show: store.get('yz-show') || '',
  loading:true, loadErr:false,
  owner: !!tokenInfo(), editMode:false,
  draft:null, publishing:false, msg:'', msgErr:false, confirmDiscard:false, confirmDel:false, restorable:null,
  autoScroll: store.get('yz-autoscroll')!=='0',
  step:1, ptr:0, tool:'sing', pick:null, srcText:null, importTimes:null, mixFmt:'ptr', mixOpen:false, mix2Open:false, shiftOpen:false, mixMsg:'',
  cform:{ja:'',ko:'',color:'#9EE6CF',icon:'auto_awesome'}, cformOpen:false,
  gen:null, genMsg:'', attMsg:'', fillAll:false, ytDraft:null, lrc:{q:'', artist:'米津玄師', busy:false, results:null, err:'', msg:''},
  login:{busy:false, err:''}, usage:null,
  renderedKey:null, player:null, playerReady:false, songId:null, ytFailed:false
};
const UA = navigator.userAgent||'';
const PLATFORM = /iPhone|iPad|iPod/.test(UA) || (/Macintosh/.test(UA) && navigator.maxTouchPoints>1) ? 'ios'
  : /SamsungBrowser/.test(UA) ? 'samsung' : /Android/.test(UA) ? 'android' : 'pc';
S.appTab = PLATFORM; S.installEvt = null; S.appMsg = '';
const STANDALONE = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone===true;
window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); S.installEvt=e; const b=document.getElementById('app-install'); if(b) b.hidden=false });
window.addEventListener('appinstalled', ()=>{ S.installEvt=null; S.appMsg='installed'; const b=document.getElementById('app-install'); if(b) b.hidden=true; const m=document.getElementById('app-msg'); if(m) m.textContent=t('appInstalled') });
const t = k=>T[S.lang][k]!=null ? T[S.lang][k] : (T.ja[k]!=null?T.ja[k]:k);
const L = (ja,ko)=>S.lang==='ko' ? (ko||ja) : (ja||ko);
const view = ()=>S.draft || DATA;
const songById = id=>view().songs.find(s=>s.id===id);

/* ================= cheers ================= */
const DEFAULT_CHEERS = [
  {id:'cr', ja:'コール&レスポンス', ko:'콜 앤 리스폰스', icon:'campaign', color:'#F2C94C'},
  {id:'shout', ja:'叫ぶ', ko:'외치기', icon:'sports_mma', color:'#F29E7A'},
  {id:'sing', ja:'一緒に歌う', ko:'떼창', icon:'mic', color:'#9CC9F2'},
  {id:'clap', ja:'クラップ', ko:'클랩', icon:'sign_language', color:'#B9E3A0'},
  {id:'jump', ja:'ジャンプ', ko:'점프', icon:'keyboard_double_arrow_up', color:'#F2B8D6'},
  {id:'wave', ja:'手を振る', ko:'손 흔들기', icon:'waving_hand', color:'#C9BEF0'},
  {id:'hands', ja:'手を挙げる', ko:'손 들기', icon:'front_hand', color:'#F5D08A'},
  {id:'towel', ja:'タオル回し', ko:'타올 돌리기', icon:'cyclone', color:'#A6E8DC'},
  {id:'watch', ja:'見どころ', ko:'감상 포인트', icon:'visibility', color:'#D9D6CC'}
];
const CHEER_COLORS = ['#FFE14D','#FF9F7A','#8FD3FF','#B7F07A','#FFB3E1','#C9B6FF','#FFC24D','#9EE6CF'];
const CHEER_ICONS = ['cyclone','campaign','sports_mma','mic','sign_language','keyboard_double_arrow_up','waving_hand','front_hand','flashlight_on','auto_awesome','favorite','local_fire_department','music_note','star','celebration','visibility'];
const safeColor = c=>/^#[0-9a-fA-F]{3,8}$/.test(String(c||''))?c:'#D6D6CE';
const cheers = ()=>DEFAULT_CHEERS.concat((view().cheers||[]).map(c=>Object.assign({}, c, {color:safeColor(c.color)})));
const cheerOf = id=>{ const c=cheers().find(x=>x.id===id); return c ? c : {id, ja:id||'?', ko:id||'?', icon:'star', color:'#D6D6CE'} };
const ICONS = window.ICONS||{};
const ico = n=>`<svg class="ms" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="${ICONS[n]||ICONS.star||''}"/></svg>`;
function chip(id, named){ const c=cheerOf(id); return `<span class="cchip" style="--c:${esc(c.color)}" title="${esc(L(c.ja,c.ko))}">${ico(c.icon)}${named===false?'':`<span>${esc(L(c.ja,c.ko))}</span>`}</span>` }
function cheersUsed(s){ const set=new Set(); s.lines.forEach(l=>{ if(l.c) set.add(l.c); (l.marks||[]).forEach(m=>set.add(m.c)) }); return cheers().map(c=>c.id).filter(id=>set.has(id)) }
const hasCallText = l=>!!(l.text||l.textKo);
function hasCalls(s){ return s.lines.some(l=>l.kind==='cheer' || l.c || hasCallText(l) || (l.marks&&l.marks.length)) }
// Japanese mode: the Japanese call. Korean mode: the Korean call, with the Japanese one beside it when both exist.
function callTexts(l){
  const ja=l.text||'', ko=l.textKo||'';
  if(S.lang==='ko') return ko ? (ja && ja!==ko ? [ko, ja] : [ko]) : (ja?[ja]:[]);
  return ja ? [ja] : (ko?[ko]:[]);
}
const labelOf = l=>L(l.label, l.labelKo);
function callRow(l){
  if(!l.c && !hasCallText(l)) return '';
  const c=cheerOf(l.c); const [main, sub] = callTexts(l);
  return `<div class="callrow">${l.c?chip(l.c):''}${main?`<span class="cl" style="--c:${esc(c.color)}">${esc(main)}</span>`:''}${sub?`<span class="cl-sub" lang="ja">${esc(sub)}</span>`:''}</div>`;
}
function newLine(o){ return Object.assign({t:null,kind:'lyric',ly:'',pr:'',tr:'',marks:[],label:'',labelKo:'',c:'',text:'',textKo:'',nj:'',nk:''},o||{}) }
function markedHtml(text, marks, opt){
  opt = opt||{};
  const chars=[...(text||'')]; const at=new Array(chars.length).fill(null);
  (marks||[]).forEach((m,mi)=>{ for(let k=m.s;k<=m.e&&k<chars.length;k++) at[k]=mi });
  let html='', k=0;
  while(k<chars.length){
    const mi=at[k]; let j=k; while(j<chars.length && at[j]===mi) j++;
    const seg=chars.slice(k,j);
    const inner = opt.interactive ? seg.map((c,x)=>`<span class="ch ${opt.pick===k+x?'pick':''}" data-ci="${k+x}">${c===' '?'&nbsp;':esc(c)}</span>`).join('') : esc(seg.join(''));
    if(mi==null) html+=inner;
    else { const c=cheerOf(marks[mi].c); html+=`<span class="mk" style="--c:${esc(c.color)}" title="${esc(L(c.ja,c.ko))}"><span class="mk-ic">${ico(c.icon)}</span>${inner}</span>` }
    k=j;
  }
  return html;
}

/* ================= time & YouTube ================= */
const clock = {
  base:0, startedAt:0, running:false,
  now(){return this.running ? this.base + (performance.now()-this.startedAt)/1000 : this.base},
  start(){ if(this.running) return; this.startedAt=performance.now(); this.running=true },
  stop(){ if(!this.running) return; this.base=this.now(); this.running=false },
  seek(s){ this.base=Math.max(0,s); this.startedAt=performance.now() },
  reset(){ this.running=false; this.base=0 }
};
function fmt(s){ if(s==null||isNaN(s)) return ''; s=Math.max(0,s); const m=Math.floor(s/60); const r=s-m*60; return m+':'+(r<10?'0':'')+r.toFixed(1) }
function ytId(u){ u=String(u||'').trim(); if(nicoId(u)) return null; if(/^[\w-]{11}$/.test(u)) return u; const m=u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/); return m?m[1]:null }
// niconico: sm / so / nm + digits, from a watch URL, a nico.ms short link, an embed URL or the bare ID
function nicoId(u){ const m=String(u||'').trim().match(/(?:^|nicovideo\.jp\/watch\/|nico\.ms\/)((?:sm|so|nm)\d+)/); return m?m[1]:null }
const hasVid = u => !!(ytId(u) || nicoId(u));
function nicoSearch(song){ return 'https://www.nicovideo.jp/search/'+encodeURIComponent((song.title||'').replace(/\s*[(（]?\s*[+＋].*$/,'')) }
function ytSearch(song){ return 'https://www.youtube.com/results?search_query='+encodeURIComponent('米津玄師 '+(song.title||'').replace(/\s*[(（]?\s*[+＋].*$/,'')) }

let ytLoading=null;
function loadYT(){
  if(ytLoading) return ytLoading;
  ytLoading = new Promise(res=>{
    if(window.YT && window.YT.Player) return res(window.YT);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = ()=>{ if(prev) prev(); res(window.YT) };
    const s=document.createElement('script'); s.src='https://www.youtube.com/iframe_api'; s.async=true; s.onerror=()=>res(null);
    document.head.appendChild(s);
  });
  return ytLoading;
}
function destroyPlayer(){ if(S.player){ try{ S.player.destroy() }catch(e){} } S.player=null; S.playerReady=false }
/* niconico embed player, driven through its (unofficial) postMessage API and wrapped to look like the YouTube player,
   so the clock, sync, seeking and the editor work unchanged. "Playing" is read from the time moving forward. */
const NICO='https://embed.nicovideo.jp';
let nicoSeq=0;
function mountNico(el, id, song){
  const pid='yz'+(++nicoSeq), f=document.createElement('iframe');
  f.src=`${NICO}/watch/${id}?jsapi=1&playerId=${pid}`;
  f.allow='autoplay; fullscreen; encrypted-media'; f.setAttribute('allowfullscreen',''); f.title='niconico';
  f.style.cssText='width:100%;height:100%;border:0;display:block';
  el.replaceWith(f); f.id='ytplayer';
  const st={t:0, len:0, unit:0, lastT:-1, movedAt:0};
  const post=(eventName,data)=>{ try{ f.contentWindow.postMessage(Object.assign({eventName, sourceConnectorType:1, playerId:pid}, data?{data}:{}), NICO) }catch(e){} };
  const me={
    nico:true,
    getCurrentTime(){ return st.t },
    getPlayerState(){ return performance.now()-st.movedAt < 800 ? 1 : 2 },
    getPlaybackRate(){ return 1 },
    playVideo(){ post('play') },
    pauseVideo(){ post('pause') },
    seekTo(t){ post('seek', {time: st.unit===1 ? t : Math.round(t*1000)}); st.t=t; st.lastT=t },
    destroy(){ window.removeEventListener('message', on) }
  };
  const fail=()=>{
    if(S.player!==me) return;
    me.destroy(); S.player=null; S.playerReady=false; S.ytFailed=true;
    const box=f.parentNode; if(box){ box.classList.add('empty'); f.outerHTML=`<div>${ico('smart_display')}<a class="btn ghost sm" href="https://www.nicovideo.jp/watch/${id}" target="_blank" rel="noopener">niconico ↗</a></div>` }
    setHTML('pane-media', parseRoute().view==='edit'?edMedia(song):songMedia(song)); updatePlayer(true);
  };
  function on(e){
    if(e.origin!==NICO || !e.data || e.data.playerId!==pid) return;
    const d=e.data.data||{};
    if(e.data.eventName==='loadComplete'){
      st.len=+(d.videoInfo&&d.videoInfo.lengthInSeconds)||0;
      if(S.player===me){ S.playerReady=true; updatePlayer(true) }
    } else if(e.data.eventName==='playerMetadataChange'){
      const ct=+d.currentTime||0, du=+d.duration||0;
      if(!st.unit && du>0) st.unit = st.len ? (du > st.len*10 ? 1000 : 1) : (du > 20000 ? 1000 : 1);  // ms or seconds
      const t=ct/(st.unit||1000);
      if(st.lastT>=0 && t>st.lastT && t-st.lastT<3) st.movedAt=performance.now();
      st.lastT=t; st.t=t;
      if(S.player===me && !S.playerReady){ S.playerReady=true; updatePlayer(true) }
    } else if(e.data.eventName==='error'){ fail() }
  }
  window.addEventListener('message', on);
  S.player=me; S.playerReady=false;
}
async function mountPlayer(song){
  const el0=document.getElementById('ytplayer'); const nid=nicoId(song.yt);
  if(el0 && nid) return mountNico(el0, nid, song);
  const el=el0; const vid=ytId(song.yt);
  if(!el || !vid) return;
  const YT = await loadYT();
  if(!document.body.contains(el)) return;
  if(!YT){ // YouTube blocked or offline: link out and keep the timer player
    S.ytFailed=true;
    el.parentNode.classList.add('empty');
    el.outerHTML=`<div>${ico('smart_display')}<a class="btn ghost sm" href="https://www.youtube.com/watch?v=${vid}" target="_blank" rel="noopener">YouTube ↗</a></div>`;
    setHTML('pane-media', parseRoute().view==='edit'?edMedia(song):songMedia(song)); updatePlayer(true);
    return;
  }
  const me = S.player = new YT.Player(el, {videoId:vid, width:'100%', height:'100%',
    playerVars:{playsinline:1, rel:0, modestbranding:1},
    events:{ onReady:()=>{ if(S.player===me){ S.playerReady=true; updatePlayer(true) } }, onStateChange:()=>updatePlayer(true) }});
}
const ytT = {v:-1, at:0};
const LEAD = 0.3; // light a line up this many seconds early: it then *looks* on time
const media = {
  get yt(){ return !!(S.player && S.playerReady) },
  now(){
    if(this.yt){ try{
      // YouTube only updates its time every ~0.1-0.25s: fill the gaps ourselves while playing
      const v=S.player.getCurrentTime()||0, pn=performance.now(), pl=S.player.getPlayerState()===1;
      if(v!==ytT.v || !pl){ ytT.v=v; ytT.at=pn; return v }
      return v + Math.min(S.player.nico?1.5:0.5, (pn-ytT.at)/1000*(S.player.getPlaybackRate?S.player.getPlaybackRate()||1:1));
    }catch(e){} }
    return clock.now();
  },
  get running(){ if(this.yt){ try{ return S.player.getPlayerState()===1 }catch(e){ return false } } return clock.running },
  play(){ if(this.yt) S.player.playVideo(); else clock.start(); updatePlayer(true) },
  pause(){ if(this.yt) S.player.pauseVideo(); else clock.stop(); updatePlayer(true) },
  toggle(){ this.running?this.pause():this.play() },
  seek(t){ t=Math.max(0,t); if(this.yt) S.player.seekTo(t,true); else clock.seek(t); lastActive=''; updatePlayer(true) }
};

/* ================= routing & render ================= */
function parseRoute(){
  const h=(location.hash||'').slice(1);
  if(h.startsWith('song-')) return {view:'song', id:h.slice(5)};
  if(h.startsWith('edit-')) return {view:'edit', id:h.slice(5)};
  if(h==='admin') return {view:'admin'};
  if(h==='request') return {view:'request'};
  if(h==='lives'||h==='receipt'||/^y-\d{4}$/.test(h)) return {view:'lives', anchor:h};
  if(h==='stats'||h.startsWith('st-')){ S.liveMode='stats'; try{ history.replaceState(null,'','#lives') }catch(e){} return {view:'lives', anchor:'lives'} }
  if(h==='chant'||h==='watch'||h==='manner'||h.startsWith('disc-')) return {view:'chant', anchor:h==='watch'?'chant':h};
  return {view:'home', anchor:['info','dates','tickets','members','history','app'].includes(h)?h:'info'};
}
function render(keep){
  document.documentElement.lang = S.lang;
  { const tt = tourMode() ? '米津玄師 Fanpage — GHOST' : '米津玄師 Fanpage'; if(document.title!==tt) document.title=tt }
  if(S.loading||S.loadErr){ root.innerHTML = `<div class="boot"><span class="bubble ${tourMode()?'':'kanji'}">${tourMode()?'GHOST':'米津玄師'}</span><p>${S.loadErr?t('loadErr'):t('loading')}</p></div>`; return }
  const r=parseRoute();
  let song=null;
  if(r.view==='song'||r.view==='edit'){ song=songById(r.id); if(!song){ location.hash='chant'; return } }
  const editing = r.view==='edit' && S.owner;
  if(editing) song = curSong();
  const key = [r.view, r.id||'', song?(ytId(song.yt)||nicoId(song.yt)||''):'', editing?'e':''].join('|');
  const y = window.scrollY; let rebuilt = false;
  if(key!==S.renderedKey || !document.getElementById('pane')){
    destroyPlayer();
    const songScreen = !!(song&&!editing);
    if(songScreen && window.scrollY>0) window.scrollTo(0,0); // let the phone's toolbars settle before locking the page
    document.documentElement.classList.toggle('song-root', songScreen);
    document.documentElement.classList.toggle('song-playing', songScreen && r.view==='song' && S.compactSong===r.id);
    if(!(songScreen && S.compactSong===r.id)){ S.compactSong=null; wasRun=false }
    if(songScreen) setVVH();
    root.innerHTML = `<div class="app ${song?'media-page':''} ${song&&!editing?'song-mode':''}"><aside class="side" id="side" aria-label="Menu"></aside><main>${song?'<div id="obar"></div>'+frame(song, editing):frame(song, editing).replace('<div id="pane">','<div id="obar"></div><div id="pane">')}</main></div>`;
    S.renderedKey = key; sideKey = ''; rebuilt = true;
    fill(r, song, editing);
    if(song){ const k=key; requestAnimationFrame(()=>setTimeout(()=>{ if(S.renderedKey===k) mountPlayer(song) }, 30)) }
    if(!keep){
      requestAnimationFrame(()=>{
        // back from a song page to the song list: return to where the viewer was
        if(r.view==='chant' && r.anchor==='chant' && S.fromSong && S.chantY>0){ window.scrollTo(0, S.chantY); S.fromSong=false; return }
        S.fromSong=false;
        const a = r.anchor && r.anchor!=='info' && r.anchor!=='chant' && r.anchor!=='stats' ? document.getElementById(r.anchor) : null;
        if(a) a.scrollIntoView({block:'start'}); else window.scrollTo(0,0);
      });
    }
  } else fill(r, song, editing);
  if(keep) window.scrollTo(0,y);
  tick();
  setActive(song ? 'disc-'+(song.disc||'other') : (r.view==='admin'||r.view==='request'?'':(r.anchor||'info')));
  if(rebuilt) spy(); else syncHeader();
  if(song) updatePlayer(true);
  if(editing && S.flashLine!=null && S.step===4){ const fl=S.flashLine; requestAnimationFrame(()=>{ const el=document.querySelector(`.c4[data-i="${fl}"]`); if(el) el.scrollIntoView({block:'center'}) }); setTimeout(()=>{ S.flashLine=null; document.querySelectorAll('.c4.flash').forEach(x=>x.classList.remove('flash')) }, 4000) }
  syncFab();
  if(editing && S.reqMsg && S.step===4 && !document.getElementById('rq-applied')){ const p=document.querySelector('.ed-panel h3'); if(p) p.insertAdjacentHTML('afterend', `<p class="okmsg" id="rq-applied">${esc(S.reqMsg)}</p>`) }
}
const YT_TYPES=[['','ytNone'],['mv','ytMV'],['live','ytLive'],['audio','ytAudio'],['other','ytOther']];
const ytBadge = s=>s.ytType && hasVid(s.yt) ? `<span class="yt-badge yt-${s.ytType}">${esc(t(YT_TYPES.find(x=>x[0]===s.ytType)[1]))}</span>` : '';
function videoBox(song){
  const vid=hasVid(song.yt);
  if(vid) return `<div class="video-frame">${ytBadge(song)}<div id="ytplayer"></div><button type="button" class="vf-expand" data-act="miniVid" aria-label="${t('miniOff')}">${ico('arrow_upward')}</button></div>`;
  return `<div class="video-frame empty"><div>${ico('smart_display')}<b>${t('noVideo')}</b>${S.owner?`<small>${t('noVideoOwner')}</small>`:''}<span class="vf-search"><a class="btn ghost sm" href="${esc(ytSearch(song))}" target="_blank" rel="noopener">${t('ytSearch')} ↗</a><a class="btn ghost sm" href="${esc(nicoSearch(song))}" target="_blank" rel="noopener">${t('nicoSearch')} ↗</a></span></div></div>`;
}
function frame(song, editing){
  if(!song) return `<div class="cbar" id="cbar" aria-hidden="true"><b id="cbar-t"></b><small id="cbar-s"></small></div><div id="pane"></div>`;
  if(editing) return `<div class="view ed-page"><div id="pane-top"></div>
    <div class="ed-layout"><aside class="ed-side"><div class="media-box">${videoBox(song)}<div id="pane-media"></div></div><div id="pane-a"></div></aside>
    <div class="ed-main" id="pane"></div></div></div>`;
  return `<div class="view song-page"><div id="pane-top"></div>
    <div class="song-body"><div class="song-media">${videoBox(song)}<div id="pane-media"></div></div><div id="pane" class="lyr-scroll"></div></div></div>`;
}
let sideKey = '';
function fill(r, song, editing){
  const sk = [S.chantSort, S.lang, (r.view==='chant'||r.view==='song'||r.view==='edit')?'c':r.view==='lives'?'l':'m', S.owner, S.editMode, view().songs.map(x=>x.disc).join()].join('|');
  if(sk!==sideKey || !document.querySelector('#side .nav')){ setHTML('side', sideInner(r)); sideKey=sk }
  setHTML('obar', ownerBar());
  if(!song){ setHTML('pane', r.view==='home'?homeView():r.view==='chant'?chantView():r.view==='lives'?livesView():r.view==='request'?requestView():adminView()); if(r.view==='admin' && S.owner && S.reqs==null && !S.reqLoading) setTimeout(loadReqs); return }
  if(editing){ setHTML('pane-top', edTop(song)); setHTML('pane-media', edMedia(song)); setHTML('pane-a', songFields(song)); setHTML('pane', edMain(song)); return }
  setHTML('pane-top', songTop(song)); setHTML('pane-media', songMedia(song)); setHTML('pane', songLyrics(song));
}

/* ================= side & owner bar ================= */
function sideInner(r){
  const inCall = r.view==='chant'||r.view==='song'||r.view==='edit';
  const songs = view().songs;
  const nav = r.view==='lives'
    ? `<li><a href="#lives" data-sec="lives">${t('navLives')} <small>Lives</small></a></li>` +
      liveYears().map(y=>`<li><a href="#y-${y}" data-sec="y-${y}">${y}</a></li>`).join('') +
      `<li><a href="#receipt" data-sec="receipt">${t('navReceipt')} <small>Receipt</small></a></li>`
    : inCall
    ? `<li><a href="#chant" data-sec="chant">${t('navCallTop')} <small>Songs</small></a></li>` +
      DISCS.filter(d=>S.chantSort==='album' && songs.some(s=>(s.disc||'other')===d.id)).map(d=>`<li><a href="#disc-${d.id}" data-sec="disc-${d.id}" class="ja">${esc(discName(d))}</a></li>`).join('') +
      `<li><a href="#manner" data-sec="manner">${t('navManner')} <small>Manner</small></a></li>`
    : `<li><a href="#info" data-sec="info">${tourMode()?t('navInfo'):t('tabMain')} <small>${tourMode()?'Info':'Top'}</small></a></li>
       ${tourMode()?`<li><a href="#dates" data-sec="dates">${t('datesH')} <small>Dates</small></a></li>`:''}
       <li><a href="#tickets" data-sec="tickets">${t('navTickets')} <small>Tickets</small></a></li>
       <li><a href="#members" data-sec="members">${t('navMembers')} <small>Profile</small></a></li>
       <li><a href="#history" data-sec="history">${t('navHistory')} <small>History</small></a></li>
       <li><a href="#app" data-sec="app">${t('navApp')} <small>App</small></a></li>`;
  const home = !inCall && r.view!=='lives';
  return `<div class="side-top">
      <a class="brand" href="#info"><span class="bubble ${tourMode()?'':'kanji'}">${tourMode()?'GHOST':'米津玄師'}</span><small>${tourMode()?`${S.lang==='ko'?'요네즈 켄시':'米津玄師'} · ${t('fanpage')}`:`${S.lang==='ko'?'요네즈 켄시 · ':''}${t('fanBrand')}`}</small></a>
      <div class="seg tabs"><a href="#info" ${home?'aria-current="page"':''}>${t('tabMain')}</a><a href="#chant" ${inCall?'aria-current="page"':''}><span class="tl-l">${S.lang==='ja'?t('tabSongs'):t('tabCall')}</span><span class="tl-s">${S.lang==='ko'?'콜':'曲'}</span></a><a href="#lives" ${r.view==='lives'?'aria-current="page"':''}>${t('tabLive')}</a></div>
      <div class="seg lang" role="group" aria-label="Language"><button type="button" data-act="lang" data-v="ja" aria-pressed="${S.lang==='ja'}">日本語</button><button type="button" data-act="lang" data-v="ko" aria-pressed="${S.lang==='ko'}">한국어</button></div>
    </div>
    <ul class="nav">${nav}</ul>
    ${tourMode()?`<div class="dday"><small>${S.lang==='ko'&&isKR(featuredShow())?t('krToBudo'):t('toBudo')}</small><b id="side-d">${ddayText()}</b></div>`:''}
    ${DEBUTS.map(x=>`<div class="dday debut"><small>${esc(L(x.ja,x.ko))}</small><b id="side-debut-${x.id}">${debutDays(x.d)}${t('debutUnit')}</b></div>`).join('')}
    ${S.owner?`<button type="button" class="btn ${S.editMode?'':'ghost'} sm" data-act="editmode">${S.editMode?t('ownerOff'):'✎ '+t('ownerOn')}</button>`:''}`;
}
const pack = d=>JSON.stringify([d.songs, d.cheers||[]]);
function ownerBar(){
  if(!S.owner) return '';
  if(S.restorable && !S.draft) return `<div class="ownerbar"><b>${t('restore')}</b><button class="btn sm" data-act="restore">${t('restoreYes')}</button><button class="btn ghost sm" data-act="dropRestore">${t('restoreNo')}</button></div>`;
  const dirty = S.draft && pack(S.draft)!==pack(DATA);
  if(!dirty && !S.msg) return '';
  return `<div class="ownerbar ${S.msgErr?'err':''}">
    ${dirty?`<b>● ${t('draftBar')}</b>
    <button class="btn sm" data-act="publish" ${S.publishing?'disabled':''}>${S.publishing?t('publishing'):t('publish')}</button>
    ${S.confirmDiscard?`<button class="btn ghost sm danger" data-act="discardYes">${t('discardSure')}</button><button class="btn ghost sm" data-act="discardNo">${t('cancel')}</button>`:`<button class="btn ghost sm" data-act="discard" ${S.publishing?'disabled':''}>${t('discard')}</button>`}`:''}
    ${S.msg?`<span class="msg" role="status">${esc(S.msg)}</span>`:''}
  </div>`;
}
function refreshBar(){ setHTML('obar', ownerBar()) }

/* ================= home ================= */
function homeView(){
  const now = new Date(), TOUR = tourMode();
  const info = INFO[S.lang].map(([a,b,c])=>`<dt>${esc(a)}</dt><dd>${esc(b)}<small>${esc(c)}</small></dd>`).join('');
  const sched = SCHED.map(x=>{
    let st='stSoon',cls='';
    if(x.fixed || now>new Date(x.to)){st='stDone';cls='done'} else if(now>=new Date(x.from)){st='stLive';cls='live'}
    return `<li><b>${esc(L(x.ja,x.ko))}</b><span class="pill ${cls}">${t(st)}</span><span class="when">${esc(L(x.wj,x.wk))}</span></li>`;
  }).join('');
  const nx = featuredShow();
  const band = MEMBERS.map(m=>`
    <article class="member">
      <span class="part">${m.part}</span>
      <h3>${esc(m.ja)}${S.lang==='ko'?`<small>${esc(m.ko)}</small>`:''}</h3>
      <p class="since">${m.since}${S.lang==='ko'?'년':'年'}${t('since')}</p>
    </article>`).join('');
  const A = ARTIST;
  const tagText={live:'LIVE',rel:'RELEASE',news:'NEWS',next:'COMING',ghost:'GHOST'}, tagCls={rel:'rel',next:'next',ghost:'next'};
  const years = Object.entries(HISTORY).map(([y,items])=>`
    <div class="year"><h3 class="bubble">${y}</h3><ul class="tl">${items.map(i=>`
      <li class="${i.big?'big':''} ${i.k==='ghost'?'budo':''}"><span class="d">${i.d}</span>
        <div class="ev"><b><span class="tag ${tagCls[i.k]||''}">${tagText[i.k]}</span>${esc(L(i.tj,i.tk))}</b>${L(i.pj,i.pk)?`<p>${esc(L(i.pj,i.pk))}</p>`:''}</div></li>`).join('')}
    </ul></div>`).join('');
  const gl = LIVES.filter(l=>l.tour==='ghost' && hasSet(l));
  const freq={}; gl.forEach(l=>new Set(setOf(l)).forEach(s=>freq[s]=(freq[s]||0)+1));
  const bars = Object.entries(freq).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'ja')).map(([s,v])=>`
    <li><span class="nm" title="${esc(s)}">${songLink(s)}</span><span class="track" aria-hidden="true"><span class="fill" style="width:${v/gl.length*100}%;--c:${groupMeta(groupOf(s)).c}"></span></span><span class="v">${v}/${gl.length}</span></li>`).join('');
  return `<div class="view">
    <section id="info">
      <div class="hero">
        <div class="hero-lines" aria-hidden="true">${(TOUR?['KENSHI','YONEZU','2026','2027','WORLD','TOUR']:['SINCE','2009','FAN','PAGE']).map(x=>`<span>${x}</span>`).join('')}</div>
        <h1 class="hero-title ${TOUR?'':'fan'}" aria-label="${TOUR?'KENSHI YONEZU 2026 TOUR / GHOST':'米津玄師 FAN PAGE'}" ${TOUR?'':'lang="ja"'}>${(TOUR?'GHOST':'米津玄師').split('').map((c,i)=>`<span style="--i:${i}">${c}</span>`).join('')}</h1>
        <p class="hero-ja">${TOUR?'米津玄師 2026 TOUR / GHOST':t('heroFanJa')}</p>
        <div class="hero-world">${TOUR?t('heroWorld'):t('heroFanSub')}</div>
        ${TOUR ? heroTourBits(nx) : lastTourCard()}
        <div class="debut-days">${DEBUTS.map(x=>`<div><span>${esc(L(x.ja,x.ko))}</span> <b id="debut-${x.id}">${debutDays(x.d)}</b>${t('debutUnit')} <small>${x.d.replace(/-/g,'.')} — ${esc(L(x.sj,x.sk))}</small></div>`).join('')}</div>
      </div>
      ${TOUR?`<div class="sec-head"><h2 class="bubble">Live Info</h2><p>${t('infoLabel')}</p></div>
      <div class="info-grid one"><div><h3 class="sub-h">${t('outline')}</h3><dl class="dl">${info}</dl></div></div>`:''}
    </section>
    ${TOUR?`<section id="dates">
      <div class="sec-head"><h2 class="bubble">Tour Dates</h2><p>${t('datesJp')} · ${t('datesWorld')}</p></div>
      <div class="dates-grid">
        <ol class="dates">${GHOST_DATES.filter(g=>!g.world).map(dateRow).join('')}</ol>
        <ol class="dates world">${GHOST_DATES.filter(g=>g.world).map(dateRow).join('')}</ol>
      </div>
    </section>`:''}
    ${ticketSection()}
    <section id="members">
      <div class="sec-head"><h2 class="bubble">Profile</h2><p>${t('membersLabel')}</p></div>
      <p class="lead">${t('membersLead')}</p>
      <article class="artist">
        <div class="artist-name"><h3>${A.ja}</h3><span>${S.lang==='ko'?A.ko+' · ':''}${A.en}</span></div>
        <dl class="facts"><dt>${t('bd')}</dt><dd>${A.bd}</dd><dt>${t('from')}</dt><dd>${L(A.fj,A.fk)}</dd><dt>${t('blood')}</dt><dd>${A.blood}${t('bloodSuffix')}</dd><dt>${t('height')}</dt><dd>${A.h}</dd><dt>${t('alias')}</dt><dd>ハチ</dd></dl>
        <p>${esc(L(A.bj,A.bk))}</p>
        <div class="works">${(S.lang==='ko'?A.wk:A.wj).map(w=>`<span>${esc(w)}</span>`).join('')}</div>
      </article>
      <h3 class="sub-h band-h">${t('bandH')}</h3>
      <div class="members">${band}</div>
    </section>
    <section id="history">
      <div class="sec-head"><h2 class="bubble">History</h2><p>${t('historyLabel')}</p></div>
      <p class="lead">${t('historyLead')}</p>
      <div class="years">${years}</div>
    </section>
    ${appGuide()}
    ${footer()}
  </div>`;
}
function tourMode(){
  const q=(location.search.match(/[?&]mode=(tour|fan)\b/)||[])[1]; if(q) return q==='tour';
  if(typeof SITE_MODE!=='undefined' && SITE_MODE!=='auto') return SITE_MODE==='tour';
  const last=GHOST_DATES[GHOST_DATES.length-1]; return Date.now() < showStart(last).getTime()+2*864e5;
}
function ticketSection(){
  return `<section id="tickets">
      <div class="sec-head"><h2 class="bubble">Tickets</h2><p>${t('ticketLabel')}</p></div>
      ${S.lang==='ko'&&krLeft().length?`<div class="kr-ticket"><h3 class="sub-h">${t('krTicketH')}</h3><dl class="dl">${KR_TICKET.rows.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
        <p><a class="btn sm" href="${KR_TICKET.url}" target="_blank" rel="noopener">${t('krTicketBtn')}</a></p></div>
      <h3 class="sub-h jp-guide-h">${t('jpTicketH')}</h3>`:''}
      <p class="lead">${t('ticketLead')}</p>
      <ol class="ticket-steps">${TICKET_GUIDE[S.lang].map(([h,p],i)=>`<li><span class="no">${pad(i+1)}</span><div><h4>${esc(h)}</h4><p>${esc(p)}</p></div></li>`).join('')}</ol>
      <p class="small-note ticket-world">${t('ticketWorld')}</p>
      <p class="ticket-links">${TICKET_LINKS.map(([u,k])=>`<a class="btn ghost sm" href="${u}" target="_blank" rel="noopener">${t(k)}</a>`).join('')}</p>
    </section>`;
}
function heroTourBits(nx){
  return `        ${nx?`<div class="hero-next ${S.lang==='ko'&&isKR(nx)?'kr':''}"><small>${S.lang==='ko'&&isKR(nx)?t('krShow'):t('nextShow')}</small><b>${fmtD(nx.d)} <span>${dow(nx.d)}</span></b><span>${esc(L(nx.city,nx.cityKo))} · ${esc(nx.v)}</span><span class="mono">${nx.st?`${nx.op?t('open')+' '+nx.op+' / ':''}${t('start')} ${nx.st}`:t('timeTbd')}</span></div>`:`<div class="hero-next"><b>${t('allDone')}</b></div>`}
        <div class="count"><div><b id="c-d">--</b><span>DAYS</span></div><div><b id="c-h">--</b><span>HRS</span></div><div><b id="c-m">--</b><span>MIN</span></div><div><b id="c-s">--</b><span>SEC</span></div></div>
        <div class="hero-dday" id="hero-d">${ddayText()}</div>
        <div class="count-note" id="c-note">${S.lang==='ko'&&isKR(nx)?t('krCountNote'):t('countNote')}</div>`;
}
function lastTourCard(){
  const ls=LIVES.filter(l=>l.tour==='ghost' && l.d<=TODAY).sort((a,b)=>a.d<b.d?-1:1);
  if(!ls.length) return '';
  const f=ls[0].d.replace(/-/g,'.'), e=ls[ls.length-1].d.replace(/-/g,'.');
  return `<div class="hero-next"><small>${t('lastTour')}</small><b>GHOST</b><span>${f} — ${e} · ${t('lastTourN').replace('{n}',ls.length)}</span><a class="btn ghost sm" href="#lives">${t('toLives')}</a></div>`;
}
const DOW = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const dow = d=>DOW[new Date(d+'T12:00:00Z').getUTCDay()];
function nextShow(){ const now=Date.now(); return GHOST_DATES.find(g=>showStart(g).getTime()+3.5*3600e3 > now) || null }
const isKR = g=>!!g && g.city==='ソウル';
const krLeft = ()=>{ const now=Date.now(); return GHOST_DATES.filter(g=>isKR(g) && showStart(g).getTime()+3.5*3600e3 > now) };
// the show the home page counts down to: Japanese view = the nearest show, Korean view = the next Korea show (then the nearest)
function featuredShow(){ if(S.lang==='ko'){ const k=krLeft()[0]; if(k) return k } return nextShow() }
function dateRow(g){
  const now=Date.now(), st=showStart(g).getTime(), nx=nextShow();
  const done = st+3.5*3600e3 < now, isNext = nx===g, live = isNext && now>=st;
  const l = LIVES.find(x=>x.tour==='ghost' && x.d===g.d);
  const label = done ? t('played') : live ? 'LIVE' : isNext ? 'NEXT' : '';
  return `<li class="${done?'done':''} ${isNext?'next':''} ${S.lang==='ko'&&isKR(g)?'kr':''}">
    <span class="dt">${fmtD(g.d.slice(5))}<small>${dow(g.d)}</small></span>
    <span class="dv"><b>${esc(L(g.city,g.cityKo))}</b><small>${esc(g.v)}${g.fin?' · FINAL':''}</small></span>
    <span class="dst">${g.st?g.st:'—'}</span>
    ${label?`<span class="pill ${done?'done':'live'}">${label}</span>`:'<span></span>'}
  </li>`;
}
function recentShows(){
  const ghost = LIVES.filter(l=>l.tour==='ghost' && hasSet(l)).sort((a,b)=>a.d<b.d?1:-1);
  const finals = ['junk','kuso','henshin','hype','opal'].map(tid=>{ const ls=LIVES.filter(l=>l.tour===tid && l.k==='S' && hasSet(l) && /[都道府県]$/.test(l.p)).sort((a,b)=>a.d<b.d?1:-1); return ls[0] }).filter(Boolean);
  return ghost.concat(finals);
}
const tourName = id=>{ const x=(window.TOURS||[]).find(t=>t.id===id); return x?x.name:'' };
const ghostCity = l=>{ const g=GHOST_DATES.find(x=>x.d===l.d); return g?L(g.city,g.cityKo):l.v };
function showCard(){
  const shows = recentShows(); const sh = shows.find(x=>x.id===S.show)||shows[0];
  if(!sh) return '';
  const nw=new Set(sh.new||[]), dl=new Set(sh.daily||[]);
  const li = (n,s)=>{ const so=songFor(s); return `<li><span class="n">${n}</span><span class="s">${so?`<a href="#song-${esc(so.id)}">${esc(s)}</a>`:esc(s)}${nw.has(s)?`<em class="flag n">${t('premiere')}</em>`:''}${dl.has(s)?`<em class="flag d">${t('daily')}</em>`:''}</span>${so&&hasCalls(so)?`<a class="callchip" href="#song-${esc(so.id)}">CALL</a>`:'<span></span>'}</li>` };
  let html = (sh.s||[]).map((s,i)=>li(pad(i+1),s)).join('');
  if((sh.e||[]).length) html += `<li class="en-label">${t('encore')}</li>` + sh.e.map((s,i)=>li('EN'+(i+1),s)).join('');
  return `<div class="show-card"><div class="show-meta"><div class="when">${fmtD(sh.d)} ${dow(sh.d)}</div><h3>${esc(sh.t)}</h3><div class="ja">${esc(sh.v)} · ${esc(prefName(sh.p))}</div>
    <div class="num">${setOf(sh).length}<small>${t('songsUnit')}</small></div>${sh.note?`<p>${esc(sh.note)}</p>`:''}<p class="small-note">${t('rcSrc')}</p></div><ol class="songs">${html}</ol></div>`;
}
function appGuide(){
  const tabs=[['android','appTabAndroid','appStepsAndroid'],['samsung','appTabSamsung','appStepsSamsung'],['ios','appTabIos','appStepsIos'],['pc','appTabPc','appStepsPc']];
  const cur = tabs.find(x=>x[0]===S.appTab)||tabs[0];
  return `<section id="app">
      <div class="sec-head"><h2 class="bubble">App</h2><p>${t('appLabel')}</p></div>
      <div class="app-guide">
        <div class="app-icon"><img src="/icon-192.png" alt="" width="96" height="96"><b>米津玄師 Fanpage</b></div>
        <div class="app-body">
          <p class="lead">${t('appLead')}</p>
          ${STANDALONE?`<p class="okmsg">${t('appAlready')}</p>`:`
          <div class="ed-actions"><button type="button" class="btn" id="app-install" data-act="install" ${S.installEvt?'':'hidden'}>${ico('download')} ${t('appInstall')}</button></div>
          <p class="okmsg" id="app-msg" role="status">${S.appMsg==='installed'?t('appInstalled'):''}</p>`}
          <div class="chips show-pick" role="tablist">${tabs.map(([id,k])=>`<button type="button" role="tab" data-act="appTab" data-v="${id}" aria-pressed="${id===cur[0]}" aria-selected="${id===cur[0]}">${t(k)}</button>`).join('')}</div>
          <ol class="howto">${t(cur[2]).map(x=>`<li>${esc(x)}</li>`).join('')}</ol>
          ${cur[0]==='ios'?`<p class="small-note">${t('appNoteIos')}</p>`:''}
          <p class="small-note">${t('appNote')}</p>
        </div>
      </div>
    </section>`;
}
/* ================= live history + receipt ================= */
const LIVES = window.LIVES || [];
const TODAY = (()=>{ const d=new Date(Date.now()+9*3600e3); return d.toISOString().slice(0,10) })(); // Japan date
const isPast = l=>l.d <= TODAY;
const liveYears = ()=>[...new Set(LIVES.map(l=>l.d.slice(0,4)))].sort().reverse();
function loadPicked(){ try{ return new Set(JSON.parse(store.get('yz-attended')||'[]')) }catch(e){ return new Set() } }
S.picked = loadPicked(); S.liveKind = 'all';
S.nick = (store.get('yz-nick')||'').slice(0,20);
const nickShown = ()=>S.nick.trim();
function savePicked(){ store.set('yz-attended', JSON.stringify([...S.picked])) }
const kindName = k=>t({S:'kS',F:'kF',E:'kE'}[k]);
const PREF_KO = {'徳島県':'도쿠시마현','福井県':'후쿠이현','熊本県':'구마모토현','兵庫県':'효고현','和歌山県':'와카야마현','岡山県':'오카야마현','福島県':'후쿠시마현','鹿児島県':'가고시마현','愛媛県':'에히메현','香川県':'가가와현','茨城県':'이바라키현','長野県':'나가노현','アメリカ':'미국','イギリス':'영국','フランス':'프랑스','中国':'중국','メキシコ':'멕시코','カナダ':'캐나다','オランダ':'네덜란드','北海道':'홋카이도','宮城県':'미야기현','埼玉県':'사이타마현','千葉県':'지바현','東京都':'도쿄도','神奈川県':'가나가와현','新潟県':'니가타현','山梨県':'야마나시현',
  '愛知県':'아이치현','京都府':'교토부','大阪府':'오사카부','広島県':'히로시마현','山口県':'야마구치현','福岡県':'후쿠오카현','韓国':'한국','台湾':'대만','シンガポール':'싱가포르'};
const prefName = p=>S.lang==='ko' ? (PREF_KO[p]||p) : p;
const fmtD = d=>d.replace(/-/g,'.');
function songLink(title){
  const so = songFor(title);
  return so ? `<a href="#song-${esc(so.id)}">${esc(title)}</a>` : esc(title);
}
const liveFlags = (l,x)=>((l.new||[]).includes(x)?` <em class="flag n">${t('premiere')}</em>`:'')+((l.daily||[]).includes(x)?` <em class="flag d">${t('daily')}</em>`:'');
/* ---- lives: shared filters (year / kind / search) for the list and the setlist statistics ---- */
S.liveYear='all'; S.liveQ=''; S.lsAll=false;
S.liveMode = store.get('yz-live-mode')==='stats' ? 'stats' : 'list';
function liveFiltered(){
  const q=S.liveQ.trim().toLowerCase();
  return LIVES.filter(l=>(S.liveYear==='all'||l.d.startsWith(S.liveYear)) && (S.liveKind==='all'||l.k===S.liveKind) && (!q || (l.t+' '+l.v+' '+l.p).toLowerCase().includes(q)));
}
const lsNorm = x=>String(x||'').replace(/^\*/,'').replace(/！/g,'!').replace(/\s+/g,' ').trim().toLowerCase();
function lsCalc(){
  const ls = liveFiltered().filter(l=>l.d<=TODAY && setOf(l).length && (S.ghostOn || l.tour!=='ghost'));
  const byTitle = new Map(); view().songs.forEach(so=>{ const k=lsNorm(so.title); if(!byTitle.has(k)) byTitle.set(k,so) });
  const key = x=>{ const so=byTitle.get(lsNorm(x)); return so ? so.id : '~'+String(x).replace(/^\*/,'') };
  const cnt=new Map(), first=new Map(), last=new Map(); let total=0;
  const add=(m,k)=>m.set(k,(m.get(k)||0)+1);
  ls.forEach(l=>{ const set=setOf(l); total+=set.length; set.forEach(x=>add(cnt,key(x))); add(first,key(set[0])); add(last,key(set[set.length-1])) });
  return {n:ls.length, total, cnt, first, last, ls};
}
const lsSong = k=>k.startsWith('~') ? null : view().songs.find(so=>so.id===k);
const lsTitle = k=>{ const so=lsSong(k); return so ? so.title : k.slice(1) };
const lsLink = k=>{ const so=lsSong(k); return so ? `<a href="#song-${esc(so.id)}">${esc(so.title)}</a>` : `<span>${esc(k.slice(1))}</span>` };
const lsSort = m=>[...m].sort((a,b)=>b[1]-a[1]||lsTitle(a[0]).localeCompare(lsTitle(b[0]),'ja'));
function lsStatsHtml(){
  const R = lsCalc();
  if(!R.n) return ghostSwitch(true)+`<p class="ls-empty">${t('lsNone')}</p>`;
  const rank = lsSort(R.cnt), max = rank[0][1];
  const shown = S.lsAll ? rank : rank.slice(0,15);
  const top5 = m=>`<ol class="ls-top">${lsSort(m).slice(0,5).map(([k,v])=>`<li><div class="r"><span class="nm">${lsLink(k)}</span><span class="v">${v}</span></div></li>`).join('')}</ol>`;
  const unplayed = view().songs.filter(so=>!R.cnt.has(so.id));
  const tile = (lab,v)=>`<div class="ls-tile"><span>${lab}</span><b>${v}</b></div>`;
  return `${ghostSwitch(true)}<div class="ls-tiles">${tile(t('lsShows'),R.n)}${tile(t('lsTotal'),R.total)}${tile(t('lsUnique'),R.cnt.size)}${tile(t('lsAvg'),(R.total/R.n).toFixed(1))}</div>
    <p class="ls-basis">${t('lsBasis')}</p>
    <div class="ls-grid">
      <div class="ls-card ls-rank-card"><h3>${t('lsRankH')}</h3>
        <ol class="ls-rank">${shown.map(([k,v])=>`<li><span class="nm">${lsLink(k)}</span><span class="bar"><i style="width:${(v/max*100).toFixed(1)}%"></i></span><span class="v">${v}<small> ${Math.round(v/R.n*100)}%</small></span></li>`).join('')}</ol>
        ${rank.length>15?`<button type="button" class="ls-more" data-act="lsAll">${S.lsAll?t('lsTopOnly'):t('lsShowAll')+' ('+rank.length+')'}</button>`:''}
      </div>
      <div class="ls-side">
        <div class="ls-card"><h3>${t('lsFirstH')}</h3>${top5(R.first)}</div>
        <div class="ls-card"><h3>${t('lsLastH')}</h3>${top5(R.last)}</div>
        ${unplayed.length?`<div class="ls-card"><h3>${t('lsUnplayedH')} <small>${unplayed.length}</small></h3><div class="ls-chips">${unplayed.map(so=>`<a href="#song-${esc(so.id)}">${esc(so.title)}</a>`).join('')}</div></div>`:''}
      </div>
    </div>
    ${lsAlbumTourHtml(R.ls)}`;
}
// Album share for the filtered shows + per-tour breakdown / within-tour changes (moved here from the old stats tab)
function lsAlbumTourHtml(ls){
  const A = agg(ls), g = groupMix(A);
  const album = `<div class="ls-card ls-wide"><h3>${t('albumMixH')}</h3><p class="hint">${t('albumMixP')}</p>${mixBar(g, A.plays, true)}${legend()}${mixTable(g, A.plays)}</div>`;
  const ids = new Set(ls.map(l=>l.tour).filter(Boolean));
  const tours = tourList().filter(x=>ids.has(x.id));
  let tourPart;
  if(S.statTour!=='all' && (window.TOURS||[]).some(x=>x.id===S.statTour)){
    tourPart = `<button type="button" class="btn ghost sm" data-act="statTour" data-v="all">← ${t('tourBack')}</button>${statsTour(S.statTour)}`;
  } else if(!tours.length){
    tourPart = `<p class="hint">${t('noData')}</p>`;
  } else {
    const rowsT = tours.slice().reverse().map(x=>{ const all=LIVES.filter(l=>l.tour===x.id && hasSet(l) && l.d<=TODAY); const TA=agg(all); return `<li><button type="button" data-act="statTour" data-v="${x.id}"><span class="tn"><b>${esc(x.name.replace(/^米津玄師 /,''))}</b><small>${all.length} ${t('perShow')} · ${TA.m.size}${t('songsUnit')}</small></span>${mixBar(groupMix(TA), TA.plays)}</button></li>` }).join('');
    tourPart = `<p class="hint">${t('tourMixP')}</p><ul class="tourmix">${rowsT}</ul>${legend()}`;
  }
  return `${album}<div class="ls-card ls-wide anchor" id="ls-tour"><h3>${t('tourMixH')}</h3>${tourPart}</div>`;
}
S.openGrp = new Set();
const grpKey = name=>{ let h=0; for(const ch of String(name)) h=(h*31+ch.codePointAt(0))>>>0; return 'g'+h.toString(36) };
document.addEventListener('toggle', e=>{ const d=e.target; if(d && d.matches && d.matches('details[data-grp]')){ if(d.open) S.openGrp.add(d.dataset.grp); else S.openGrp.delete(d.dataset.grp) } }, true);
function grpIds(key){ const el=document.querySelector(`.lv-grp[data-grp="${key}"]`); return el ? el.dataset.ids.split(' ') : [] }
function livesListHtml(){
  const shown = liveFiltered();
  const rows = (l,inG)=>{
    const past=isPast(l), on=S.picked.has(l.id), n=(l.s||[]).length+(l.e||[]).length;
    return `<li class="lv ${past?'':'future'} ${on?'on':''}" data-live="${l.id}">
      <label class="lv-main">
        <input type="checkbox" data-pick="${l.id}" ${on?'checked':''} aria-label="${esc(l.t)}">
        <span class="lv-d">${fmtD(l.d.slice(5))}</span>
        ${inG?`<span class="lv-t"><b lang="ja">${esc(l.v)}</b><small lang="${S.lang}">${esc(prefName(l.p))}</small></span>`:`<span class="lv-t"><b lang="ja">${esc(l.t)}</b><small lang="ja">${esc(l.v)} · <span lang="${S.lang}">${esc(prefName(l.p))}</span></small></span>`}
        ${inG?(past?'<span></span>':`<span class="lv-k">${t('upcoming')}</span>`):`<span class="lv-k k${l.k}">${kindName(l.k)}${past?'':' · '+t('upcoming')}</span>`}
      </label>
      ${n?`<details class="lv-set"><summary>${t('showSet')} · ${t('songsN').replace('{n}',n)}</summary><ol lang="ja">${(l.s||[]).map(x=>`<li>${songLink(x)}${liveFlags(l,x)}</li>`).join('')}${(l.e||[]).map((x,i)=>`<li class="en"><em>EN${i+1}</em> ${songLink(x)}${liveFlags(l,x)}</li>`).join('')}</ol>${l.note?`<p class="lv-note">${esc(l.note)}</p>`:''}</details>`
         :(past?`<p class="lv-none">${t('noSet')}${l.note?' · '+esc(l.note):''}</p>`:'')}
    </li>`;
  };
  // shows that share one official name (a tour, a two-day fest) fold into one group; a group that crosses
  // a new year is listed under both years
  const byName = new Map(); shown.forEach(l=>{ if(!byName.has(l.t)) byName.set(l.t,[]); byName.get(l.t).push(l) });
  const grp = ls=>{
    ls = ls.slice().sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:0);
    const key = grpKey(ls[0].t), first=ls[0], last=ls[ls.length-1], ys=new Set(ls.map(l=>l.d.slice(0,4)));
    const on = ls.filter(l=>S.picked.has(l.id)).length;
    const places = [...new Set(ls.map(l=>prefName(l.p)).filter(Boolean))];
    const span = ys.size>1 ? `${fmtD(first.d)} – ${fmtD(last.d)}` : `${fmtD(first.d.slice(5))} – ${fmtD(last.d.slice(5))}`;
    return `<li class="lv-grp ${on?'on':''}" data-grp="${key}" data-ids="${ls.map(l=>l.id).join(' ')}">
      <details data-grp="${key}" ${S.openGrp.has(key)?'open':''}>
        <summary>
          <span class="g-chev" aria-hidden="true"></span>
          <span class="lv-t"><b lang="ja">${esc(first.t)}</b><small><span class="mono">${span}</span>${ys.size>1?` <em class="g-span">${t('grpSpan')}</em>`:''} · ${esc(places.slice(0,5).join(' · '))}${places.length>5?' …':''}</small></span>
          <span class="g-meta"><span class="lv-k k${first.k}">${kindName(first.k)} · ${t('grpShows').replace('{n}',ls.length)}</span><span class="g-on" data-grpn>${t('grpPicked').replace('{n}',on).replace('{m}',ls.length)}</span></span>
        </summary>
        <div class="g-tools"><button type="button" class="btn ghost sm" data-act="pickGrp" data-v="${key}">${t('grpPickAll')}</button><button type="button" class="btn ghost sm" data-act="unpickGrp" data-v="${key}">${t('grpUnpick')}</button></div>
        <ul class="lv-list">${ls.map(l=>rows(l,true)).join('')}</ul>
      </details>
    </li>`;
  };
  const groups = liveYears().map(y=>{
    const ls = shown.filter(l=>l.d.startsWith(y)).sort((a,b)=>a.d<b.d?1:a.d>b.d?-1:0); if(!ls.length) return '';
    const seen = new Set(), items = [];
    ls.forEach(l=>{ const all=byName.get(l.t); if(all.length>1){ if(seen.has(l.t)) return; seen.add(l.t); items.push(grp(all)) } else items.push(rows(l,false)) });
    return `<div class="lv-year anchor" id="y-${y}"><h3 class="bubble">${y}</h3><ul class="lv-list">${items.join('')}</ul></div>`;
  }).join('');
  return `<div class="ls-hint"><p>${t('lsPick')}</p><button type="button" class="btn ghost sm" data-act="liveMode" data-v="stats">${t('lsSeeStats')} →</button></div>
    <div class="lv-years">${groups || `<p class="hint">${t('lsNone')}</p>`}</div>`;
}
function livesBody(){ return S.liveMode==='stats' ? lsStatsHtml() : livesListHtml() }
function livesView(){
  const yrs = liveYears();
  const kinds = [['all',t('kAll')],['S',t('kS')],['F',t('kF')],['E',t('kE')]];
  return `<div class="view">
    <section id="lives">
      <div class="sec-head"><h2 class="bubble">Lives</h2><p>${t('livesLabel')}</p></div>
      <div class="rc-cta">
        <div class="rc-cta-txt"><h3>${t('rcCtaH')}</h3><p>${t('rcCtaP')}</p>
          <ol class="rc-steps"><li>${t('rcStep1')}</li><li>${t('rcStep2')}</li><li>${t('rcStep3')}</li></ol>
          <div id="rc-cta-go" class="rc-cta-go">${rcCtaGo()}</div></div>
        <div class="rc-mock" aria-hidden="true"><span class="b">KENSHI YONEZU</span><span class="t">Live Receipt</span><i></i><i></i><i class="s"></i><i></i><span class="w">${Array.from({length:18},(_,i)=>`<em style="height:${20+((i*37)%60)}%"></em>`).join('')}</span></div>
      </div>
      <p class="lead">${t('livesLead')}</p>
      <div class="lstat">
        <div class="ls-seg" role="tablist">${[['list','lsList'],['stats','lsStats']].map(([m,k])=>`<button type="button" role="tab" aria-selected="${S.liveMode===m}" data-act="liveMode" data-v="${m}">${t(k)}</button>`).join('')}</div>
        <div class="ls-filters">
          <div class="ls-chips-row ls-yrs" role="group">${[['all',t('kAll')]].concat(yrs.map(y=>[y,y])).map(([v,lab])=>`<button type="button" class="ls-chip" data-act="liveYear" data-v="${v}" aria-pressed="${S.liveYear===v}">${lab}</button>`).join('')}</div>
          <div class="ls-chips-row" role="group">${kinds.map(([v,lab])=>`<button type="button" class="ls-chip" data-act="liveKind" data-v="${v}" aria-pressed="${S.liveKind===v}">${lab}</button>`).join('')}</div>
          <input type="search" id="lv-q" class="ls-q" value="${esc(S.liveQ)}" placeholder="${t('lsSearch')}" aria-label="${t('lsSearch')}">
        </div>
        ${S.liveMode==='list'?`<div class="ed-actions"><button type="button" class="btn ghost sm" data-act="pickAll">${t('pickAll')}</button><button type="button" class="btn ghost sm" data-act="pickNone">${t('pickNone')}</button></div>`:''}
        <div id="lv-body" class="${S.liveMode==='stats'?'ls-body':''}">${livesBody()}</div>
      </div>
    </section>
    <div class="pickbar" id="pickbar" ${S.liveMode==='stats'?'hidden':''}>${pickbar()}</div>
    <section id="receipt">
      <div class="sec-head"><h2 class="bubble">Receipt</h2><p>${t('navReceipt')}</p></div>
      <div class="rc-nickbox">
        <label class="f"><span>${t('rcNick')}</span><input id="rc-nick" maxlength="20" value="${esc(S.nick)}" placeholder="${t('rcNickPh')}" autocomplete="nickname"></label>
      </div>
      <div id="receipt-box">${receiptHtml()}</div>
    </section>
    ${footer()}
  </div>`;
}
function pickbar(){ return `<span>${t('picked').replace('{n}',S.picked.size)}</span><a class="btn sm" href="#receipt">${t('toReceipt')}</a>` }
function receiptData(){
  const ls = LIVES.filter(l=>S.picked.has(l.id) && isPast(l)).sort((a,b)=>a.d<b.d?-1:1);
  const up = LIVES.filter(l=>S.picked.has(l.id) && !isPast(l)).sort((a,b)=>a.d<b.d?-1:1);
  const by = {S:0,F:0,E:0}; ls.forEach(l=>by[l.k]++);
  const cnt = new Map(); let heard=0;
  ls.forEach(l=>(l.s||[]).concat(l.e||[]).forEach(x=>{ cnt.set(x,(cnt.get(x)||0)+1); heard++ }));
  const order = new Map(); LIVES.forEach(l=>(l.s||[]).concat(l.e||[]).forEach(x=>{ if(!order.has(x)) order.set(x,order.size) }));
  const top = [...cnt].sort((a,b)=>b[1]-a[1]||order.get(a[0])-order.get(b[0])).slice(0,10);
  const all = [...new Set(LIVES.filter(isPast).flatMap(l=>(l.s||[]).concat(l.e||[])))];
  const heardK = new Set(all.concat([...cnt.keys()]).map(songKey)); const never = view().songs.filter(so=>so.title && !heardK.has(songKey(so.title))).map(x=>x.title);
  const places = [...new Set(ls.map(l=>prefName(l.p)))];
  return {ls, up, by, heard, unique:cnt.size, top, places, never};
}
function receiptHtml(){
  const R = receiptData();
  if(!R.ls.length && !R.up.length) return `<p class="hint">${t('rcEmpty')}</p>`;
  const max = R.top.length ? R.top[0][1] : 1;
  const row = (a,b,cls)=>`<div class="rc-row ${cls||''}"><span>${a}</span><b>${b}</b></div>`;
  const mk = k=>k==='S'?'◆':k==='F'?'◇':'○';
  return `<div class="receipt" id="receipt-card">
    <div class="rc-head">
      <div class="rc-meta"><span>NO. ${rcSerial(R)}</span><span>${fmtD(TODAY)}</span></div>
      <div class="rc-brand">KENSHI YONEZU</div>
      <div class="rc-title">Live Receipt</div>
      <div class="rc-sub">${t('rcIssued')} ${fmtD(TODAY)}</div>
      ${nickShown()?`<div class="rc-nick">${t('rcGuest')} — <b>${esc(nickShown())}</b></div>`:''}
    </div>
    <div class="rc-sep"></div>
    <div class="rc-cap">${t('rcItems')}</div>
    <ul class="rc-items">${R.ls.concat(R.up).map(l=>`<li><span class="d">${fmtD(l.d.slice(2))}</span><span class="nm" lang="ja">${esc(l.t)}${isPast(l)?'':` <em class="rc-up">${t('upcoming')}</em>`}</span><span class="mk">${mk(l.k)}</span></li>`).join('')}</ul>
    <div class="rc-sep"></div>
    ${row(mk('S')+' '+t('kS'), R.by.S)}${row(mk('F')+' '+t('kF'), R.by.F)}${row(mk('E')+' '+t('kE'), R.by.E)}
    <div class="rc-sep dbl"></div>
    ${row(t('rcTotal'), R.ls.length+' '+t('rcShows'), 'total')}
    ${R.up.length?row(t('rcUp'), R.up.length+' '+t('rcShows')):''}
    ${row(t('rcHeard'), R.heard)}${row(t('rcUnique'), R.unique)}
    ${R.ls.length?`<div class="rc-sep"></div>
    <div class="rc-cap">${t('rcTop')} ${R.top.length}</div>
    <ol class="rc-top">${R.top.map(([x,n],i)=>`<li><span class="no">${pad(i+1)}</span><span class="nm" lang="ja">${songLink(x)}</span><span class="bar"><i style="width:${n/max*100}%"></i></span><b>${t('rcTimes').replace('{n}',n)}</b></li>`).join('')}</ol>
    <div class="rc-sep"></div>
    ${row(t('rcFirst'), fmtD(R.ls[0].d)+' <small lang="ja">'+esc(R.ls[0].t)+'</small>')}
    ${row(t('rcLast'), fmtD(R.ls[R.ls.length-1].d)+' <small lang="ja">'+esc(R.ls[R.ls.length-1].t)+'</small>')}
    ${row(t('rcPlaces'), R.places.length+' <small>'+esc(R.places.join(' · '))+'</small>')}`:''}
    <div class="rc-sep"></div>
    <div class="rc-wave" aria-hidden="true">${rcWave(R).map(h=>`<i style="height:${h}%"></i>`).join('')}</div>
    <p class="rc-thx">${t('rcThanks')}</p>
    <p class="rc-src">${t('rcSrc')}</p>
  </div>
  <div class="ed-actions rc-actions">
    <button type="button" class="btn" data-act="rcSave">${ico('download')} ${t('rcSave')}</button>
    <a class="btn x" href="${esc(xIntent(R))}" target="_blank" rel="noopener" data-act="rcX"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M18.9 2H22l-7.3 8.3L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.8-8.9L1.6 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20z"/></svg> ${t('rcX')}</a>
    ${navigator.share?`<button type="button" class="btn ghost" data-act="rcShare">${t('rcShare')}</button>`:''}
  </div>
  <p class="okmsg" id="rc-msg" role="status"></p>`;
}
// a short serial from the picked shows (same picks -> same number)
function rcSerial(R){ let h=7; R.ls.concat(R.up).forEach(l=>{ for(const ch of l.id) h=(h*31+ch.charCodeAt(0))%999983 }); return String(h).padStart(6,'0') }
// "signal" bars at the foot of the receipt: one bar per show, height = songs heard that night
function rcWave(R){ const ls=R.ls.length?R.ls:R.up; const n=Math.max(24, ls.length); const out=[]; for(let i=0;i<n;i++){ const l=ls[i%Math.max(1,ls.length)]; const v=l?setOf(l).length:0; out.push(Math.round(18+Math.min(1,v/26)*70+((i*37)%11))) } return out }
function refreshPicked(){ setHTML('pickbar', pickbar()); setHTML('receipt-box', receiptHtml()); setHTML('rc-cta-go', rcCtaGo()); document.querySelectorAll('.lv[data-live]').forEach(li=>li.classList.toggle('on', S.picked.has(li.dataset.live)));
  document.querySelectorAll('[data-pick]').forEach(cb=>{ cb.checked=S.picked.has(cb.dataset.pick) });
  document.querySelectorAll('.lv-grp').forEach(g=>{ const ids=g.dataset.ids.split(' '), n=ids.filter(id=>S.picked.has(id)).length; g.classList.toggle('on', n>0); const c=g.querySelector('[data-grpn]'); if(c) c.textContent=t('grpPicked').replace('{n}',n).replace('{m}',ids.length) }) }
function rcCtaGo(){ return S.picked.size ? `<a class="btn" href="#receipt">${t('toReceipt')} · ${t('picked').replace('{n}',S.picked.size)}</a>` : `<button type="button" class="btn" data-act="liveMode" data-v="list" data-cta="1">${t('rcCtaGo')} →</button>` }
// ---- receipt as an image (drawn on a canvas, no external libraries)
async function receiptCanvas(){
  const R = receiptData(); const W=720, P=52, SC=2;
  const ff = '"Noto Sans JP","Noto Sans KR",system-ui,sans-serif', mono='"IBM Plex Mono",ui-monospace,Menlo,monospace', serif='"Cormorant Garamond","Shippori Mincho B1","Noto Serif JP",serif', caps='"Josefin Sans","Noto Sans JP",sans-serif';
  try{ await Promise.all(['italic 500 64px "Cormorant Garamond"','600 20px "Josefin Sans"','500 18px "IBM Plex Mono"'].map(f=>document.fonts.load(f))); await document.fonts.ready }catch(e){}
  const INK='#E8EAF6', DIM='#8B91B3', LAV='#AAB4FF', LINE='rgba(170,180,255,.38)';
  const ops=[]; let y=P;
  const fit=(c,s,max)=>{ s=String(s); if(c.measureText(s).width<=max) return s; while(s.length>1 && c.measureText(s+'…').width>max) s=s.slice(0,-1); return s+'…' };
  const text=(s,x,o)=>{ const yy=y; ops.push(c=>{ c.font=o.font; c.fillStyle=o.color||INK; c.textAlign=o.align||'left'; if(o.ls) c.letterSpacing=o.ls; if(o.glow){ c.shadowColor=o.glow; c.shadowBlur=18 } c.fillText(fit(c,s,o.max||W-2*P),x,yy); c.shadowBlur=0; c.letterSpacing='0px' }) };
  const sep=(dbl)=>{ const yy=y; ops.push(c=>{ c.strokeStyle=LINE; c.setLineDash([2,6]); c.lineCap='round'; c.lineWidth=2; c.beginPath(); c.moveTo(P,yy); c.lineTo(W-P,yy); c.stroke(); if(dbl){ c.beginPath(); c.moveTo(P,yy+7); c.lineTo(W-P,yy+7); c.stroke() } c.setLineDash([]) }); y+=dbl?30:24 };
  const pair=(a,b,big)=>{ y+=big?36:30; text(a,P,{font:`${big?700:400} ${big?22:19}px ${ff}`,max:W/2,color:big?INK:DIM}); text(String(b),W-P,{font:`${big?600:500} ${big?26:20}px ${mono}`,align:'right',max:W/2-P,color:big?LAV:INK}) };
  const mk = k=>k==='S'?'◆':k==='F'?'◇':'○';
  y+=18; text('NO. '+rcSerial(R),P,{font:`500 15px ${mono}`,color:DIM}); text(fmtD(TODAY),W-P,{font:`500 15px ${mono}`,align:'right',color:DIM});
  y+=56; text('KENSHI YONEZU',W/2,{font:`600 22px ${caps}`,align:'center',ls:'10px',color:INK});
  y+=74; text('Live Receipt',W/2,{font:`italic 500 68px ${serif}`,align:'center',color:LAV,glow:'rgba(60,80,255,.9)'});
  y+=36; text(t('rcIssued')+' '+fmtD(TODAY),W/2,{font:`400 16px ${mono}`,align:'center',color:DIM});
  if(nickShown()){ y+=36; text(t('rcGuest')+' — '+nickShown(),W/2,{font:`700 21px ${ff}`,align:'center'}) }
  y+=26; sep();
  y+=6; text(t('rcItems'),P,{font:`600 15px ${caps}`,color:LAV,ls:'3px'});
  R.ls.concat(R.up).forEach(l=>{ y+=30; text(fmtD(l.d.slice(2)),P,{font:`400 17px ${mono}`,color:DIM}); text((isPast(l)?'':'['+t('upcoming')+'] ')+l.t,P+108,{font:`500 18px ${ff}`,max:W-2*P-150}); text(mk(l.k),W-P,{font:`400 18px ${ff}`,align:'right',color:LAV}) });
  y+=22; sep();
  pair(mk('S')+' '+t('kS'),R.by.S); pair(mk('F')+' '+t('kF'),R.by.F); pair(mk('E')+' '+t('kE'),R.by.E); y+=20; sep(true);
  pair(t('rcTotal'),R.ls.length+' '+t('rcShows'),true); if(R.up.length) pair(t('rcUp'),R.up.length+' '+t('rcShows')); pair(t('rcHeard'),R.heard); pair(t('rcUnique'),R.unique); y+=20; sep();
  if(R.top.length){ y+=6; text(t('rcTop')+' '+R.top.length,P,{font:`600 15px ${caps}`,color:LAV,ls:'3px'}) }
  const max=R.top.length?R.top[0][1]:1;
  R.top.forEach(([x,n],i)=>{ y+=34; text(pad(i+1),P,{font:`500 17px ${mono}`,color:DIM}); text(x,P+40,{font:`700 19px ${ff}`,max:286});
    const yy=y, bw=(W-2*P-470)*(n/max); ops.push(c=>{ c.fillStyle='rgba(170,180,255,.14)'; c.fillRect(P+344,yy-11,W-2*P-470,6); c.shadowColor='rgba(70,90,255,.9)'; c.shadowBlur=10; c.fillStyle=LAV; c.fillRect(P+344,yy-11,Math.max(4,bw),6); c.shadowBlur=0 });
    text(t('rcTimes').replace('{n}',n),W-P,{font:`500 18px ${mono}`,align:'right'}) });
  if(R.top.length){ y+=22; sep() }
  if(R.ls.length){ pair(t('rcFirst'),fmtD(R.ls[0].d)); pair(t('rcLast'),fmtD(R.ls[R.ls.length-1].d)); pair(t('rcPlaces'),R.places.length); y+=20; sep() }
  const wave=rcWave(R), wy=y+10; ops.push(c=>{ const n=wave.length, gap=3, bw=(W-2*P-(n-1)*gap)/n; c.shadowColor='rgba(70,90,255,.8)'; c.shadowBlur=8; c.fillStyle=LAV; wave.forEach((h,i)=>{ const hh=56*h/100; c.globalAlpha=.35+.65*h/100; c.fillRect(P+i*(bw+gap), wy+56-hh, bw, hh) }); c.globalAlpha=1; c.shadowBlur=0 }); y+=96;
  text(t('rcThanks'),W/2,{font:`600 24px ${S.lang==='ko'?ff:serif}`,align:'center',color:INK}); y+=30; text(t('rcSrc'),W/2,{font:`500 13px ${caps}`,align:'center',color:DIM,ls:'2px'}); y+=P;
  const H=y, cv=document.createElement('canvas'); cv.width=W*SC; cv.height=H*SC; const c=cv.getContext('2d'); c.scale(SC,SC);
  c.fillStyle='#07080F'; c.fillRect(0,0,W,H);
  const g=c.createRadialGradient(W/2,150,10,W/2,150,W*.75); g.addColorStop(0,'rgba(48,64,255,.55)'); g.addColorStop(.45,'rgba(30,40,170,.18)'); g.addColorStop(1,'rgba(7,8,15,0)'); c.fillStyle=g; c.fillRect(0,0,W,H*.6);
  let k=R.ls.length*13+R.heard+1; for(let i=0;i<260;i++){ k=(k*9301+49297)%233280; const x=k%W; k=(k*9301+49297)%233280; const yy=k%H; c.fillStyle=`rgba(200,210,255,${.04+(k%7)/60})`; c.fillRect(x,yy,1.4,1.4) } // grain
  c.fillStyle='#000'; for(let x=0;x<W;x+=22){ c.beginPath(); c.moveTo(x,H); c.lineTo(x+11,H-9); c.lineTo(x+22,H); c.fill(); c.beginPath(); c.moveTo(x,0); c.lineTo(x+11,9); c.lineTo(x+22,0); c.fill() } // torn edges
  c.textBaseline='alphabetic'; ops.forEach(f=>f(c));
  return cv;
}
async function receiptBlob(){ const cv=await receiptCanvas(); return new Promise(res=>cv.toBlob(res,'image/png')) }
async function rcSave(quiet){
  const b=await receiptBlob(); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='yonezu-live-receipt.png';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),2000);
  const m=document.getElementById('rc-msg'); if(m) m.textContent=quiet||t('rcSaved');
}
const siteBase = ()=>/^https?:/.test(location.protocol) && !/claude\.ai|claudeusercontent/.test(location.host) ? location.origin : 'https://yonezu.fanpage.workers.dev';
// share text: the site link, then the hashtag on its own line (nothing else)
function shareText(){ return siteBase()+'/#lives\n#米津玄師_レシート' }
function xIntent(R){
  return 'https://x.com/intent/post?text='+encodeURIComponent(shareText());
}
async function rcFile(){ const b=await receiptBlob(); return new File([b],'yonezu-live-receipt.png',{type:'image/png'}) }
async function rcShare(){
  try{ const f=await rcFile();
    if(navigator.canShare && navigator.canShare({files:[f]})) await navigator.share({files:[f], text:shareText(), title:'KENSHI YONEZU LIVE RECEIPT'}); else await rcSave();
  }catch(e){}
}
function footer(){
  return `<footer><div>${t('footer')}</div><ul>${SOURCES.map(([u,n])=>`<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join('')}</ul><div class="foot-links"><a class="admin-link" href="#request">${ico('edit_note')} ${t('reqLink')}</a><a class="admin-link" href="#admin">${ico('lock')} ${t('admin')}</a></div></footer>`;
}

/* ================= setlist statistics ================= */
// One key per song, shared with the data build: NFKC, case-insensitive, no spaces, featured artists dropped.
const songKeyMemo = new Map();
const songKey = x=>{ x=String(x||''); let k=songKeyMemo.get(x); if(k===undefined){ k=x.normalize('NFKC').toLowerCase().replace(/\(\s*\+.*?\)/g,'').replace(/\s\+\s.*$/,'').replace(/\(cover\)/g,'').replace(/\s/g,''); if(songKeyMemo.size<20000) songKeyMemo.set(x,k) } return k };
const setOf = l=>(l.s||[]).concat(l.e||[]);
const hasSet = l=>setOf(l).length>0;
S.ghostOn = store.get('yz-ghost')!=='0';
const counted = l=>hasSet(l) && (S.ghostOn || l.tour!=='ghost');
S.statTour = store.get('yz-stat-tour')||'all';
let keyMapCache=null, keyMapSrc=null;
function songMap(){ const songs=view().songs; if(keyMapSrc!==songs){ keyMapSrc=songs; keyMapCache=new Map(); songs.forEach(s=>{ const k=songKey(s.title); if(!keyMapCache.has(k)) keyMapCache.set(k,s) }) } return keyMapCache }
const songFor = title=>songMap().get(songKey(title));
const groupOf = title=>{ const so=songFor(title); return so ? (discOf(so.disc||'other').g||'other') : 'other' };
const groupMeta = id=>GROUPS.find(g=>g.id===id)||GROUPS[GROUPS.length-1];
const gName = id=>{ const g=groupMeta(id); return L(g.ja,g.ko) };
const byDate = (a,b)=>a.d<b.d?-1:a.d>b.d?1:(a.id<b.id?-1:1);
const tourList = ()=>(window.TOURS||[]).filter(x=>LIVES.some(l=>l.tour===x.id && hasSet(l)));

// counts per song (merged by key), first / last show
function agg(lives){
  const m=new Map(); let plays=0;
  lives.forEach(l=>setOf(l).forEach(x=>{ const k=songKey(x); let r=m.get(k); if(!r){ r={name:x,n:0,first:l,last:l}; m.set(k,r) } r.n++; plays++; if(l.d<r.first.d) r.first=l; if(l.d>=r.last.d) r.last=l }));
  return {m, plays, shows:lives.length};
}
// plays / unique songs per album group
function groupMix(A){
  const g={}; GROUPS.forEach(x=>g[x.id]={plays:0,uniq:0});
  A.m.forEach(r=>{ const id=groupOf(r.name); g[id].plays+=r.n; g[id].uniq++ });
  return g;
}
function groupTotals(){ const t={}; view().songs.forEach(s=>{ const id=discOf(s.disc||'other').g||'other'; t[id]=(t[id]||0)+1 }); return t }
function mixBar(g, total, big){
  const parts = GROUPS.filter(x=>g[x.id].plays>0).map(x=>{ const pct=g[x.id].plays/total*100; return `<i style="--c:${x.c};flex-basis:${pct}%" title="${esc(L(x.ja,x.ko))} ${pct.toFixed(1)}%">${big&&pct>=7?`<span>${Math.round(pct)}%</span>`:''}</i>` }).join('');
  return `<div class="mix ${big?'big':''}">${parts}</div>`;
}
function mixTable(g, total){
  const tot=groupTotals();
  return `<table class="mixt"><thead><tr><th>${t('albumCol')}</th><th>${t('playsCol')}</th><th>${t('shareCol')}</th><th>${t('uniqueCol')}</th><th>${t('coverCol')}</th></tr></thead><tbody>${
    GROUPS.filter(x=>g[x.id].plays>0).sort((a,b)=>g[b.id].plays-g[a.id].plays).map(x=>`<tr><td><i class="dot" style="--c:${x.c}"></i>${esc(L(x.ja,x.ko))}</td><td>${g[x.id].plays}</td><td>${(g[x.id].plays/total*100).toFixed(1)}%</td><td>${g[x.id].uniq}</td><td>${tot[x.id]?`${g[x.id].uniq}/${tot[x.id]}`:'—'}</td></tr>`).join('')
  }</tbody></table>`;
}
function tile(v,label,sub){ return `<div class="tile"><b>${v}</b><span>${label}</span>${sub?`<small>${sub}</small>`:''}</div>` }
function ghostSwitch(compact){
  const n = LIVES.filter(l=>l.tour==='ghost' && hasSet(l)).length;
  return `<div class="gswitch-row ${compact?'compact':''}"><button type="button" class="gswitch" role="switch" aria-checked="${S.ghostOn}" data-act="ghostToggle"><span class="knob"></span></button>
    <div><b>${t('ghostOn')} <span class="mono">(${n}${t('perShow')})</span></b>${compact?'':`<small>${t('ghostOnSub')}</small>`}</div></div>`;
}
function songCell(name){ const so=songFor(name); return so?`<a href="#song-${esc(so.id)}">${esc(name)}</a>`:esc(name) }

function legend(){ return `<div class="glegend">${GROUPS.map(x=>`<span><i class="dot" style="--c:${x.c}"></i>${esc(L(x.ja,x.ko))}</span>`).join('')}</div>` }
function statsTour(tid){
  const tour = (window.TOURS||[]).find(x=>x.id===tid);
  const all = LIVES.filter(l=>l.tour===tid).sort(byDate);
  const shows = all.filter(hasSet);
  const off = tid==='ghost' && !S.ghostOn;
  const head = `<div class="tour-head"><h3>${esc(tour?tour.name:tid)}</h3><span class="mono">${shows.length?fmtD(shows[0].d)+' – '+fmtD(shows[shows.length-1].d):''}</span>${all.length>shows.length?`<small>${t('futureN').replace('{n}',all.length-shows.length)}</small>`:''}</div>`;
  if(off) return head+`<div class="offnote"><p>${t('ghostOffNote')}</p><button type="button" class="btn sm" data-act="ghostToggle">${t('ghostTurnOn')}</button></div>`;
  if(!shows.length) return head+`<p class="hint">${t('noData')}</p>`;
  const A = agg(shows), g = groupMix(A);
  // position of each song (main set first, then encore) to order the matrix rows
  const pos = new Map();
  shows.forEach(l=>{ const ms=(l.s||[]).length, tot=setOf(l).length; setOf(l).forEach((x,i)=>{ const k=songKey(x); const p=pos.get(k)||{sum:0,n:0,name:x}; p.sum += (i<ms ? i/Math.max(1,ms) : 1+(i-ms)/Math.max(1,tot-ms)); p.n++; pos.set(k,p) }) });
  const rows = [...pos.entries()].map(([k,p])=>({k, name:p.name, avg:p.sum/p.n, n:p.n})).sort((a,b)=>a.avg-b.avg);
  const core = rows.filter(r=>r.n===shows.length).length;
  const cell = (l,k)=>{ const ms=(l.s||[]).length; const i=setOf(l).findIndex(x=>songKey(x)===k); if(i<0) return '<td class="x"></td>';
    const name=setOf(l)[i]; const fl=((l.new||[]).includes(name)?' n':'')+((l.daily||[]).includes(name)?' d':'');
    return `<td class="on${i>=ms?' en':''}${fl}">${i<ms?i+1:'EN'+(i-ms+1)}</td>` };
  const colHead = shows.map(l=>`<th scope="col"><span>${fmtD(l.d.slice(5))}</span><small>${esc(shortVenue(l))}</small></th>`).join('');
  const matrix = `<div class="mx-wrap"><table class="mx"><thead><tr><th scope="col" class="sn">#</th>${colHead}<th scope="col" class="cnt">${t('playsCol')}</th></tr></thead><tbody>${
    rows.map(r=>`<tr class="${r.n===shows.length?'core':'var'}"><th scope="row" class="sn"><i class="dot" style="--c:${groupMeta(groupOf(r.name)).c}"></i>${songCell(r.name)}</th>${shows.map(l=>cell(l,r.k)).join('')}<td class="cnt">${r.n}/${shows.length}</td></tr>`).join('')
  }</tbody></table></div>
  <div class="mx-legend"><span><i class="mxs on"></i>${t('tCore')}</span><span><i class="mxs var"></i>${t('tRotate')}</span><span><i class="mxs n"></i>${t('premiere')}</span><span><i class="mxs d"></i>${t('daily')}</span></div>`;
  const diffs = shows.map((l,i)=>{
    const tag = `<span class="dd">${fmtD(l.d.slice(5))} <small>${esc(shortVenue(l))}</small></span>`;
    if(i===0) return `<li>${tag}<span class="dn">${t('firstShow')} · ${setOf(l).length}${t('songsUnit')}</span></li>`;
    const p=shows[i-1], pk=setOf(p).map(songKey), ck=setOf(l).map(songKey);
    const add=setOf(l).filter((x,j)=>!pk.includes(ck[j])), drop=setOf(p).filter((x,j)=>!ck.includes(pk[j]));
    let body;
    if(add.length||drop.length) body = `${add.length?`<span class="plus">+ ${t('added')}: ${add.map(songCell).join(' / ')}</span>`:''}${drop.length?`<span class="minus">− ${t('dropped')}: ${drop.map(songCell).join(' / ')}</span>`:''}`;
    else body = `<span class="dn">${pk.join()===ck.join()?t('same'):t('moved')}</span>`;
    return `<li>${tag}${body}</li>`;
  }).join('');
  return `${head}
    <div class="tiles">${tile(shows.length,t('tShows'))}${tile(A.m.size,t('tUnique'))}${tile((A.plays/shows.length).toFixed(1),t('tAvg'))}${tile(core,t('tCore'))}${tile(rows.length-core,t('tRotate'))}</div>
    <div class="st-block"><h3 class="sub-h">${t('matrixH')}</h3><p class="hint">${t('matrixP')}</p>${matrix}</div>
    <div class="st-block"><h3 class="sub-h">${t('diffH')}</h3><ol class="diffs">${diffs}</ol></div>
    <div class="st-block"><h3 class="sub-h">${t('albumMixH')}</h3><p class="hint">${t('albumMixP')}</p>${mixBar(g, A.plays, true)}${legend()}${mixTable(g, A.plays)}</div>`;
}
function shortVenue(l){
  const g = l.tour==='ghost' && GHOST_DATES.find(x=>x.d===l.d);
  if(g) return L(g.city,g.cityKo);
  const p = String(l.p||''); return S.lang==='ko' ? (PREF_KO[p]||p).replace(/(현|부)$/,'') : p.replace(/[県府]$/,'').replace(/^東京都$/,'東京');
}

/* ================= call guide list ================= */
// How many times each song was played live (from the past setlists in lives.js)
let playMap=null, playKey='';
function playCount(title){
  const k = S.ghostOn?'1':'0';
  if(!playMap || playKey!==k){ playMap=new Map(); playKey=k;
    LIVES.filter(l=>l.d<=TODAY && counted(l)).forEach(l=>setOf(l).forEach(x=>{ const kk=songKey(x); playMap.set(kk,(playMap.get(kk)||0)+1) })) }
  return playMap.get(songKey(title))||0;
}
S.chantSort = ['album','release','plays','title'].includes(store.get('yz-sort')) ? store.get('yz-sort') : 'album';
S.callTour = store.get('yz-call-tour')||'';
const discName = d=>L(d.name, d.ko||d.name);
// first release date of a song: album / second album / dates written in its note; unreleased songs sort first
function relDate(s){
  if((s.disc||'')==='new') return '9999';
  const ds=[]; const add=x=>{ if(x) ds.push(x) };
  add(discOf(s.disc||'other').date); if(s.also) add(discOf(s.also.disc).date);
  (String(s.album||'').match(/\d{4}\.\d{2}\.\d{2}/g)||[]).forEach(add);
  ds.sort(); return ds[0]||'0000';
}
function tourSongKeys(tid){ const k=new Set(); LIVES.filter(l=>l.tour===tid).forEach(l=>setOf(l).forEach(x=>k.add(songKey(x)))); return k }
S.callFilter = '';
function chantView(){
  if(S.callTour && !tourList().some(x=>x.id===S.callTour)) S.callTour='';
  const tk = S.callTour ? tourSongKeys(S.callTour) : null;
  const cf = S.lang==='ja' ? '' : S.callFilter;
  const songs = view().songs.filter(s=>(!cf || cheersUsed(s).includes(cf)) && (!tk || tk.has(songKey(s.title))));
  const card = (s, refNo)=>{
    const synced = s.lines.some(l=>l.kind==='lyric' && l.ly && l.t!=null);
    const no = refNo!=null ? refNo : s.no;
    const used = S.lang==='ja' ? [] : cheersUsed(s);
    return `<a class="song-card ${refNo!=null?'ref':''}" href="#song-${esc(s.id)}">
      ${S.chantSort==='release'?`<span class="no">${relDate(s)==='9999'?t('unreleased'):relDate(s)==='0000'?'—':relDate(s)}</span>`:no?`<span class="no">${t('track')} ${pad(no)}${hasVid(s.yt)?' · '+ico('smart_display'):''}${s.ytType&&hasVid(s.yt)?' '+ytBadge(s):''}</span>`:''}
      <h3>${esc(s.title||t('untitled'))}${S.lang==='ko'&&s.ko?`<small>${esc(s.ko)}</small>`:''}</h3>
      ${refNo!=null?`<div class="meta">${t('ref')}</div>`:`
      ${used.length?`<div class="acts">${used.map(id=>chip(id,false)).join('')}</div>`:''}
      <div class="meta"><span class="status ${synced?'ok':''}"><i></i>${synced?t('lyricsReady'):(hasCalls(s)&&S.lang!=='ja'?t('lyricsNone'):t('pending'))}</span></div>`}
      ${refNo==null?`<span class="plays ${playCount(s.title)?'':'zero'}">${playCount(s.title)?t('plays').replace('{n}',playCount(s.title)):t('playsNone')}</span>`:''}
    </a>`;
  };
  const flat = S.chantSort!=='album';
  const cmpT = (a,b)=>String(a.title).localeCompare(String(b.title),'ja');
  const sorter = S.chantSort==='plays' ? (a,b)=>playCount(b.title)-playCount(a.title)||cmpT(a,b) : S.chantSort==='release' ? (a,b)=>relDate(b).localeCompare(relDate(a))||(a.no||0)-(b.no||0)||cmpT(a,b) : cmpT;
  const sorted = flat ? songs.slice().sort(sorter) : [];
  const relGroups = ()=>{ const g=new Map(); sorted.forEach(x=>{ const r=relDate(x), y=r==='9999'?t('unreleased'):r==='0000'?'—':r.slice(0,4); if(!g.has(y)) g.set(y,[]); g.get(y).push(x) });
    return [...g].map(([y,xs])=>`<div class="disc anchor" id="disc-y${esc(y)}"><div class="disc-head"><h3>${esc(y)}<small>${xs.length}${t('songsCount')}</small></h3></div><div class="song-grid">${xs.map(x=>card(x,null)).join('')}</div></div>`).join('') };
  const groups = flat ? (!sorted.length ? '' : S.chantSort==='release' ? relGroups() : `<div class="disc anchor" id="disc-all"><div class="disc-head"><h3>${t(S.chantSort==='plays'?'sortPlays':'sortTitle')}<small>${t('songsShown').replace('{n}',sorted.length)}</small></h3></div><div class="song-grid">${sorted.map(x=>card(x,null)).join('')}</div></div>`) : DISCS.map(d=>{
    const own = songs.filter(s=>(s.disc||'other')===d.id).map(s=>({s,no:s.no||0,ref:null}));
    const refs = (S.callFilter||S.callTour) ? [] : songs.filter(s=>s.also&&s.also.disc===d.id).map(s=>({s,no:s.also.no,ref:s.also.no}));
    const items = own.concat(refs).sort((a,b)=>a.no-b.no);
    if(!items.length && !(S.editMode && d.id==='other')) return '';
    return `<div class="disc anchor" id="disc-${d.id}">
      <div class="disc-head"><h3>${esc(discName(d))}${d.date?`<small>${d.date}</small>`:''}<small>${items.length}${t('songsCount')}</small></h3></div>
      <div class="song-grid">${items.map(x=>card(x.s,x.ref)).join('')}${S.editMode&&d.id==='other'?`<button type="button" class="song-card add" data-act="addSong">${t('addSong')}</button>`:''}</div>
    </div>`;
  }).join('');
  return `<div class="view">
    <section id="chant" class="chant-hero">
      <h2 class="bubble">${S.lang==='ja'?'Songs':'Call Guide'}</h2>
      <p>${S.lang==='ja'?t('songsLead'):t('callLead')}</p>
      <div class="legend filter" ${S.lang==='ja'?'hidden':''}><b>${t('legend')}</b>
        <button type="button" class="fchip ${S.callFilter?'':'on'}" data-act="callFilter" data-v="" aria-pressed="${!S.callFilter}">${t('filterAll')}</button>
        ${cheers().map(c=>`<button type="button" class="fchip ${S.callFilter===c.id?'on':''}" data-act="callFilter" data-v="${esc(c.id)}" aria-pressed="${S.callFilter===c.id}">${chip(c.id)}</button>`).join('')}
        <small class="fhint">${t('filterHint')}</small>
      </div>
      ${reqBanner(S.lang==='ja'?t('banSongs'):t('banCall'))}
    </section>
    <div class="chant-tools">${ghostSwitch(true)}<i class="tools-br"></i><span>${t('sortBy')}</span><div class="chips show-pick" role="group">${[['album','sortAlbum'],['release','sortRelease'],['plays','sortPlays'],['title','sortTitle']].map(([v,k])=>`<button type="button" data-act="chantSort" data-v="${v}" aria-pressed="${S.chantSort===v}">${t(k)}</button>`).join('')}</div>
    <div class="tour-filter"><label for="call-tour">${t('callTourH')}</label><select id="call-tour"><option value="">${t('callTourAll')} (${view().songs.length})</option>${tourList().slice().reverse().map(x=>`<option value="${x.id}" ${S.callTour===x.id?'selected':''}>${esc(x.name.replace(/^米津玄師 /,''))} (${[...tourSongKeys(x.id)].filter(k=>songMap().has(k)).length})</option>`).join('')}</select>${S.callTour?`<span class="tf-n">${esc(t('callTourN').replace('{t}',tourName(S.callTour).replace(/^米津玄師 /,'')))} · ${songs.length}${t('songsCount')}</span>`:''}</div></div>
    <div class="discs">${groups || `<p class="hint">${t('filterNone')}</p>`}</div>
    <section id="manner"><div class="sec-head"><h2 class="bubble">Manner</h2><p>${t('mannerH')}</p></div>
      <div class="cards3">${MANNER[S.lang].map(([h,p])=>`<div><h4>${esc(h)}</h4><p>${esc(p)}</p></div>`).join('')}</div></section>
    ${footer()}
  </div>`;
}

/* ================= song page (viewer) ================= */
function songHead(s){
  return `<div class="song-head anchor" id="song-${esc(s.id)}">
      <h2>${esc(s.title||t('untitled'))}${S.lang==='ko'&&s.ko?`<small>${esc(s.ko)}</small>`:''}</h2>
      <div class="song-meta">${L(s.credit,s.creditKo)?`<b>${esc(L(s.credit,s.creditKo))}</b><br>`:''}${s.disc&&s.disc!=='other'?esc(discName(discOf(s.disc)))+(s.no?' · '+t('track')+' '+pad(s.no):'')+'<br>':''}${s.also?esc(discName(discOf(s.also.disc)))+' · '+t('track')+' '+pad(s.also.no)+'<br>':''}${s.album?esc(L(s.album, s.albumKo||s.album))+'<br>':''}</div>
    </div>`;
}
function songTop(s){
  return `<div class="song-top"><a class="back" href="#chant">${t('back')}</a><span class="song-top-r"><button type="button" class="btn sm req-hl" data-act="reqOpen">${ico('edit_note')} ${t('reqBtn')}</button>${S.owner?`<a class="btn sm" href="#edit-${esc(s.id)}">${ico('edit')} ${t('edit')}</a>`:''}</span></div>${songHead(s)}`;
}
function songMedia(s){
  const vid=hasVid(s.yt) && !S.ytFailed;
  return `<div class="player ${S.owner?'':'noclock'}" id="player">
    ${vid?'':`<button type="button" class="pp" data-act="pp" aria-label="play/pause" id="pp"></button>`}
    <span class="clock" id="pclock">0:00.0</span>
    <a class="pl-back" href="#chant" aria-label="${esc(t('back'))}">←</a><b class="pl-title" lang="ja">${esc(s.title||'')}</b>
    ${vid?'':`<span class="nudge"><button type="button" data-act="nudge" data-v="-1">−1s</button><button type="button" data-act="nudge" data-v="1">+1s</button></span>`}
    <label class="as"><input type="checkbox" id="autoscroll" ${S.autoScroll?'checked':''}> <span class="as-l">${t('autoScroll')}</span><span class="as-s">${t('autoScrollS')}</span></label>
    ${vid?`<button type="button" class="btn ghost sm mini-btn" data-act="miniVid" aria-pressed="${S.mini}">${ico(S.mini?'arrow_upward':'smart_display')} ${S.mini?t('miniOff'):t('miniOn')}</button>`:''}
    <span class="hint">${vid?'':t('timerNote')}</span>
  </div>${songLivesBox(s)}`;
}
function songLivesBox(s){
  const k = songKey(s.title);
  const ls = LIVES.filter(l=>hasSet(l) && (S.ghostOn || l.tour!=='ghost') && setOf(l).some(x=>songKey(x)===k)).sort((a,b)=>a.d<b.d?1:a.d>b.d?-1:0);
  const pos = l=>{ const ms=(l.s||[]).length, i=setOf(l).findIndex(x=>songKey(x)===k); return i<ms ? '#'+(i+1) : 'EN'+(i-ms+1) };
  return `<section class="song-lives ${S.slOpen?'open':''}" aria-label="${esc(t('songLivesH'))}"><button type="button" class="sl-head" data-act="slToggle" aria-expanded="${!!S.slOpen}"><b>${t('songLivesH')}</b><span>${ls.length?t('songLivesN').replace('{n}',ls.length):''}</span></button>${
    ls.length ? `<ol class="sl-list" tabindex="0">${ls.map(l=>`<li><span class="sl-d">${fmtD(l.d)}</span><span class="sl-t"><b lang="ja">${esc(l.t.replace(/^米津玄師\s*/,''))}</b><small lang="ja">${esc(l.v)} · <span lang="${S.lang}">${esc(prefName(l.p))}</span></small></span><span class="sl-p">${pos(l)}</span></li>`).join('')}</ol>`
    : `<p class="sl-none">${t('songLivesNone')}</p>`}</section>`;
}
function songLyrics(s){
  const note = L(s.note&&s.note.ja, s.note&&s.note.ko);
  const used = S.lang==='ja' ? [] : cheersUsed(s);
  const lines = s.lines.length ? `<ol class="lyrics" id="lyrics">${s.lines.map((l,i)=>viewLine(l,i)).join('')}</ol>` : `<div class="empty">${t('noLines')}</div>`;
  return `<div class="song-side">
    ${note?`<p class="song-note">${esc(note)}</p>`:''}
    ${used.length?`<div class="legend small"><b>${t('legendSong')}</b>${used.map(id=>chip(id)).join('')}</div>`:''}
    ${lines}
    ${reqBanner(S.lang==='ja'?t('banSongJa'):t('banSong'))}
    ${s.src?`<p class="small-note">${t('source')} · ${esc(s.src)}</p>`:''}
  </div>`;
}
function viewLine(l,i){
  const plain = S.lang==='ja';   // Japanese view: lyrics only, no calls
  if(plain && l.kind==='cheer') return '';
  const memo = plain ? '' : L(l.nj,l.nk);
  const ts = !S.owner ? '' : l.t!=null?`<button type="button" class="ts" data-act="seek" data-v="${l.t}">${fmt(l.t)}</button>`:'<span></span>';
  const nts = S.owner ? '' : ' nots';
  if(l.kind==='cheer'){
    const head = !hasCallText(l) && !l.c;
    // a cheer line with no time of its own belongs to the line above: shown and lit together with it
    const follow = l.t==null && i>0 && !l.label && !l.labelKo;
    return `<li class="ln cheer${nts} ${head?'head':''} ${follow?'follow':''}" data-i="${i}" ${l.t!=null?`data-t="${l.t}"`:''}>${ts}<div class="body">
      ${labelOf(l)?`<span class="secl">${esc(labelOf(l))}</span>`:''}
      ${callRow(l)}
      ${memo?`<p class="memo">${esc(memo)}</p>`:''}</div></li>`;
  }
  return `<li class="ln${nts}" data-i="${i}" ${l.t!=null?`data-t="${l.t}" tabindex="0"`:''}>${ts}<div class="body">
    <p class="ly">${plain?esc(l.ly||''):markedHtml(l.ly,l.marks)}</p>
    ${S.lang==='ko'&&l.pr?`<p class="sub">${esc(l.pr)}</p>`:''}
    ${S.lang==='ko'&&l.tr?`<p class="sub tr">${esc(l.tr)}</p>`:''}
    ${plain?'':callRow(l)}
    ${memo?`<p class="memo">${esc(memo)}</p>`:''}</div></li>`;
}

const ICON_PLAY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3l12 7-12 7z"/></svg>';
const ICON_PAUSE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3h4v14H4zM12 3h4v14h-4z"/></svg>';
let lastActive = '';
const listCache = new WeakMap(); // list element -> [{t, el}] sorted, built once per render
function timesOf(list){
  let c = listCache.get(list);
  if(!c){ c=[...list.querySelectorAll('[data-t]')].map(el=>({t:+e
