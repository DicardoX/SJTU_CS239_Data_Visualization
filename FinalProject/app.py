from flask import Flask, render_template, request, redirect, url_for, jsonify
import pandas as pd
import settings
import pymysql


# -------------------------- MySQL Query Part -------------------------------
# Name of database:
DATABASE_NAME = "ChinaVis"
# Configurations
config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'XUE9508286011sz',
    'db': DATABASE_NAME,
    'local_infile': 1
}


# Query from table
def query_from_table(my_table_name, my_targets, my_operators, my_amounts):
    sql = """SELECT * FROM %s
             WHERE """ % my_table_name

    for i in range(len(my_targets)):
        if (my_table_name == "city_features" and (my_targets[i] == "date" or my_targets[i] == "city_name")) or (
                my_table_name == "central_location" and my_targets[i] == "city_name") or (
                my_table_name == "city_based_AQI"
                and (my_targets[i] == "date" or my_targets[i] == "city_name")) or (my_table_name == "city_based_IAQI"
                                                                                   and (my_targets[i] == "date" or
                                                                                        my_targets[i] == "city_name")):
            sql += "%s %s '%s' and " % (my_targets[i], my_operators[i], my_amounts[i]) if i < len(my_targets) - 1 \
                else "%s %s '%s'" % (my_targets[i], my_operators[i], my_amounts[i])
        else:
            sql += "%s %s %s and " % (my_targets[i], my_operators[i], my_amounts[i]) if i < len(my_targets) - 1 \
                else "%s %s %s" % (my_targets[i], my_operators[i], my_amounts[i])
    print(sql)
    try:
        cursor.execute(sql)
        m_results = cursor.fetchall()
        return m_results
    except SyntaxError as e:
        print("Error occurred when fetching data from database...")


# Query for city features
def query_city_features(my_targets, my_operators, my_amounts):
    if not (len(my_targets) == len(my_operators) == len(my_amounts) and len(my_targets) > 0):
        print("Error occurred when checking the length of list, please confirm the input...")
        return ()
    table_name = "city_features"
    print("Querying table: %s | Targets: %s | Operators: %s | Amounts: %s" %
          (table_name, str(my_targets), str(my_operators), str(my_amounts)))
    m_results = query_from_table(table_name, my_targets, my_operators, my_amounts)
    return m_results


# Query for city based AQI
def query_city_based_AQI(my_targets, my_operators, my_amounts):
    if not (len(my_targets) == len(my_operators) == len(my_amounts) and len(my_targets) > 0):
        print("Error occurred when checking the length of list, please confirm the input...")
        return ()
    table_name = "city_based_AQI"
    print("Querying table: %s | Targets: %s | Operators: %s | Amounts: %s" %
          (table_name, str(my_targets), str(my_operators), str(my_amounts)))
    m_results = query_from_table(table_name, my_targets, my_operators, my_amounts)
    return m_results


# Query for city based IAQI
def query_city_based_IAQI(my_targets, my_operators, my_amounts):
    if not (len(my_targets) == len(my_operators) == len(my_amounts) and len(my_targets) > 0):
        print("Error occurred when checking the length of list, please confirm the input...")
        return ()
    table_name = "city_based_IAQI"
    print("Querying table: %s | Targets: %s | Operators: %s | Amounts: %s" %
          (table_name, str(my_targets), str(my_operators), str(my_amounts)))
    m_results = query_from_table(table_name, my_targets, my_operators, my_amounts)
    return m_results
# ------------------------ MySQL Query Part End -----------------------------


def read_csv(file_path):
    input_file = pd.read_csv(file_path)
    return input_file


# 生成Flask类的实例，__name__参数的作用：规定模版和静态文件的查找路径
app = Flask(__name__)
# 环境设置
app.config.from_object(settings)
# 读入csv文件
file = read_csv("./static/data/hotel.csv")

# 预测总天数
predicted_days_num = 7
# 检测指标列表
target_list = ["PM2_5", "PM10", "SO2", "NO2", "CO", "O3", "U", "V", "TEMP", "RH", "PSFC"]


@app.route('/')
def index():
    return render_template("index.html")


# # 更新表格
# def update_table(table):
#     ret = {}
#
#     # 保存文件，将dict转化为dataframe格式，再使用to_csv进行转化
#     ret = pd.DataFrame(ret)
#     ret.to_csv(r"./output.csv")


@app.route('/server_update_predicted_curve', methods=['POST'])
def update_predicted_curve():
    # 获取JSON
    target = request.get_json()

    if target.get("PredictedCurveRequest") is not None:  # 初始化请求
        print("Request received for updating predicted curve!")

        city_name = target.get("City_name")
        target_type = target.get("Target_type")
        target_type_index = target_list.index(target_type)
        print(target_type_index)

        print("City name: %s | Target type: %s" % (city_name, target_type))

        # 从mysql数据库获取数据，2018_01_01到2018_01_07共7天的数据
        # 特征
        targets, operators, amounts = ["city_name", "date", "date"], ['=', '>', '<'], ["合肥市", "2017_12_31", "2018_01_08"]
        results = query_city_features(my_targets=targets, my_operators=operators, my_amounts=amounts)
        # AQI
        targets, operators, amounts = ["city_name", "date", "date"], ['=', '>', '<'], ["合肥市", "2017_12_31",
                                                                                       "2018_01_08"]
        AQIs = query_city_based_AQI(my_targets=targets, my_operators=operators, my_amounts=amounts)
        # IAQI
        targets, operators, amounts = ["city_name", "date", "date"], ['=', '>', '<'], ["合肥市", "2017_12_31",
                                                                                       "2018_01_08"]
        IAQIs = query_city_based_IAQI(my_targets=targets, my_operators=operators, my_amounts=amounts)

        res = {
            "day1": [results[0][2 + target_type_index], AQIs[0][2], IAQIs[0][2 + target_type_index]],
            "day2": [results[1][2 + target_type_index], AQIs[1][2], IAQIs[1][2 + target_type_index]],
            "day3": [results[2][2 + target_type_index], AQIs[2][2], IAQIs[2][2 + target_type_index]],
            "day4": [results[3][2 + target_type_index], AQIs[3][2], IAQIs[3][2 + target_type_index]],
            "day5": [results[4][2 + target_type_index], AQIs[4][2], IAQIs[4][2 + target_type_index]],
            "day6": [results[5][2 + target_type_index], AQIs[5][2], IAQIs[5][2 + target_type_index]],
            "day7": [results[6][2 + target_type_index], AQIs[6][2], IAQIs[6][2 + target_type_index]],
        }
        return jsonify(res)

    else:
        # Do nothing
        return jsonify({"None": "true"})


if __name__ == '__main__':
    # Establish database connection
    db_connection = pymysql.connect(**config)
    # Create cursor
    cursor = db_connection.cursor()

    # Run server
    app.run()

    # Close database connection
    db_connection.close()
