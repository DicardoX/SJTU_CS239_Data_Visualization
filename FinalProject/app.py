from flask import Flask, render_template, request, redirect, url_for, jsonify
import pandas as pd
import settings
import pymysql
import codecs
import jieba
import json
import jieba.posseg as pseg
from collections import Counter
import os


# ------------------------ Observed City List -------------------------------
observed_city_name = ["上海", "上海市",
                      "北京", "北京市",
                      "天津", "天津市",
                      "重庆", "重庆市",
                      "哈尔滨", "哈尔滨市", "大庆", "大庆市", "齐齐哈尔", "齐齐哈尔市",
                      "长春", "长春市", "吉林", "吉林市", "四平", "四平市",
                      "大连", "大连市", "沈阳", "沈阳市", "铁岭", "铁岭市",
                      "呼和浩特", "呼和浩特市", "包头", "包头市", "鄂尔多斯", "鄂尔多斯市",
                      "石家庄", "石家庄市", "唐山", "唐山市", "保定", "保定市", "承德", "承德市",
                      "太原", "太原市", "大同", "大同市", "临汾", "临汾市",
                      "青岛", "青岛市", "济南", "济南市", "烟台", "烟台市", "威海", "威海市",
                      "郑州", "郑州市", "洛阳", "洛阳市", "开封", "开封市",
                      "南京", "南京市", "苏州", "苏州市", "扬州", "扬州市", "徐州", "徐州市",
                      "合肥", "合肥市", "黄山", "黄山市", "芜湖", "芜湖市",
                      "武汉", "武汉市", "襄阳", "襄阳市", "宜昌", "宜昌市", "荆州", "荆州市",
                      "长沙", "长沙市", "岳阳", "岳阳市", "张家界", "张家界市",
                      "南昌", "南昌市", "九江", "九江市", "景德镇", "景德镇市",
                      "杭州", "杭州市", "宁波", "宁波市", "温州", "温州市", "舟山", "舟山市",
                      "厦门", "厦门市", "泉州", "泉州市", "福州", "福州市",
                      "广州", "广州市", "深圳", "深圳市", "珠海", "珠海市",
                      "桂林", "桂林市", "南宁", "南宁市", "北海", "北海市",
                      "三亚", "三亚市", "海口", "海口市", "文昌", "文昌市",
                      "遵义", "遵义市", "贵阳", "贵阳市", "安顺", "安顺市",
                      "昆明", "昆明市", "丽江", "丽江市", "大理", "大理市",
                      "成都", "成都市", "绵阳", "绵阳市", "宜宾", "宜宾市", "乐山", "乐山市",
                      "西安", "西安市", "延安", "延安市", "咸阳", "咸阳市",
                      "兰州", "兰州市", "天水", "天水市", "敦煌", "敦煌市",
                      "银川", "银川市", "中卫", "中卫市", "吴忠", "吴忠市",
                      "西宁", "西宁市", "格尔木", "格尔木市", "海东", "海东市",
                      "乌鲁木齐", "乌鲁木齐市", "吐鲁番", "吐鲁番市", "喀什", "喀什市", "哈密", "哈密市",
                      "拉萨", "拉萨市", "林芝", "林芝市",
                      "台北", "台北市", "高雄", "高雄市", "桃园", "桃园市", "台南", "台南市", "花莲", "花莲市"]
# ---------------------- Observed City List End -----------------------------

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
    # Establish database connection
    db_connection = pymysql.connect(**config)
    # Create cursor
    cursor = db_connection.cursor()

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

        # Close database connection
        db_connection.close()

        return m_results
    except SyntaxError as e:
        # Close database connection
        db_connection.close()
        return ()
        # print("Error occurred when fetching data from database...")


# Query for city features
def query_city_features(my_targets, my_operators, my_amounts):
    if not (len(my_targets) == len(my_operators) == len(my_amounts) and len(my_targets) > 0):
        print("Error occurred when checking the length of list, please confirm the input...")
        return ()
    table_name = "city_features"
    # print("Querying table: %s | Targets: %s | Operators: %s | Amounts: %s" %
    #       (table_name, str(my_targets), str(my_operators), str(my_amounts)))
    m_results = query_from_table(table_name, my_targets, my_operators, my_amounts)
    return m_results


# Query for city based AQI
def query_city_based_AQI(my_targets, my_operators, my_amounts):
    if not (len(my_targets) == len(my_operators) == len(my_amounts) and len(my_targets) > 0):
        print("Error occurred when checking the length of list, please confirm the input...")
        return ()
    table_name = "city_based_AQI"
    # print("Querying table: %s | Targets: %s | Operators: %s | Amounts: %s" %
    #       (table_name, str(my_targets), str(my_operators), str(my_amounts)))
    m_results = query_from_table(table_name, my_targets, my_operators, my_amounts)

    print(m_results)

    return m_results


