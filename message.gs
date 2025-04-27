// 関数名　namecreate
// 引数 なし
// 戻り値 名前、残りの有給休暇、時間休を表示するメッセージ
// 説明  コマンドが入力された際に表示するメッセージを作成する
function namecreate() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("マスタ");

  let name = sheet.getRange("B2").getValue() + "さん"; 
  let remaining_pto = "残り有給休暇" + sheet.getRange("C2").getValue() + "日";
  let remaining_hourly_pto = "残り時間休" + sheet.getRange("D2").getValue() + "時間";

  const guidename = name + '\n' + remaining_pto + '\n' + remaining_hourly_pto + '\n\n' + "申請したい休暇の種類を選択してください";

  return guidename;

}

// 関数名　sendMessage
// 引数 pto_kinds:休暇の種類（有給休暇、時間休）  
//      date:申請された日付
//      start_time:休暇開始時間
//      finish_time:休暇終了時間
//      reason:休暇理由
// 戻り値 完了メッセージ
// 説明  Slackから受け取った申請内容に不備がなかった場合に完了メッセージを作成する
function sendMessage(pto_kinds,date,start_time,finish_time,reason){
    const message = {
	    "blocks": [
	    {
	     "type": "section",
	      "text": {
		      "type": "plain_text",
		      "text": "申請完了しました",
		      "emoji": true
	      }
	    },
	    { 
	      "type": "section",
	      "text": {
		      "type": "plain_text",
		      "text": "申請内容",
		      "emoji": true
	      }
	    },
	    {
	      "type": "rich_text",
	      "elements": [
		      {
			      "type": "rich_text_section",
			      "elements": [
				      {
					      "type": "text",
					      "text": "休暇種類  " + pto_kinds
				      }
			      ]
		      }
	      ]
	    },
	    {
	      "type": "rich_text",
	      "elements": [
		      {
			      "type": "rich_text_section",
			      "elements": [
				      {
					      "type": "text",
					      "text": "休暇取得日  " + date
				      }
			      ]
		      }
	      ]
	    },
	    {
	      "type": "rich_text",
	      "elements": [
		      {
			      "type": "rich_text_section",
			      "elements": [
				      {
					      "type": "text",
					      "text": "開始時間  " + start_time
				      }
			      ]
		      }
	      ]
	    },
	    {
	      "type": "rich_text",
	      "elements": [
		      {
			      "type": "rich_text_section",
			      "elements": [
		          {
			          "type": "text",
			          "text": "終了時間  " + finish_time
		          }
	          ]
	        }
	      ]
	    },
	    {
	       "type": "section",
	       "text": {
	        "type": "plain_text",
	        "text": "休暇理由",
	        "emoji": true
	      }
	    },
	    {
	       "type": "rich_text",
	       "elements": [
	         {
	          "type": "rich_text_section",
	          "elements": [
		          {
			          "type": "text",
			          "text": reason
		          }
		        ]
	        }
	      ]
	    }
	  ]
  }
  return message;

}

// 関数名　errorMessage
// 引数 errorvalue:エラーの詳細,kinds:休暇の種類（有給休暇、時間休）
// 戻り値 エラーメッセージ
// 説明  入力された情報に不備があった場合、不備の詳細を伝えるためのメッセージを作成する
function errorMessage(errorvalue,kinds){
  if(kinds === "pto"){
    const message = {
	    "blocks": [
		    {
		   "type": "section",
  		   "text": {
  		     "type": "plain_text",
	  	      "text": ":warning:入力エラーが発生しました！",
		       "emoji": true
		     }
  		  },
	  	  {
		  	  "type": "context",
			    "elements": [
			     {
  			    "type": "plain_text",
	  		    "text": errorvalue,
		  	    "emoji": true
			     }
			    ]
  		  },
	  	  {
		  	  "type": "section",
			    "text": {
				    "type": "mrkdwn",
				    "text": "もう一度申請しますか？"
  			  },
	  		  "accessory": {
		  		  "type": "button",
			  	  "text": {
				  	  "type": "plain_text",
					    "text": "申請する",
					    "emoji": true
  				  },
	  			"value": "pto",
		  		"action_id": "button_action"
			    }
  		  }
	    ]
    }
    return message;

  }else if(kinds === "hourly_pto"){
    const message = {
	    "blocks": [
		    {
		   "type": "section",
  		   "text": {
  		     "type": "plain_text",
	  	      "text": ":warning:入力エラーが発生しました！",
		       "emoji": true
		     }
  		  },
	  	  {
		  	  "type": "context",
			    "elements": [
			     {
  			    "type": "plain_text",
	  		    "text": errorvalue,
		  	    "emoji": true
			     }
			    ]
  		  },
	  	  {
		  	  "type": "section",
			    "text": {
				    "type": "mrkdwn",
				    "text": "もう一度申請しますか？"
  			  },
	  		  "accessory": {
		  		  "type": "button",
			  	  "text": {
				  	  "type": "plain_text",
					    "text": "申請する",
					    "emoji": true
  				  },
	  			"value": "hourly_pto",
		  		"action_id": "button_action"
			    }
  		  }
	    ]
    }

    return message;

  }
}
