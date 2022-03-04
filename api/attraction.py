from flask import *
import mysql.connector


db = mysql.connector.connect(
    host='localhost',
    port='3306',
    user='root',
    password='root',
    database='taipeidata',
    auth_plugin='mysql_native_password'
)

#dictionary轉換成字典
cursor = db.cursor(dictionary=True)

attractionApi = Blueprint( 'attractionApi', __name__)


#用page&keyword取得景點資料列表
@attractionApi.route('/attractions')
def api_attractions():
    try :
        page = int(request.args.get('page'))
        first_page = page * 12
        next_page = first_page + 1
        if request.args.get('keyword'):
            keyword = request.args.get('keyword')
            cursor.execute('select * from `attraction` where name like %s limit %s,%s',('%' + keyword + '%',first_page,12))
            attraction_list = cursor.fetchall()
            if attraction_list:
                attraction_list[0]["images"] = eval(attraction_list[0]["images"])#用eval把字串轉換成list
                cursor.execute('select * from `attraction` where name like %s limit %s,%s',('%' + keyword + '%',first_page+12,12))
                next_list = cursor.fetchall()
                if len(next_list)== 0:
                    next_page = None
                attractions = {
                    "nextPage":next_page,
                    "data":attraction_list
                }
            return jsonify(attractions)
        else:
            cursor.execute('select * from `attraction` limit %s,%s',(first_page,12))
            attraction_list = cursor.fetchall()
            if attraction_list:
                attraction_list[0]["images"] = eval(attraction_list[0]["images"])#用eval把字串轉換成list
                attractions = {
                    "nextPage":next_page,
                    "data": attraction_list
                }
            return jsonify(attractions)
    except:
        return {
			"error": True,
			"message": "伺服器內部錯誤"
		}, 500

#景點編號取得資料列表
@attractionApi.route('/attraction/<int:attractionId>')
def api_attractionId(attractionId):
    try:
            if attractionId:
                cursor.execute('select * from `attraction` where id=%s',(attractionId,))
                attraction_list = cursor.fetchall()
                if attraction_list:
                    attraction_list[0]["images"] = eval(attraction_list[0]["images"])
                    attractions = {
                        "data":attraction_list[0]#抓取list內的字典
                    }
                    return jsonify(attractions)
                else:
                    return {
                        "error": True,
                        "message": "景點編號不正確"
                    }, 400
    except:
        return {
            "error": True,
            "message": "伺服器內部錯誤"
        }, 500	
    