# Query for city based IAQI
def query_city_based_IAQI(my_targets, my_operators, my_amounts):
    if not (len(my_targets) == len(my_operators) == len(my_amounts) and len(my_targets) > 0):
        print("Error occurred when checking the length of list, please confirm the input...")
        return ()
    table_name = "city_based_IAQI"
    # print("Querying table: %s | Targets: %s | Operators: %s | Amounts: %s" %
    #       (table_name, str(my_targets), str(my_operators), str(my_amounts)))
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
        # print(target_type_index)

        city_name += "市"

        print("City name: %s | Target type: %s" % (city_name, target_type))

        # 从mysql数据库获取数据，2018_01_01到2018_01_07共7天的数据
        # 特征
        targets, operators, amounts = ["city_name", "date", "date"], ['=', '>', '<'], [city_name, "2017_12_31", "2018_01_08"]
        results = query_city_features(my_targets=targets, my_operators=operators, my_amounts=amounts)
        # AQI
        targets, operators, amounts = ["city_name", "date", "date"], ['=', '>', '<'], [city_name, "2017_12_31",
                                                                                       "2018_01_08"]
        AQIs = query_city_based_AQI(my_targets=targets, my_operators=operators, my_amounts=amounts)
        # IAQI
        targets, operators, amounts = ["city_name", "date", "date"], ['=', '>', '<'], [city_name, "2017_12_31",
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


@app.route('/server_update_main_map', methods=['POST'])
def update_main_map():
    # 获取JSON
    target = request.get_json()

    if target.get("MainMapRequest") == 1:  # 初始化请求
        print("Request received for updating main map!")

        date = target.get("Date")

        print("Date: %s" % date)

        AQI_dict = {}
        # 从mysql数据库获取AQI数据，共90个城市，根据date查询的效率最高
        targets, operators, amounts = ["date"], ['='], [date]
        results = query_city_based_AQI(my_targets=targets, my_operators=operators, my_amounts=amounts)
        if len(results) > 0:
            for message in results:
                city_name = message[0].replace("市", "")
                # print(city_name)
                AQI_dict[city_name] = message[2]
        else:
            print("Error occurred when querying data for main map...")

        return jsonify(AQI_dict)

    else:
        # Do nothing
        return jsonify({"None": "true"})


@app.route('/server_update_pollution_amount', methods=['POST'])
def update_pollution_amount():
    # 获取JSON
    target = request.get_json()

    if target.get("PollutionAmountRequest") == 1:  # 初始化请求
        print("Request received for updating pollution amount!")

        date = target.get("Date")
        city_name = target.get("City_name")

        print("Date: %s | City Name: %s" % (date, city_name))

        AQI_dict = {}
        # 从mysql数据库获取AQI数据，共90个城市，根据date查询的效率最高
        targets, operators, amounts = ["date", "city_name"], ['=', '='], [date, city_name + "市"]
        results = query_city_based_IAQI(my_targets=targets, my_operators=operators, my_amounts=amounts)
        print(results)
        if len(results) > 0:
            # print(results)
            city_name = results[0][0].replace("市", "")
            AQI_list = []
            for i in range(2, len(results[0]), 1):
                AQI_list.append(float(results[0][i]))
            AQI_dict[city_name] = AQI_list
        else:
            print("Error occurred when querying data for main map...")

        return jsonify(AQI_dict)

    else:
        # Do nothing
        return jsonify({"None": "true"})


@app.route('/server_set_word_cloud', methods=['POST'])
def update_word_cloud():
    city_name = request.get_json()['city_name']
    print(city_name)
    word_cloud_data = []
    # print(myres[0]["content"])
    with codecs.open("static/json/news_txt/"+city_name+".txt", 'r', 'utf8') as f:
        txt = f.read()
    f.close()
    jieba.enable_paddle()
    seg_list = pseg.cut(txt, use_paddle=True)
    c = Counter()
    for x, flag in seg_list:
        if not(flag == 'n' or flag == 'v' or flag == 'nz' or flag == 'a' or flag == 'LOC'):
            continue
        if len(x) > 1 and x != '\r\n':
            c[x] += 1
    print('常用词频度统计结果')

    flag = True
    for (k, v) in c.most_common(100):
        if flag:
            word_cloud_data.append({'name': k,
                                    'value': v,
                                    'textStyle': {
                                        'color': 'black'
                                    },
                                    'emphasis': {
                                        'textStyle': {
                                            'color': 'red'
                                        }
                                    }})
            flag = False

        else:
            word_cloud_data.append({
                'name': k,
                'value': v
            })

    res = {"result": word_cloud_data}
    # 使用flask内的jsonify函数来将res封装称json文件
    return jsonify(res)


if __name__ == '__main__':
    # # Establish database connection
    # db_connection = pymysql.connect(**config)
    # # Create cursor
    # cursor = db_connection.cursor()

    # Run server
    app.run()

    # # Close database connection
    # db_connection.close()
