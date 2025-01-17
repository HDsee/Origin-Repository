from flask import *
from flask import session
from connector import connection_pool
import re
from datetime import date, datetime
import requests

from dotenv import load_dotenv
import os

load_dotenv()
tappayPartnerKey = os.getenv("tappayPartnerKey")
tappayMerchantId = os.getenv("tappayMerchantId")

orderApi = Blueprint( 'orderApi', __name__)

#  建立訂單
@orderApi.route('/order', methods=["POST"])
def post_order():
    try:
        db=connection_pool.get_connection()
        cursor = db.cursor()
        if 'user' in session:
            order = request.json
            prime = order["prime"]
            order_number = datetime.now().strftime('%Y%m%d%H%M%S')
            price = order["order"]["price"]
            attraction_id = order["order"]["trip"]["attraction"]["id"]
            attraction_name = order["order"]["trip"]["attraction"]["name"]
            attraction_address = order["order"]["trip"]["attraction"]["address"]
            attraction_image = order["order"]["trip"]["attraction"]["image"]
            date = order["order"]["trip"]["date"]
            time = order["order"]["trip"]["time"]
            contactName = order["order"]["contact"]["name"]
            contactEmail = order["order"]["contact"]["email"]
            contactPhone = order["order"]["contact"]["phone"]
            user_id = session["id"]
            pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            if (contactName != None) and (contactPhone != None) and (re.fullmatch(pattern, contactEmail)):
                send_prime = {
                    "prime": prime,
                    "partner_key": tappayPartnerKey,
                    "merchant_id": tappayMerchantId,
                    "order_number": order_number,
                    "details":"TapPay Test",
                    "amount": price,
                    "cardholder": {
                        "phone_number": contactPhone,
                        "name": contactName,
                        "email": contactEmail
                    },
                    "remember": False
                }
                # 將訂單傳送至TapPay並獲取回應
                pay_url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
                headers = {
                    'Content-type': 'application/json',
                    'x-api-key': tappayPartnerKey
                }
                response = requests.post(pay_url, headers=headers, json=send_prime).json()
                res = response
                statusNum = res["status"]
                # 當回傳結果為付款成功時，回傳建立成功資訊
                if res["status"] == 0:
                    cursor.execute('INSERT INTO `order` (number,price,attraction_id,attraction_name,attraction_address,attraction_image,date,time,contact_name,contact_email,contact_phone,status,user_id) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)',
                    (order_number,price,attraction_id,attraction_name,attraction_address,attraction_image,date,time,contactName,contactEmail,contactPhone,statusNum,user_id))
                    cursor.execute('delete from `booking` where user_id=%s',(user_id,))
                    data = {
                        "data":{
                            "number": order_number,
                            "payment": {
                                "status": 0,
                                "message": "付款成功"
                            }
                        }
                    }
                    return jsonify(data)

                # TapPay回傳失敗資訊
                data = {
                    "data":{
                        "number": order_number,
                        "payment": {
                            "status": res["status"],
                            "message": "付款失敗"
                        }
                    }
                }
                return jsonify(data)
            data = {
                    "data":{
                        "number": order_number,
                        "payment": {
                            "message": "聯絡資訊錯誤"
                        }
                    }
                }
            return jsonify(data)

        # 沒有登入
        data = {
            "error": True,
            "message": "未登入系統，操作失敗"
        }
        return jsonify(data), 403

    # 伺服器（資料庫）連線失敗
    except Exception as e:
        print(e)
        data = {
            "error": True,
            "message": "伺服器內部錯誤"
        }
        db.rollback()
        return jsonify(data), 500
    finally:
        db.commit()
        cursor.close()
        db.close()

