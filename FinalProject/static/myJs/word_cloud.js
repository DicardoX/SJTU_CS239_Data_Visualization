// word_cloud.js

function set_word_cloud(params_name) {
    console.log("word_cloud");
    var url = "../static/client_database/json/wordcloud_json/"+params_name+"词云.json"/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
            var request = new XMLHttpRequest();
            request.open("get", url);/*设置请求方法与路径*/
            request.send(null);/*不发送数据到服务器*/
            request.onload = function () {/*XHR对象获取到返回信息后执行*/
                if (request.status == 200) {/*返回状态为200，即为数据获取成功*/

                    //console.log(xhr.responseText);
                // 成功返回，xhr.responseText格式为json文件，需要parse解析
                var word_cloud_data = JSON.parse(request.responseText).result;
                //console.log(word_cloud_data);
                var dom1 = document.getElementById("word_cloud_container");
                console.log(word_cloud_data);
                console.log(dom1);
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
                        shape: 'diamond',
                        width: 2000,
                        height: 2000,
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
            }
    }