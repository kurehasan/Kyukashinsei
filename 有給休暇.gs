// 関数名　PtoSpreadsheet
// 引数　value:Slackで入力された内容がjson形式で入る
// 戻り値　不備があった場合はエラーメッセージ、申請が完了した場合は完了メッセージ
// 説明  有給休暇の処理関数
//       Slackでから送信されたデータを元に申請一覧のスプレッドシートに記入し、
//       完了メッセージを作成する関数を呼び出す
//       エラーの場合はエラーメッセージを作成する関数を呼び出す
function PtoSpreadsheet(value) {
  const mastasheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("マスタ");
  const remaining_pto = mastasheet.getRange("C2").getValue();
  const remaining_hourly_pto = mastasheet.getRange("D2").getValue();
  const name = mastasheet.getRange("B2").getValue();

  Spreadsheetwrite("value",value);

  //種類
  const pto_kinds = value.pto_kinds.static_select_action.selected_option.text.text;
  
  //休暇取得日
  const date = value.pto_date.datepicker_action.selected_date;
  const targetDate = new Date(date);  
  const day = targetDate.getDay();

  //日時取得
  let now = new Date();
  const hyouzi = Utilities.formatDate(now, 'JST', 'yyyy年MM月dd日');
  
  //理由
  const reason = value.input_reason.plain_text_input_action.value;
  
  //祝日取得
  const syukuzitu = getJapaneseHolidays(targetDate);
  
  //休日種類
  const day_kinds = value.pto_kinds.static_select_action.selected_option.value;

  //土日判断
  if(day === 0 || day === 6){

    const message = errorMessage("休暇予定日は平日を選択してください","pto");
    return message;

  //祝日判断
  }else if(syukuzitu === true){

    const message = errorMessage("休暇予定日は平日を選択してください","pto");
    return message;

  }else if(day_kinds === '1day'){

    //有給日数計算
    const pto_change = remaining_pto - 1;

    //残日数エラー表示
    if(pto_change < 0){

      const message = errorMessage("残日数が足りていません","pto");
      return message;

    }

    //換算時間記入
    const kansantime = 1.0;
    //開始時間
    var start_time = '09:00';
    //終了時間
    var finish_time = '18:00';
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("申請一覧");
    const newRow = [hyouzi,name,pto_kinds,date,start_time,finish_time,reason,kansantime,pto_change,remaining_hourly_pto]
    sheet.appendRow(newRow);

    //マスタシート更新
    mastasheet.getRange("C2").setValue(pto_change);

    const message = sendMessage(pto_kinds,date,start_time,finish_time,reason);
    return message;

  }else if(day_kinds === 'Morning_half_day'){

    //有給日数計算
    const pto_change = remaining_pto - 0.5;

    //残日数エラー表示
    if(pto_change < 0){

      const message = errorMessage("残日数が足りていません","pto");
      return message;

    }
    
    //換算時間記入
    const kansantime = 0.5;
    //開始時間
    let start_time = '09:00';
    //終了時間
    let finish_time = '12:00';


    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("申請一覧");
    const newRow = [hyouzi,name,pto_kinds,date,start_time,finish_time,reason,kansantime,pto_change,remaining_hourly_pto]
    sheet.appendRow(newRow);
    
    //マスタシート更新
    mastasheet.getRange("C2").setValue(pto_change);


    const message = sendMessage(pto_kinds,date,start_time,finish_time,reason);
    return message;


  }else if(day_kinds === 'Afternoon_half_day'){

    //有給日数計算
    const pto_change = remaining_pto - 0.5;  

    //残日数エラー表示
    if(pto_change < 0){

      return errorMessage("残日数が足りていません","pto");

    }
  
    //換算時間記入
    const kansantime = 0.5;
    //開始時間
    let start_time = '13:00';
    //終了時間
    let finish_time = '18:00';


    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("申請一覧");
    const newRow = [hyouzi,name,pto_kinds,date,start_time,finish_time,reason,kansantime,pto_change,remaining_hourly_pto]
    sheet.appendRow(newRow);
    
    //マスタシート更新
    mastasheet.getRange("C2").setValue(pto_change);

    const message = sendMessage(pto_kinds,date,start_time,finish_time,reason);
    return message;
  }
}
