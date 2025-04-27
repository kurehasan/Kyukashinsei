// 関数名　HourlyPtoSpreadsheet
// 引数 value:Slackで入力されたデータがjson形式で入る
// 戻り値 不備があった場合はエラーメッセージ、申請が完了した場合は完了メッセージ
// 説明  時間休暇の処理関数
//       Slackでから送信されたデータを元に申請一覧のスプレッドシートに記入し、
//       完了メッセージを作成する関数を呼び出す
//       エラーの場合はエラーメッセージを作成する関数を呼び出す
function HourlyPtoSpreadsheet(value){
  //処理用開始時間
  const start_hour = value.start_time.static_select_action1.selected_option.value;
  const start_minute = value.start_time.static_select_action2.selected_option.value;
  const start = start_hour + start_minute;

  //処理用終了時間
  const finish_hour = value.finish_time.static_select_action1.selected_option.value;
  const finish_minute = value.finish_time.static_select_action2.selected_option.value;
  const finish = finish_hour + finish_minute;

  const Numstart = Number(start);
  const Numfinish = Number(finish);

  if(Numfinish - Numstart <= 0){

    const message = errorMessage("15分以上の値を記入してください","hourly_pto");
    return message;

  }else if(Numstart < 925){

    const message = errorMessage("開始時間は9時30分以降の値を入力してください","hourly_pto");
    return message;

  }else if(Numfinish > 1800){

    const message = errorMessage("終了時間は18時00分以前の値を入力してください","hourly_pto");
    return message;

  }

  //換算時間計算
  const finishHours = Math.floor(Numfinish / 100) + (Numfinish % 100) / 60;
  const startHours = Math.floor(Numstart / 100) + (Numstart % 100) / 60;
  let usedHours = finishHours - startHours;

  //休憩時間判断
  if(Numstart <= 1145 && Numfinish >= 1300){
    usedHours = usedHours - 1;
  }

  //休暇取得日
  const date = value.date.datepicker_action.selected_date;
  const targetDate = new Date(date);  
  const day = targetDate.getDay();

  //祝日取得
  const syukuzitu = getJapaneseHolidays(targetDate);

  //土日判断
  if(day === 0 || day === 6){

    const message = errorMessage("休暇予定日は平日を選択してください","hourly_pto");

    return message;

  //祝日判断
  }else if(syukuzitu === true){

    const message = errorMessage("休暇予定日は平日を選択してください","hourly_pto");
    return message;

  }

  const mastasheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("マスタ");
  const remaining_hourly_pto = mastasheet.getRange("D2").getValue();
  const change_remaining_hourly_pto = remaining_hourly_pto - usedHours;

  if(change_remaining_hourly_pto < 0){
    const message = errorMessage("有給残日数を超過しています","hourly_pto");
    return message;
  }

  const name = mastasheet.getRange("B2").getValue();
  const remaining_pto = mastasheet.getRange("C2").getValue();

  //日時取得
  let now = new Date();
  const hyouzi = Utilities.formatDate(now, 'JST', 'yyyy年MM月dd日');

  //理由
  const reason = value.hourly_pto_reason.plain_text_input_action.value;

  //開始時間
  const start_time = start_hour + ":" + start_minute;

  //終了時間
  const finish_time = finish_hour + ":" + finish_minute;

  //申請一覧更新
  const ichiransheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("申請一覧");
  const newRow = [hyouzi,name,"時間休",date,start_time,finish_time,reason,usedHours,remaining_pto,change_remaining_hourly_pto]
  ichiransheet.appendRow(newRow);

  //マスタシート更新
  mastasheet.getRange("D2").setValue(change_remaining_hourly_pto);

  const message = sendMessage("時間休",date,start_time,finish_time,reason);

  return message;

}
