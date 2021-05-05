from flask import Flask, render_template, request, redirect, url_for, jsonify
import settings
import json

# 生成Flask类的实例，__name__参数的作用：规定模版和静态文件的查找路径
app = Flask(__name__)
# 环境设置
app.config.from_object(settings)


@app.route('/')                                     # 装饰器，将该URL映射到index()函数上，每次访问网站的/目录时会执行index()函数，并将返回值返回给浏览器
def index():
    return render_template("index.html")            # 引入并渲染模版。模板的位置放在templates文件夹下面，一般是html文件


@app.route('/postSort', methods=['POST'])
def postSort():
    # 获取 POST 请求参数，"array"的名称是在.js文件中声明的
    array = request.get_json()["array"]
    # 升序
    array = sorted(list(map(int, array.split(","))))
    # 构造称json文件的格式
    res = {"sorted_array": array}
    # 使用flask内的jsonify函数来将res封装称json文件
    return jsonify(res)


@app.route('/getSort', methods=["GET", "POST"])
def getSort():
    # 获取 GET 请求参数
    array = request.args.get("array")
    # 降序
    array = sorted(list(map(int, array.split(","))), reverse=True)
    res = {"sorted_array": array}
    return jsonify(res)


if __name__ == '__main__':
    app.run()
