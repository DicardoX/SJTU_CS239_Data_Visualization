# mysql_base.py


import pymysql
import pandas as pd
import datetime

from Utils.get_csv_input import get_csv_input
from Utils.get_date import get_date


# 在database中创建table
def create_table(my_table_name):
    # 使用 execute() 方法执行 SQL，如果表存在则删除
    cursor.execute("DROP TABLE IF EXISTS %s" % my_table_name)

    sql = ""

    if my_table_name == "central_location" or my_table_name == "city_location_hash_table":
        # 使用预处理语句创建表
        sql = """CREATE TABLE %s(
                 CITY_NAME CHAR(20) NOT NULL,
                 LAT FLOAT,
                 LON FLOAT)""" % my_table_name
    elif my_table_name == "city_features":
        sql = """CREATE TABLE %s(
                 CITY_NAME CHAR(20) NOT NULL,
                 DATE CHAR(20) NOT NULL,
                 PM2_5 FLOAT,
                 PM10 FLOAT,
                 SO2 FLOAT,
                 NO2 FLOAT,
                 CO FLOAT,
                 O3 FLOAT,
                 U FLOAT,
                 V FLOAT,
                 TEMP FLOAT,
                 RH FLOAT,
                 PSFC FLOAT)""" % my_table_name
    elif my_table_name == "city_based_AQI":
        sql = """CREATE TABLE %s(
                 CITY_NAME CHAR(20) NOT NULL,
                 DATE CHAR(20) NOT NULL,
                 AQI FLOAT)""" % my_table_name

    # Execute
    cursor.execute(sql)


# 在database的某个table中插入内容, info_dict = {"北京市": [lat, lon], ...}
def insert_content_in_table(my_table_name, info_dict):
    if my_table_name == "central_location":
        for key in info_dict.keys():
            # SQL 插入语句
            sql = """INSERT INTO %s(CITY_NAME,
                         LAT, LON) VALUES ('""" % my_table_name + key + """', %.2f, %.2f)""" % (
            info_dict[key][0], info_dict[key][1])
            try:
                # 执行sql语句
                cursor.execute(sql)
                # 提交到数据库执行
                db_connection.commit()
            except:
                # 如果发生错误则回滚
                print("Error occurred when inserting table...")
                db_connection.rollback()
        return
    if my_table_name == "city_location_hash_table":
        for key in info_dict.keys():
            contents = info_dict[key]
            for i in range(len(contents)):
                sql = """INSERT INTO %s(CITY_NAME,
                                         LAT, LON) VALUES ('""" % my_table_name + key + """', %.2f, %.2f)""" % (
                    contents[i][0], contents[i][1])
                try:
                    cursor.execute(sql)
                    db_connection.commit()
                except SyntaxError as e:
                    print("Error occurred when inserting table...")
                    db_connection.rollback()
        return
    if my_table_name == "city_features":
        for key in info_dict.keys():
            contents = info_dict[key]
            for i in range(len(contents)):
                # Transfer from index to date
                date = get_date(year=2013, month=1, day=1, shift=i)

                sql = """INSERT INTO %s(CITY_NAME, DATE, PM2_5, PM10, SO2, NO2, CO, O3, U, V, TEMP, RH, PSFC) VALUES ('""" \
                      % my_table_name + key + "', '" + date + """', %.2f, %.2f, %.2f, %.2f, %.2f, %.2f, %.2f, %.2f, %.2f, %.2f, %.2f)""" % (
                    contents[i][0], contents[i][1], contents[i][2], contents[i][3], contents[i][4], contents[i][5],
                    contents[i][6], contents[i][7], contents[i][8], contents[i][9], contents[i][10])
                print(sql)
                try:
                    cursor.execute(sql)
                    db_connection.commit()
                except SyntaxError as e:
                    print("Error occurred when inserting table...")
                    db_connection.rollback()
        return
    if my_table_name == "city_based_AQI":
        for key in info_dict.keys():
            contents = info_dict[key]
            for i in range(len(contents)):
                # Transfer from index to date
                date = get_date(year=2013, month=1, day=1, shift=i)

                sql = """INSERT INTO %s(CITY_NAME, DATE, AQI) VALUES ('""" \
                      % my_table_name + key + "', '" + date + """', %.2f)""" % (
                          contents[i])
                print(sql)
                try:
                    cursor.execute(sql)
                    db_connection.commit()
                except SyntaxError as e:
                    print("Error occurred when inserting table...")
                    db_connection.rollback()
        return


# 在database中查询某个table的特定内容
def query_from_table(my_table_name, my_target, op, my_amount):
    if (my_table_name == "city_features" and my_target == "date") or (my_table_name == "central_location" and my_target == "city_name"):
        sql = """SELECT * FROM %s
                WHERE %s %s '%s'""" % (my_table_name, my_target, op, my_amount)
    else:
        sql = """SELECT * FROM %s
                WHERE %s %s %s""" % (my_table_name, my_target, op, my_amount)
    try:
        cursor.execute(sql)
        m_results = cursor.fetchall()
        return m_results
    except SyntaxError as e:
        print("Error occurred when fetching data from database...")


if __name__ == '__main__':
    # Path
    # table_name = 'central_location'
    # table_name = "city_location_hash_table"
    # table_name = "city_features"
    table_name = "city_based_AQI"
    database_name = "ChinaVis"
    # database_name = "mysql"

    # 配置
    config = {
        'host': 'localhost',
        'user': 'root',
        'password': 'XUE9508286011sz',  # 输入你的数据库密码
        'db': database_name,  # 输入你要连接的数据库名
        'local_infile': 1  # 值可以是1或True
    }

    # 打开数据库连接
    db_connection = pymysql.connect(**config)  # **表示函数中解包
    # 使用 cursor() 方法创建一个游标对象 cursor
    cursor = db_connection.cursor()

    local_dict = get_csv_input(table_name + ".csv")

    # Operation 1: table creation
    # print("Creating table: %s..." % table_name)
    # create_table(table_name)

    # Operation 2: table insert
    print("Inserting content into table: %s..." % table_name)
    insert_content_in_table(table_name, local_dict)

    # Operation 3: table query
    # target = "city_name"
    # operator = '='
    # amount = "合肥市"
    # print("Querying table: %s | Target: %s | Operator: %s | Amount: %s" %
    #       (table_name, target, operator, str(amount)))
    # results = query_from_table(table_name, target, operator, amount)
    # print(results)

    # 关闭数据库连接
    db_connection.close()
