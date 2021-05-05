// postSort和getSort分别展示了两种不同的数据传输方法：POST和GET，在实现上的区别

function postSort() {
    var xhr = new XMLHttpRequest();
    // true，即异步执行，如果为false，则会阻塞直到数据返回
    xhr.open("POST", "/postSort", true);

    // 设置请求头
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");

    // 向后端 (app.py) 发送请求，封装成json文件发送
    xhr.send(JSON.stringify({
        // 这里是使用DOM接口获取html中定义的<p>元素的内容，其中[0]表示第一个出现的<p>标签 (Tag)，再将数据用json文件的方式传输给后端
        "array" : document.getElementsByTagName("p")[0].innerText
    }));

    // 获取后端 (app.py) 的响应
    xhr.onreadystatechange  = function () {
        // this指代的是前面定义的XMLHttpRequest对象xhr，这两个状态信息代表成功返回，为XMLHttpRequest类的成员
        if(this.readyState == 4 && this.status == 200){
            // 成功返回，xhr.responseText格式为json文件，需要parse解析
            var array = JSON.parse(xhr.responseText).sorted_array;
            var p = document.getElementsByTagName("p")[1];
            p.innerText = array.join(", ");
        }
    }
}

function getSort() {
    var xhr = new XMLHttpRequest();
    // true，即异步执行，如果为false，则会阻塞直到数据返回
    // 数据直接放在URL内，不安全，与POST方法区别
    var array = document.getElementsByTagName("p")[0].innerText;
    xhr.open("GET", "/getSort?array=" + array, true);

    // 设置请求头
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");

    // 向后端 (app.py) 发送请求，只有post请求有send(string)
    xhr.send();

    // 获取后端 (app.py) 的响应，与postSort相同，原因是POST / GET在这里仅为表单的发送选项
    xhr.onreadystatechange  = function () {
        // this指代的是前面定义的XMLHttpRequest对象xhr
        if(this.readyState == 4 && this.status == 200){
            // 成功返回
            var array = JSON.parse(xhr.responseText).sorted_array;
            var p = document.getElementsByTagName("p")[2];
            p.innerText = array.join(", ");
        }
    }
}