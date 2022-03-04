# 串接、擷取公開資料
import urllib.request as request
import json
import mysql.connector

db = mysql.connector.connect(
    host='localhost',
    port='3306',
    user='root',
    password='root',
    database='taipeidata'
)

cursor = db.cursor()
url = 'data/taipei-attractions.json'

with open(url, mode='r', encoding='utf-8') as response:
    data = json.load(response)
data = data['result']['results']
data_length = len(data)


for i in range(data_length):
    place = data[i]
    imgs = place['file'].split('https:')
    img_list = []
    img_length = len(imgs)
    for j in range(1, img_length):
        img_data = imgs[j][-4:]
        if img_data == '.jpg' or img_data == '.JPG' or img_data == '.png':
            img_url = 'https:'+imgs[j]
            img_list.append(img_url)
    sql = 'INSERT INTO attraction (name, category, description, address, transport, mrt, latitude, longitude, images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)'
    val = (place['stitle'], place['CAT2'], place['xbody'], place['address'], place['info'], place['MRT'], 
            place['latitude'], place['longitude'], json.dumps(img_list))
    cursor.execute(sql, val)
    db.commit()