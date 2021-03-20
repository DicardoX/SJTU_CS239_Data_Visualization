# 数据可视化作业四：网站前后端基础

[Ref](https://github.com/Yiyiyimu/SJTU-CS239-Visualization/tree/master/Week5/Better_version)

---------------

## 1. Flask基础知识

### 1.1 简介

​	[Flask: 微型Python框架 开源软件](https://www.oschina.net/p/flask?hmsr=aladdin1e1)

- Flask是一个**微型的Python开发的Web后端框架**，其 [WSGI](https://baike.baidu.com/item/WSGI) 工具箱采用 Werkzeug ，[模板引擎](https://baike.baidu.com/item/模板引擎/907667)则使用 Jinja2 。Flask使用 BSD 授权。Flask也被称为 “**microframework**” ，因为它使用简单的核心，用 extension 增加其他功能。Flask没有默认使用的数据库、窗体验证工具。

---------

### 1.2 示例

[Flask中文官方文档](http://docs.jinkan.org/docs/flask/quickstart.html#a-minimal-application)

[Flask之解读app.py文件](https://blog.csdn.net/weixin_44733660/article/details/103876868) 

- 最简单的Flask应用：

  ```
  from flask import Flask
  app = Flask(__name__)
  
  @app.route('/')
  def hello_world():
      return 'Hello World!'
  
  if __name__ == '__main__':
      app.run()
  ```

  启动：

  ```
  $ python hello.py
  * Running on http://127.0.0.1:5000/
  ```

  - 首先，我们导入了 [`Flask`](http://docs.jinkan.org/docs/flask/api.html#flask.Flask) 类。这个类的实例将会是我们的 WSGI 应用程序。
  - 接下来，我们创建一个该类的**实例**，第一个参数是应用模块或者包的名称。 如果你使用单一的模块（如本例），你应该使用 `__name__ `，作用是：
    - 可以规定模版和静态文件的查找路径
    - 以后一些flask插件，如Flask-SQLAlchemy如果报错了，可通过`__name__`参数找到具体错误位置
  - 然后，我们使用 **@app.route()装饰器**告诉 Flask 什么样的URL 能触发我们的函数，**将url中 “/” 映射到hello_world这个视图函数上面**。**以后你访问我这个网站的 / 目录的时候 会执行hello_world这个函数，然后将这个函数的返回值返回给浏览器**
  - 这个函数的名字也在生成 URL 时被特定的函数采用，这个函数返回我们想要显示在用户浏览器中的信息。
  - 最后我们用 [`run()`](http://docs.jinkan.org/docs/flask/api.html#flask.Flask.run) 函数来让应用运行在本地服务器上。 其中 `if __name__ =='__main__':` 确保服务器只会在该脚本被 Python 解释器直接执行的时候才会运行，而不是作为模块导入的时候。

-----

### 1.3 render_template 模版渲染

[Flask 学着用模板 render_template](https://blog.csdn.net/yy19890521/article/details/81034765) 

- 模板的位置放在templates文件夹下面，一般是html文件，我们把index.html改动成如下样式：

```
<html>
  <head>
    <title>{{title}} - microblog</title>
  </head>
  <body>
      <h1>Hello, {{user.nickname}}!</h1>
  </body>
</html>
```

​	<font color=blue>注意</font>：**{{}}**表示这是一个变量，可以根据用户在模块端给予的参数的不同，进行调整

- 在调用**render_template**模版时，我们可以**根据在html文件中设置的变量，来进行参数的传递，从而进行模版渲染**。具体到上面的例子，即：

```
from flask import render_template
from app import app

@app.route('/')
@app.route('/index')
def index():
    user = {'nickname': 'Miguel'} 						# fake user
    return render_template("index.html", title = 'Home', user = user)     											#这里模块里的第一个user指的是html里面的变量user，而第二个user指的是函数index里面的变量user
```

------

### 1.4 app.route中的方法选项Method

[python flask中HTTP方法methods=['GET','POST'] （概览）](https://blog.csdn.net/m0_38124502/article/details/78680498)

[表单中method="post"什么意思？](https://zhidao.baidu.com/question/40070502.html)

- 表单Form提供了两种数据传输的方式——get和post。虽然它们都是数据的提交方式，但是在实际传输时确有很大的不同，并且可能会对数据产生严重的影响。虽然为了方便的得到变量值，Web容器已经屏蔽了二者的一些差异，但是了解二者的差异在以后的编程也会很有帮助的。
- Form中的get和post方法，在数据传输过程中分别对应了HTTP协议中的GET和POST方法。
- **POST**：
  - 从前端将数据发送到服务器（提交数据）
  - 适合传输敏感数据，无数据量的限制
  - 支持整个ISO10646字符集
  - 表示客户端请求的时候还要提交数据，比如提交form表单，要提交的数据会放到请求报文的body部分
- **GET**：
  - 前端从服务器上获取数据（获取数据）
  - **Get将表单中数据的按照variable=value的形式，添加到action所指向的URL后面，并且两者使用“?”连接，而各个变量之间使用“&”连接**
  - 限制Form表单的数据集的值必须为ASCII字符
- 二者在实现上的差异参见`../作业四/简单的前后端实例`中的`app.py`和`sort.js`分别实现的`postSort()`和`getSort()`函数

-------



## 2. AJAX基础知识

[W3school：AJAX简介](https://www.w3school.com.cn/js/js_ajax_intro.asp)

### 2.1 简介

- **AJAX (Asynchronous JavaScript and XML) ，异步JS和XML**
- 功能：
  - 不刷新页面更新网页
  - 在页面加载后从服务器请求数据
  - 在页面加载后从服务器接收数据
  - 在后台向服务器发送数据
- **并非编程语言**！仅仅组合了二者：
  - **浏览器内建的 XMLHttpRequest 对象**（从 web 服务器请求数据）
  - JavaScript 和 HTML DOM（显示或使用数据）

- Ajax 应用程序可能使用 XML 来传输数据，但将数据作为纯文本或 JSON 文本传输也同样常见(例如：.**py文件使用flask内的request.get_json()来获取POST请求参数（GET方法的类似函数有所不同）**，**.js文件内使用JSON.stringify和JSON.parse来进行json文件的生成或解析（返回文件为XMLHttpRequest.responseText）**)。
- Ajax 允许通过与场景后面的 Web 服务器交换数据来异步更新网页。这意味着可以更新网页的部分，而不需要重新加载整个页面。
- 工作模式图：

<img src="./pic/ajax.gif" alt="avatar" style="zoom:100%;" />

- **创建XMLHttpRequest 对象 **(Ajax的核心)：
  - `var xhr = new XMLHttpRequest()`
  - 对象方法：
    - **abort()**：取消当前请求
    - **getAllResponseHeaders()**：返回头部信息
    - **getResponseHeader()**：返回特定的头部信息
    - **open(method, url, async, user, password)**：规定请求
    - **send()**：用于GET方法将请求发送到服务器
    - **send(string)**：用于POST方法将请求发送到服务器
    - **setRequesetHeader()**：向要发送的报头添加标签/值对
  - 对象属性：
    - **onreadystatechange**：定义当 readyState 属性发生变化时被调用的函数
    - **readyState**：保存 XMLHttpRequest 的状态
      - 0：请求未初始化
      - 1：服务器连接已建立
      - 2：请求已收到
      - 3：正在处理请求
      - 4：请求已完成且响应已就绪
    - **responseText**：以字符串返回响应数据
    - **responseXML**：以 XML 数据返回响应数据
    - **status**：返回请求的状态号
      - 200: "OK"
      - 403: "Forbidden"
      - 404: "Not Found"
    - **statusText**：返回状态文本（比如 "OK" 或 "Not Found"）

-------



## 3. 实践过程中遇到的问题

- 注意：在运行demo的时候发现render_template函数无法找到templates目录下的index.html，原因是**没有将templates认证为templates目录，pycharm中右键该目录选择`mark this folder as templates`即可**。
- 在运行app.py时，发现并无网页窗口弹出，**需要点击输出中的网址 (Running on http://127.0.0.1:5000/) 才可进入正在运行后端程序的前端界面**，而不能直接点击打开html：

**IDE运行app.py**：

<img src="./pic/截屏2021-03-20 下午12.07.21.png" alt="avatar" style="zoom:67%;" />

**命令行运行app.py**：

<img src="./pic/WechatIMG18.jpeg" alt="avatar " style="zoom:67%;" />