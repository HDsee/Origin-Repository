from flask import *
from flask import session
from connector import connection_pool

attractionApi = Blueprint( 'attractionApi', __name__)

#用page&keyword取得景點資料列表
@attractionApi.route('/attractions')
def api_attractions():
    try :
        db=connection_pool.get_connection()
        cursor=db.cursor(dictionary=True)
        page = int(request.args.get('page'))
        first_page = page * 12
        next_page = page + 1
        if request.args.get('keyword'):
            keyword = request.args.get('keyword')
            cursor.execute('select * from `attraction` where name like %s limit %s,%s',('%' + keyword + '%',first_page,12))
            attraction_list = cursor.fetchall()
            if attraction_list:
                cursor.execute('select * from `attraction` where name like %s limit %s,%s',('%' + keyword + '%',first_page+12,12))
                next_list = cursor.fetchall()
                if len(next_list)== 0:
                    next_page = None
                for i in range (0,len(attraction_list)):
                    attraction_list[i]["images"] = eval(attraction_list[i]["images"])#用eval把字串轉換成list
                attractions = {
                    "nextPage":next_page,
                    "data":attraction_list
                }
            return jsonify(attractions)
        else:
            cursor.execute('select * from `attraction` limit %s,%s',(first_page,12))
            attraction_list = cursor.fetchall()
            if attraction_list:
                cursor.execute('select * from `attraction` limit %s,%s',(first_page+12,12))
                next_list = cursor.fetchall()
                if len(next_list)== 0:
                    next_page = None
                for i in range (0,len(attraction_list)):
                    attraction_list[i]["images"] = eval(attraction_list[i]["images"])#用eval把字串轉換成list
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
    finally:
        cursor.close()
        db.close()

#景點編號取得資料列表
@attractionApi.route('/attraction/<int:attractionId>')
def api_attractionId(attractionId):
    try:
            db=connection_pool.get_connection()
            cursor=db.cursor(dictionary=True)
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
    finally:
        cursor.close()
        db.close()	
    


