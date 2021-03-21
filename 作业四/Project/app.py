from flask import Flask, render_template, request, redirect, url_for, jsonify
import pandas as pd
import settings


def read_csv(filepath):
    file = pd.read_csv(filepath)
    return file


# 生成Flask类的实例，__name__参数的作用：规定模版和静态文件的查找路径
app = Flask(__name__)
# 环境设置
app.config.from_object(settings)
# 读入csv文件
file = read_csv("./static/data/hotel.csv")


@app.route('/')
def index():
    return render_template("index.html")


# 更新表格
def update_table(table):
    ret = {}

    newFemale = table["female"]
    newLocal = table["local"]
    newUSA = table["USA"]
    newSA = table["SA"]
    newEU = table["EU"]
    newMEA = table["MEA"]
    newASIA = table["ASIA"]
    newBusinessmen = table["businessmen"]
    newTourists = table["tourists"]
    newDR = table["DR"]
    newAgency = table["agency"]
    newAC = table["AC"]
    newU20 = table["u20"]
    new20to35 = table["_20to35"]
    new35to55 = table["_35to55"]
    newM55 = table["m55"]
    newPrice = table["price"]
    newLoS = table["LoS"]
    newOccupancy = table["occupancy"]
    newConventions = table["conventions"]

    ret["female"] = newFemale
    ret["local"] = newLocal
    ret["USA"] = newUSA
    ret["SA"] = newSA
    ret["EU"] = newEU
    ret["MEA"] = newMEA
    ret["ASIA"] = newASIA
    ret["businessmen"] = newBusinessmen
    ret["tourists"] = newTourists
    ret["DR"] = newDR
    ret["agency"] = newAgency
    ret["AC"] = newAC
    ret["u20"] = newU20
    ret["20to35"] = new20to35
    ret["25to55"] = new35to55
    ret["m55"] = newM55
    ret["price"] = newPrice
    ret["LoS"] = newLoS
    ret["occupancy"] = newOccupancy
    ret["conventions"] = newConventions

    # 保存文件，将dict转化为dataframe格式，再使用to_csv进行转化
    ret = pd.DataFrame(ret)
    ret.to_csv(r"./output.csv")


@app.route('/table_init', methods=['POST'])
@app.route('/update_hotel_info', methods=['POST'])
def update_hotel_info():
    # 获取服务器本地数据
    female = list(file['female'])
    local = list(file['local'])
    USA = list(file['USA'])
    SA = list(file['SA'])
    EU = list(file['EU'])
    MEA = list(file['MEA'])
    ASIA = list(file['ASIA'])
    businessmen = list(file['businessmen'])
    tourists = list(file['tourists'])
    DR = list(file['DR'])
    agency = list(file['agency'])
    AC = list(file['AC'])
    u20 = list(file['u20'])
    _20to35 = list(file['20to35'])
    _35to55 = list(file['35to55'])
    m55 = list(file['m55'])
    price = list(file['price'])
    LoS = list(file['LoS'])
    occupancy = list(file['occupancy'])
    conventions = list(file['conventions'])

    table = request.get_json()
    if table.get("None") is not None:  # 初始化请求
        res = {
            "female": female,
            "local": local,
            "USA": USA,
            "SA": SA,
            "EU": EU,
            "MEA": MEA,
            "ASIA": ASIA,
            "businessmen": businessmen,
            "tourists": tourists,
            "DR": DR,
            "agency": agency,
            "AC": AC,
            "u20": u20,
            "_20to35": _20to35,
            "_35to55": _35to55,
            "m55": m55,
            "price": price,
            "LoS": LoS,
            "occupancy": occupancy,
            "conventions": conventions
        }
        return jsonify(res)

    else:  # 更新请求
        update_table(table)
        return jsonify({"None": "true"})


if __name__ == '__main__':
    app.run()
