import mysql.connector.pooling
import mysql.connector
# 讀取.env的隱藏資料
from dotenv import load_dotenv
import os

load_dotenv()
# dbUser = os.getenv("dbUser")
# dbPassword = os.getenv("dbPassword")

# connection_pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="db",
#                                                             pool_size=10,
#                                                             pool_reset_session=True,
#                                                             host='localhost',
#                                                             database='taipeidata',
#                                                             user=dbUser,
#                                                             password=dbPassword)


rdsHost = os.getenv("rdsHost")
rdsDatabease = os.getenv("rdsDatabase")
rdsUser = os.getenv("rdsUser")
rdsPassword = os.getenv("rdsPassword")


connection_pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="db",
                                                   pool_size=3,
                                                   host=rdsHost,
                                                   user=rdsUser,
                                                   password=rdsPassword,
                                                   database=rdsDatabease,
                                                   port=3306)