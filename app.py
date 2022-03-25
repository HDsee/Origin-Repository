from flask import *

#import api
from api.attraction import attractionApi 
from api.user import userApi 

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config["JSON_SORT_KEYS"] = False #阻止json按照字母排序

#註冊blueprint
app.register_blueprint(attractionApi, url_prefix='/api')
app.register_blueprint(userApi, url_prefix='/api')

app.secret_key="HD"
# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000,debug=True)