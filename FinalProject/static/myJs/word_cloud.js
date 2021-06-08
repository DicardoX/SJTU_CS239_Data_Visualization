

function set_word_cloud(params_name) {
    console.log("word_cloud");

    var xhr = new XMLHttpRequest();
    // true，即异步执行，如果为false，则会阻塞直到数据返回
    xhr.open("POST", "/server_set_word_cloud", true);

    // 设置请求头
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");

    // 向后端 (app.py) 发送请求，封装成json文件发送
    xhr.send(JSON.stringify({
        "city_name": params_name,
    }))

    // 获取后端 (app.py) 的响应
    xhr.onreadystatechange = function () {
        // this指代的是前面定义的XMLHttpRequest对象xhr，这两个状态信息代表成功返回，为XMLHttpRequest类的成员
        if (this.readyState == 4 && this.status == 200) {
            //console.log(xhr.responseText);
            // 成功返回，xhr.responseText格式为json文件，需要parse解析
            let word_cloud_data = JSON.parse(xhr.responseText).result;
            console.log(word_cloud_data);
            //console.log(word_cloud_data);
            let dom1 = document.getElementById("word_cloud_container");
    //console.log(dom1);
    var chart1 = echarts.init(dom1);
    var app = {};
    var option1;
            option1 = {
                tooltip: {},
                series: [{
                    type: 'wordCloud',
                    gridSize: 5,
                    sizeRange: [20, 60],
                    rotationRange: [-90, 90],
                    shape: 'pentagon',
                    width: 1000,
                    height: 1000,
                    drawOutOfBound: true,
                    textStyle: {
                        color: function () {
                            return 'rgb(' + [
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160)
                            ].join(',') + ')';
                        }
                    },
                    emphasis: {
                        textStyle: {
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    data: word_cloud_data
                }]
            };
            //console.log(option1);
            option1 && chart1.setOption(option1);

        }
    }}