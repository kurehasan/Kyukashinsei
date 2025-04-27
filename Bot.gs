const METHOD = "post";

const URL = "https://slack.com/api/views.open";
const URL_HOOKS = "//＊＊SlackのWebhook＊＊”;

// 関数名　doPost
// 引数　e:slackからデータ受信 
// 戻り値　slackにデータ送信
// 説明  Slackに表示するデータを送信する
//      Slackから送られてくる情報を受け取る
//      どの処理をするか選択をする
function doPost(e) {
  // e.parameter.commandがスラッシュコマンド(先頭に/が必要)と同じ場合
  if (e.parameter.command === '/kyuka_shinsei’) {

    //案内を挿入
    const guidename = namecreate();

    // 「Message Preview」（JSONコード）を定義
    var formData = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": guidename,
          },
          "accessory": {
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "リストから選択",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "有給休暇",
                  "emoji": true
                },
                "value": "pto"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "時間休",
                  "emoji": true
                },
                "value": "hourly_pto"
              },
            ],
            "action_id": "static_select_action"
          }
        }
      ]
    };

    // Slackに情報を返す
    return ContentService.createTextOutput(JSON.stringify(formData)).setMimeType(ContentService.MimeType.JSON);
  }

  // payload情報（送信データ）を設定
  const payload = JSON.parse(e.parameter.payload);

  // payload.typeが'block_actions'の場合
  if (payload.type === 'block_actions') {

    // 画面内で設定されたIDを設定
    const actionId = payload.actions[0].action_id;

    // actionIdが画面内で設定されたIDの場合
    if (actionId === 'static_select_action') {

      //valueの取得
      const value = payload.actions[0].selected_option.value;
      
      //modalの選択
      if (value === 'pto') {
        var formData = pto_modal();
      }else if(value === 'hourly_pto') {
        var formData = hourly_pto_modal();
      }

      // チャンネルIDをprivate_metadataという場所に設定
      formData.private_metadata = payload.channel.id;
    const setPayload = {
      // slack apiの「Bot User OAuth Token」を設定する
      token: ‘//＊＊token記入＊＊’,
      // 操作時に発行されたid
     trigger_id: payload.trigger_id,
      view: JSON.stringify(formData)
    };

      const options = {
        method: METHOD,
        contentType: 'application/x-www-form-urlencoded',
        payload: setPayload
      };

      UrlFetchApp.fetch(URL, options);
      return ContentService.createTextOutput();
      

    }else if(actionId === 'button_action'){

      const value = payload.actions[0].value;
      if(value === "pto"){
        var formData = pto_modal();
      }else if(value === "hourly_pto"){
        var formData = hourly_pto_modal();
      }

      // チャンネルIDをprivate_metadataという場所に設定
      formData.private_metadata = payload.channel.id;
    const setPayload = {
      // slack apiの「Bot User OAuth Token」を設定する
      token: ‘//＊＊token記入＊＊,
      // 操作時に発行されたid
      trigger_id: payload.trigger_id,
      view: JSON.stringify(formData)
    };

      const options = {
        method: METHOD,
        contentType: 'application/x-www-form-urlencoded',
        payload: setPayload
      };

      UrlFetchApp.fetch(URL, options);
      return ContentService.createTextOutput();

    }
  }

  //modalの処理
  //payloadが'view_submission'の場合
  if(payload.type === 'view_submission'){

    //callback_idを設定
    const callback_id = payload.view.callback_id;

    //callback_idが有給休暇の場合
    if(callback_id === 'pto_section') {
      const value = payload.view.state.values;

      const message = PtoSpreadsheet(value);

      Spreadsheetwrite("message",message);

      const postMessagePayload = {
        'blocks': message.blocks
      };

      const options = {
        method: METHOD,
        contentType: 'application/json',
        payload: JSON.stringify(postMessagePayload)
      };

      // Slackに情報を返す
      UrlFetchApp.fetch(URL_HOOKS, options);
    
    //時間休の場合
    }else if(callback_id === 'hourly_pto_section'){
      const value = payload.view.state.values;

      // valueの値出力
      Spreadsheetwrite("hourly_ptoのvalueの値",value);

      const message = HourlyPtoSpreadsheet(value);

      const postMessagePayload = {
        'blocks': message.blocks
      };

      const options = {
        method: METHOD,
        contentType: 'application/json',
        payload: JSON.stringify(postMessagePayload)
      };

      // Slackに情報を返す
      UrlFetchApp.fetch(URL_HOOKS, options);

    }
  }
}

// 関数名　getJapaneseHolidays
// 引数　 targetDate:Slack上で打ち込まれた日付
// 戻り値　祝日か平日かの結果
// 説明  Slackで入力された日付が祝日かどうかを判断する
function getJapaneseHolidays(targetDate) {

  const calendarId = 'ja.japanese#holiday@group.v.calendar.google.com'
  const holidayCalendar = CalendarApp.getCalendarById(calendarId);

  // ターゲットの日付のイベント（祝日）を取得
  const events = holidayCalendar.getEventsForDay(targetDate);

  // イベントが存在するかどうかをチェック（存在すれば祝日、存在しなければ非祝日）
  return events.length > 0;  
  
}

//関数名　Spreadsheetwrite（デバック用）
//引数　explanation:タイトル（ログシートのB列）
//      payload:表示したい値（ログシートのC列）
//説明　何かエラーが起こった際に中身をログシートに表示するためのもの
function Spreadsheetwrite(explanation,payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ログ");

  let now = new Date();
  const hyouzi = Utilities.formatDate(now, 'JST', 'yyyy-MM-dd HH:mm:ss');

  const newRow = [hyouzi,explanation,JSON.stringify(payload)];

  sheet.appendRow(newRow);
}
