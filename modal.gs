// 関数名　pto_modal
// 引数　なし
// 戻り値　有給休暇用のmodal
// 説明  Slack上で有給休暇が選択された場合有給休暇のmodalを返す
function pto_modal() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("マスタ");

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  var formData = {
    "type": "modal",
    "callback_id": "pto_section",
    "title": {
      "type": "plain_text",
      "text": "有給休暇",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "確認",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "戻る",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "残り有給休暇" + sheet.getRange("C2").getValue() + "日",
          "emoji": true
        }
      },
      {
        "type": "section",
        "block_id": "pto_kinds",
        "text": {
          "type": "mrkdwn",
          "text": "休暇の種類を選択してください"
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
                "text": "全体（１日）",
                "emoji": true
              },
              "value": "1day"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "午前半休（0.5日）",
                "emoji": true
              },
              "value": "Morning_half_day"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "午後半休（0.5日）",
                "emoji": true
              },
              "value": "Afternoon_half_day"
            }
          ],
          "action_id": "static_select_action"
        }
      },
      {
        "type": "section",
        "block_id": "pto_date",
        "text": {
          "type": "mrkdwn",
          "text": "休暇予定日を選択してください"
        },
        "accessory": {
          "type": "datepicker",
          "initial_date": formattedDate,
          "placeholder": {
            "type": "plain_text",
            "text": "Select a date",
            "emoji": true
          },
          "action_id": "datepicker_action"
        }
      },
      {
        "type": "input",
        "block_id": "input_reason",
        "element": {
          "type": "plain_text_input",
          "action_id": "plain_text_input_action"
        },
        "label": {
          "type": "plain_text",
          "text": "休暇理由",
          "emoji": true
        }
      }
    ]
  }
  return formData;
}

// 関数名　hourly_pto_modal
// 引数　なし
// 戻り値 時間休暇用のmodal
// 説明  Slack上で時間休暇が選択された場合時間休暇用のmodalを返す
function hourly_pto_modal() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("マスタ");
  
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  var formData = {
	  "type": "modal",
    "callback_id": "hourly_pto_section",
	  "title": {
		  "type": "plain_text",
	  	"text": "時間休",
		  "emoji": true
	  },
    "submit": {
      "type": "plain_text",
      "text": "確認",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "戻る",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "残り有給取得可能時間" + sheet.getRange("D2").getValue() + "時間",
          "emoji": true
        }
      },
      {
        "type": "section",
        "block_id": "date",
        "text": {
          "type": "mrkdwn",
          "text": "休暇予定日を選択してください"
        },
        "accessory": {
          "type": "datepicker",
          "initial_date": formattedDate,
          "placeholder": {
            "type": "plain_text",
            "text": "Select a date",
            "emoji": true
          },
          "action_id": "datepicker_action"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "開始時間",
          "emoji": true
        }
      },
      {
        "type": "actions",
        "block_id": "start_time",
        "elements": [
          {
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "時",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "9時",
                  "emoji": true
                },
                "value": "09"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "10時",
                  "emoji": true
                },
                "value": "10"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "11時",
                  "emoji": true
                },
                "value": "11"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "13時",
                  "emoji": true
                },
                "value": "13"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "14時",
                  "emoji": true
                },
                "value": "14"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "15時",
                  "emoji": true
                },
                "value": "15"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "16時",
                  "emoji": true
                },
                "value": "16"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "17時",
                  "emoji": true
                },
                "value": "17"
              }
            ],
            "action_id": "static_select_action1"
          },
          {
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "分",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "0分",
                  "emoji": true
                },
                "value": "00"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "15分",
                  "emoji": true
                },
                "value": "15"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "30分",
                  "emoji": true
                },
                "value": "30"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "45分",
                  "emoji": true
                },
                "value": "45"
              }
            ],
            "action_id": "static_select_action2"
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "終了時間",
          "emoji": true
        }
      },
      {
        "type": "actions",
        "block_id": "finish_time",
        "elements": [
          {
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "時",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "9時",
                  "emoji": true
                },
                "value": "09"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "10時",
                  "emoji": true
                },
                "value": "10"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "11時",
                  "emoji": true
                },
                "value": "11"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "12時",
                  "emoji": true
                },
                "value": "12"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "13時",
                  "emoji": true
                },
                "value": "13"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "14時",
                  "emoji": true
                },
                "value": "14"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "15時",
                  "emoji": true
                },
                "value": "15"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "16時",
                  "emoji": true
                },
                "value": "16"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "17時",
                  "emoji": true
                },
                "value": "17"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "18時",
                  "emoji": true
                },
                "value": "18"
              }
            ],
            "action_id": "static_select_action1"
          },
          {
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "分",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "0分",
                  "emoji": true
                },
                "value": "00"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "15分",
                  "emoji": true
                },
                "value": "15"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "30分",
                  "emoji": true
                },
                "value": "30"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "45分",
                  "emoji": true
                },
                "value": "45"
              }
            ],
            "action_id": "static_select_action2"
          }
        ]
      },
      {
        "type": "input",
        "block_id": "hourly_pto_reason",
        "element": {
          "type": "plain_text_input",
          "action_id": "plain_text_input_action"
        },
        "label": {
          "type": "plain_text",
          "text": "休暇理由",
          "emoji": true
        }
      }
    ]
  }
  return formData;
}
