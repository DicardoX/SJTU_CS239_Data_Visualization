var province = ['福建', '江苏', '浙江', '安徽', '广东', '北京', '山东', '上海', '辽宁',
    '四川', '河北', '河南', '湖南', '山西', '江西', '内蒙古', '湖北', '广西', '重庆', '天津',
    '陕西', '贵州', '宁夏', '云南', '吉林', '青海', '新疆', '黑龙江', '甘肃',
    '西藏', '海南'];
var data = [42, 41, 37, 33, 24, 23, 19,
    18, 13, 13, 10, 8, 8, 7, 7, 6, 6, 5,
    5, 4, 4, 4, 3, 3, 3, 2,
    2, 2, 2, 0, 0];

var res = [];
for (var j = 0; j < data.length; j++) {
    res.push({
        name: province[j],
        value: data[j] / 50
    });
}
res.sort(function (a, b) {
    return a.value - b.value;
});
var geoCoordMap = {
    '三亚市': [109.47, 18.42],
    '海口市': [110.39, 19.84],
    '北海市': [109.37, 21.67],
    '珠海市': [113.32, 22.09],
    '南宁市': [108.48, 23.05],
    '深圳市': [114.14, 22.67],
    '广州市': [113.54, 23.36],
    '高雄市': [120.58, 22.97],
    '台南市': [120.33, 23.13],
    '昆明市': [102.88, 25.4],
    '桂林市': [110.53, 25.35],
    '厦门市': [118.14, 24.66],
    '泉州市': [118.25, 25.21],
    '安顺市': [105.97, 26.0],
    '桃园市': [121.24, 24.96],
    '丽江市': [100.55, 26.96],
    '台北市': [121.53, 25.09],
    '贵阳市': [106.71, 26.84],
    '福州市': [119.2, 26.08],
    '遵义市': [107.09, 28.17],
    '宜宾市': [104.62, 28.56],
    '林芝市': [95.26, 29.19],
    '长沙市': [113.15, 28.23],
    '重庆市': [107.88, 30.06],
    '温州市': [120.42, 27.91],
    '乐山市': [103.59, 29.23],
    '岳阳市': [113.27, 29.08],
    '南昌市': [116.03, 28.66],
    '张家界市': [110.53, 29.38],
    '九江市': [115.44, 29.31],
    '景德镇市': [117.25, 29.27],
    '荆州市': [112.51, 30.01],
    '杭州市': [119.47, 29.91],
    '拉萨市': [91.1, 30.04],
    '成都市': [103.95, 30.64],
    '宜昌市': [111.14, 30.74],
    '黄山市': [118.09, 29.87],
    '宁波市': [121.5, 29.71],
    '武汉市': [114.36, 30.62],
    '绵阳市': [104.75, 31.84],
    '舟山市': [122.25, 30.08],
    '襄阳市': [111.96, 31.92],
    '芜湖市': [118.18, 31.18],
    '合肥市': [117.38, 31.78],
    '苏州市': [120.66, 31.37],
    '上海市': [121.42, 31.17],
    '南京市': [118.88, 31.93],
    '扬州市': [119.5, 32.72],
    '西安市': [108.79, 34.12],
    '洛阳市': [112.05, 34.29],
    '天水市': [105.75, 34.65],
    '咸阳市': [108.36, 34.79],
    '徐州市': [117.5, 34.38],
    '郑州市': [113.46, 34.63],
    '开封市': [114.51, 34.59],
    '延安市': [109.32, 36.44],
    '海东市': [102.31, 36.37],
    '兰州市': [103.67, 36.35],
    '临汾市': [111.41, 36.22],
    '中卫市': [105.51, 37.02],
    '西宁市': [101.43, 36.85],
    '青岛市': [120.17, 36.47],
    '吴忠市': [106.58, 37.44],
    '济南市': [117.25, 36.64],
    '烟台市': [120.81, 37.26],
    '银川市': [106.34, 38.29],
    '鄂尔多斯市': [108.63, 39.41],
    '太原市': [112.34, 37.97],
    '石家庄市': [114.41, 38.14],
    '威海市': [122.01, 37.14],
    '保定市': [115.17, 39.02],
    '天津市': [117.33, 39.33],
    '大同市': [113.75, 39.91],
    '唐山市': [118.36, 39.74],
    '大连市': [122.24, 39.6],
    '呼和浩特市': [111.51, 40.59],
    '北京市': [116.4, 40.17],
    '包头市': [110.29, 41.54],
    '承德市': [117.58, 41.35],
    '哈密市': [93.53, 43.03],
    '吐鲁番市': [89.86, 42.38],
    '沈阳市': [123.16, 42.08],
    '铁岭市': [124.16, 42.66],
    '乌鲁木齐市': [87.82, 43.75],
    '四平市': [124.38, 43.48],
    '吉林市': [126.89, 43.58],
    '长春市': [125.62, 44.27],
    '哈尔滨市': [127.98, 45.64],
    '大庆市': [124.69, 46.33],
    '齐齐哈尔市': [124.59, 47.72]
};
//initiate city data 
var city_data_test = [{ 'name': '三亚市', 'value': 240 }, { 'name': '海口市', 'value': 130 }, { 'name': '北海市', 'value': 240 }, { 'name': '珠海市', 'value': 110 }, { 'name': '南宁市', 'value': 240 }, { 'name': '深圳市', 'value': 60 }, { 'name': '广州市', 'value': 190 }, { 'name': '高雄市', 'value': 110 }, { 'name': '台南市', 'value': 90 }, { 'name': '昆明市', 'value': 70 }, { 'name': '桂林市', 'value': 250 }, { 'name': '厦门市', 'value': 110 }, { 'name': '泉州市', 'value': 50 }, { 'name': '安顺市', 'value': 100 }, { 'name': '桃园市', 'value': 130 }, { 'name': '丽江市', 'value': 150 }, { 'name': '台北市', 'value': 250 }, { 'name': '贵阳市', 'value': 190 }, { 'name': '福州市', 'value': 220 }, { 'name': '遵义市', 'value': 210 }, { 'name': '宜宾市', 'value': 110 }, { 'name': '林芝市', 'value': 140 }, { 'name': '长沙市', 'value': 100 }, { 'name': '重庆市', 'value': 200 }, { 'name': '温州市', 'value': 70 }, { 'name': '乐山市', 'value': 180 }, { 'name': '岳阳市', 'value': 170 }, { 'name': '南昌市', 'value': 90 }, { 'name': '张家界市', 'value': 50 }, { 'name': '九江市', 'value': 210 }, { 'name': '景德镇市', 'value': 250 }, { 'name': '荆州市', 'value': 90 }, { 'name': '杭州市', 'value': 250 }, { 'name': '拉萨市', 'value': 50 }, { 'name': '成都市', 'value': 130 }, { 'name': '宜昌市', 'value': 60 }, { 'name': '黄山市', 'value': 190 }, { 'name': '宁波市', 'value': 120 }, { 'name': '武汉市', 'value': 220 }, { 'name': '绵阳市', 'value': 250 }, { 'name': '舟山市', 'value': 250 }, { 'name': '襄阳市', 'value': 240 }, { 'name': '芜湖市', 'value': 110 }, { 'name': '合肥市', 'value': 220 }, { 'name': '苏州市', 'value': 160 }, { 'name': '上海市', 'value': 220 }, { 'name': '南京市', 'value': 140 }, { 'name': '扬州市', 'value': 180 }, { 'name': '西安市', 'value': 180 }, { 'name': '洛阳市', 'value': 210 }, { 'name': '天水市', 'value': 90 }, { 'name': '咸阳市', 'value': 200 }, { 'name': '徐州市', 'value': 120 }, { 'name': '郑州市', 'value': 130 }, { 'name': '开封市', 'value': 180 }, { 'name': '延安市', 'value': 50 }, { 'name': '海东市', 'value': 160 }, { 'name': '兰州市', 'value': 100 }, { 'name': '临汾市', 'value': 90 }, { 'name': '中卫市', 'value': 70 }, { 'name': '西宁市', 'value': 230 }, { 'name': '青岛市', 'value': 100 }, { 'name': '吴忠市', 'value': 60 }, { 'name': '济南市', 'value': 50 }, { 'name': '烟台市', 'value': 180 }, { 'name': '银川市', 'value': 230 }, { 'name': '鄂尔多斯市', 'value': 170 }, { 'name': '太原市', 'value': 70 }, { 'name': '石家庄市', 'value': 100 }, { 'name': '威海市', 'value': 50 }, { 'name': '保定市', 'value': 240 }, { 'name': '天津市', 'value': 160 }, { 'name': '大同市', 'value': 120 }, { 'name': '唐山市', 'value': 50 }, { 'name': '大连市', 'value': 140 }, { 'name': '呼和浩特市', 'value': 220 }, { 'name': '北京市', 'value': 200 }, { 'name': '包头市', 'value': 140 }, { 'name': '承德市', 'value': 250 }, { 'name': '哈密市', 'value': 160 }, { 'name': '吐鲁番市', 'value': 240 }, { 'name': '沈阳市', 'value': 170 }, { 'name': '铁岭市', 'value': 90 }, { 'name': '乌鲁木齐市', 'value': 240 }, { 'name': '四平市', 'value': 100 }, { 'name': '吉林市', 'value': 210 }, { 'name': '长春市', 'value': 130 }, { 'name': '哈尔滨市', 'value': 90 }, { 'name': '大庆市', 'value': 250 }, { 'name': '齐齐哈尔市', 'value': 170 }]
function cityData(city_data_test) {
    //update data according to month
    var res = [
        {
            data: convertData(city_data_test)
        },
        {
            data: convertData(city_data_test.sort(function (a, b) {
                return b.value - a.value;
            }).slice(0, 6))
        }
    ];
    return res;
}
function convertData(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i]['name']];
        if (geoCoord) {
            res.push(
                {
                    name: data[i]['name'],
                    value: geoCoord.concat(data[i]['value'])
                }

                // geoCoord.concat(data[i].value)
            );
        }
    }
    return res;
};

