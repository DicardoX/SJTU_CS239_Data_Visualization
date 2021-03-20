# 数据可视化作业四：网站前后端基础

---------------

## 1. Flask基础知识

### 1.1 简介

​	[Flask: 微型Python框架 开源软件](https://www.oschina.net/p/flask?hmsr=aladdin1e1)

- Flask是一个**微型的Python开发的Web后端框架**，其 [WSGI](https://baike.baidu.com/item/WSGI) 工具箱采用 Werkzeug ，[模板引擎](https://baike.baidu.com/item/模板引擎/907667)则使用 Jinja2 。Flask使用 BSD 授权。Flask也被称为 “**microframework**” ，因为它使用简单的核心，用 extension 增加其他功能。Flask没有默认使用的数据库、窗体验证工具。

---------

### 1.2 示例

[Flask中文官方文档](http://docs.jinkan.org/docs/flask/quickstart.html#a-minimal-application)

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
  - 接下来，我们创建一个该类的**实例**，第一个参数是应用模块或者包的名称。 如果你使用单一的模块（如本例），你应该使用 `__name__ `，因为模块的名称将会因其作为单独应用启动还是作为模块导入而有不同（ 也即是 `'__main__'` 或实际的导入名）。这是必须的，这样 Flask 才知道到哪去找模板、静态文件等等。详情见 [`Flask`](http://docs.jinkan.org/docs/flask/api.html#flask.Flask)的文档。
  - 然后，我们使用 [`route()`](http://docs.jinkan.org/docs/flask/api.html#flask.Flask.route) 装饰器告诉 Flask 什么样的URL 能触发我们的函数。
  - 这个函数的名字也在生成 URL 时被特定的函数采用，这个函数返回我们想要显示在用户浏览器中的信息。
  - 最后我们用 [`run()`](http://docs.jinkan.org/docs/flask/api.html#flask.Flask.run) 函数来让应用运行在本地服务器上。 其中 `if __name__ =='__main__':` 确保服务器只会在该脚本被 Python 解释器直接执行的时候才会运行，而不是作为模块导入的时候。



-------



## 2. 实践过程中遇到的问题

- 注意：在运行demo的时候发现render_template函数无法找到templates目录下的index.html，原因是**没有将templates认证为templates目录，pycharm中右键该目录选择`mark this folder as templates`即可**。
- 在运行app.py时，发现并无网页窗口弹出，**需要点击输出中的网址 (Running on http://127.0.0.1:5000/) 才可进入正在运行后端程序的前端界面**，而不能直接点击打开html：

**IDE运行app.py**：

<img src="./pic/截屏2021-03-20 下午12.07.21.png" alt="avatar" style="zoom:67%;" />

**命令行运行app.py**：

<img src="./pic/WechatIMG18.jpeg" alt="avatar " style="zoom:67%;" />