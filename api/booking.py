from flask import *
import mysql.connector

from mysql.connector import pooling


connection_pool = pooling.MySQLConnectionPool(pool_name="db",
                                            pool_size=10,
                                            pool_reset_session=True,
                                            host='localhost',
                                            database='taipeidata',
                                            user='abc',
                                            password='abc')



bookingApi = Blueprint( 'bookingApi', __name__)

@bookingApi.route('/booking', methods=["GET"])
def get_booking():
    try:
        db=connection_pool.get_connection()
        cursor = db.cursor(dictionary=True)
        if "user" in session:
            userId = session["id"]
            cursor.execute('select * from `booking` where user_id=%s',(userId,))
            bookingData = cursor.fetchone()
            if bookingData:
                attractionId = bookingData["attraction_id"]
                cursor.execute('select * from `attraction` where id=%s',(attractionId,))
                attractionData = cursor.fetchone()
                if attractionData:
                    attractionData["images"] = eval(attractionData["images"])
                    data = {
                        "data":{
                        "attraction": {
                            "id": attractionId,
                            "name": attractionData["name"],
                            "address": attractionData["address"],
                            "image": attractionData["images"][0]
                        },
                        "date": bookingData["date"].strftime("%Y-%m-%d"),
                        "time": bookingData["time"],
                        "price": bookingData["price"]
                    }}
                    cursor.close()
                    db.close()
                    return jsonify(data)
                else:
                    {"data": None}
                    cursor.close()
                    db.close()
                    return jsonify(data)
        data = {
            "error": True,
            "message": "未登入系統，拒絕存取"
        }
        cursor.close()
        db.close()
        return jsonify(data),403
    except:
        data = {
            "error": True,
            "message": "伺服器內部錯誤"
        }
        cursor.close()
        db.close()
        return jsonify(data), 500

# 建立行程功能
@bookingApi.route('/booking', methods=["POST"])
def post_booking():
    try:
        db=connection_pool.get_connection()
        cursor = db.cursor()
        if 'user' in session:
            userId = session["id"]
            booking = request.json
            attractionId = booking["attractionId"]
            date = booking["date"]
            time = booking["time"]
            price = booking["price"]
            if attractionId and date and ((time == 'morning' and price == 2000) or (time == 'afternoon' and price == 2500)):
                # 建立行程成功
                cursor.execute('select * from `booking` where user_id=%s',(userId,))
                bookingCheck = cursor.fetchone()
                if not bookingCheck:
                    cursor.execute('INSERT INTO `booking` (user_id,attraction_id,date,time,price) VALUES (%s,%s,%s,%s,%s)',
                    (userId,attractionId,date,time,price))
                    db.commit()
                    data = {"ok": True}
                    cursor.close()
                    db.close()
                    return jsonify(data)
                else:
                    mysql = 'UPDATE booking SET attraction_id=%s,date=%s,time=%s,price=%s WHERE user_id=%s'
                    cursor.execute(mysql, (attractionId,date,time,price,userId))
                    db.commit()
                    data = {"ok": True}
                    cursor.close()
                    db.close()  
                    return jsonify(data)
            # 輸入內容有誤
            data = {
                "error": True,
                "message": "建立失敗，輸入不正確或其他原因"
            }
            return jsonify(data), 400
        # 沒有登入
        data = {
            "error": True,
            "message": "未登入系統，拒絕存取"
        }
        cursor.close()
        db.close()
        return jsonify(data), 403
    # 伺服器錯誤
    except:
        data = {
            "error": True,
            "message": "伺服器內部錯誤"
        }
        cursor.close()
        db.close()
        return jsonify(data), 500

# 刪除行程功能
@bookingApi.route('/booking', methods=["DELETE"])
def delete_booking():
    try:
        db=connection_pool.get_connection()
        cursor = db.cursor()
        if "user" in session:
            UserId = session["id"]
            cursor.execute('delete from `booking` where user_id=%s',(UserId,))
            db.commit()
            data = {"ok": True}
            cursor.close()
            db.close()
            return jsonify(data)
        data = {
            "error": True,
            "message": "未登入系統，拒絕存取"
        }
        cursor.close()
        db.close()
        return jsonify(data), 403
    except:
        data = {
            "error": True,
            "message": "伺服器內部錯誤"
        }
        cursor.close()
        db.close()
        return jsonify(data), 500