window.setInterval("getDateTest()", 1000);
var last_date = "2013-01-00";
var date = "2013-01-00";
var last_datatype = "";
var datatype = "";
function getDate() {
    last_date = date;
    date = document.getElementById("meeting").value;
    if (last_date != date) {
        console.log(date);
        var xhr = new XMLHttpRequest();
        // true，即异步执行，如果为false，则会阻塞直到数据返回
        xhr.open("POST", "/date", true);

        // 设置请求头
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("kbn-version", "5.3.0");

        // 向后端 (app.py) 发送请求，封装成json文件发送
        xhr.send(JSON.stringify({
            // 这里是使用DOM接口获取html中定义的<p>元素的内容，其中[0]表示第一个出现的<p>标签 (Tag)，再将数据用json文件的方式传输给后端
            "date": date,
            "type": datatype
        }));

        // 获取后端 (app.py) 的响应
        xhr.onreadystatechange = function () {
            // this指代的是前面定义的XMLHttpRequest对象xhr，这两个状态信息代表成功返回，为XMLHttpRequest类的成员
            if (this.readyState == 4 && this.status == 200) {
                result = JSON.parse(xhr.responseText).result;
                // numnow = result["numnow"];
                // numpre = result["numpre"];
                province_data = result["province"];
                city_data = result["city"];

                provinceChart(province_data);
                cityChart(city_data);
            }
        }
    }
}

function getDateTest() {
    last_date = date;
    date = document.getElementById("meeting").value;
    last_datatype = datatype;
    datatype = document.getElementById("datatype").value;
    if (last_date != date || last_datatype != datatype) {
        console.log(date);
        console.log(datatype);
        console.log(res);
        console.log(convertData(city_data_test));
        provinceChart(res);
        cityChart(cityData(city_data_test));

    }
}









function provinceChart(province_data) {
    var mycharts = echarts.init(document.getElementById('provinceContainer'))
    var option = {

        dataRange: {
            x: 'left',
            y: 'center',
            splitList: [
                { start: 0.8, label: '80%以上', color: '#FF6699' },
                { start: 0.6, end: 0.8, label: '60-80%', color: '#CC3300' },
                { start: 0.4, end: 0.6, label: '40-60%', color: '#F7BB37' },
                { start: 0.3, end: 0.4, label: '30-40%', color: '#3BAE56' },
                { start: 0.2, end: 0.3, label: '20-30%', color: '#92D050' },
                { start: 0.1, end: 0.2, label: '10-20%', color: '#3899FF' },
                { start: 0, end: 0.1, label: '0-10%', color: '#BFBFBF' }
            ],
            textStyle: {
                color: '#3899FF' // 值域文字颜色
            },
            selectedMode: false,
            color: ['#E0022B', '#E09107', '#A3E00B']
        },

        series: [{

            type: 'map',
            mapType: 'china',
            mapLocation: {
                x: 'left'
            },
            itemStyle: {
                normal: {
                    label: { show: true }
                },
                emphasis: { label: { show: true } }
            },
            data: province_data


        }]


    };

    mycharts.setOption(option);
}
function cityChart(city_data) {
    console.log(city_data[0]["data"]);
    console.log(city_data[1]["data"]);
    var mycharts = echarts.init(document.getElementById('cityInProvinceContainer'))
    var option = {

        title: {
            text: '全国主要城市空气质量 - 百度地图',
            subtext: 'data from PM25.in',
            sublink: 'http://www.pm25.in',
            left: 'center'
        },
        tooltip : {
            trigger: 'item'
        },
        bmap: {
            center: [104.114129, 37.550339],
            zoom: 5,
            roam: true,
            mapStyle: {
                styleJson: [{
                    'featureType': 'water',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'land',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#f3f3f3'
                    }
                }, {
                    'featureType': 'railway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'highway',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#fdfdfd'
                    }
                }, {
                    'featureType': 'highway',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#fefefe'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'geometry.fill',
                    'stylers': {
                        'color': '#fefefe'
                    }
                }, {
                    'featureType': 'poi',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'green',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'subway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'manmade',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'local',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'boundary',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#fefefe'
                    }
                }, {
                    'featureType': 'building',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'label',
                    'elementType': 'labels.text.fill',
                    'stylers': {
                        'color': '#999999'
                    }
                }]
            }
        },
        series : [
            {
                name: 'pm2.5',
                type: 'scatter',
                coordinateSystem: 'bmap',
                data: city_data[0]["data"],
                symbolSize: function (val) {
                    return val[2] / 20;
                },
                encode: {
                    value: 2
                },
                label: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                emphasis: {
                    label: {
                        show: true
                    }
                }
            },
            {
                name: 'Top 5',
                type: 'effectScatter',
                coordinateSystem: 'bmap',
                data: city_data[1]["data"],
                symbolSize: function (val) {
                    return val[2] / 20;
                },
                encode: {
                    value: 2
                },
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                },
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                },
                zlevel: 1
            }
        ]


    };

    mycharts.setOption(option);
}


