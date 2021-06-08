// main_map.js

let observed_city_name = ["上海", "上海市",
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
                      "台北", "台北市", "高雄", "高雄市", "桃园", "桃园市", "台南", "台南市", "花莲", "花莲市"];

let word_cloud_city_name = ["上海"];

let geoCoordMap = {
    '三亚': [109.47, 18.42],
    '海口': [110.39, 19.84],
    '北海': [109.37, 21.67],
    '珠海': [113.32, 22.09],
    '南宁': [108.48, 23.05],
    '深圳': [114.14, 22.67],
    '广州': [113.54, 23.36],
    '高雄': [120.58, 22.97],
    '台南': [120.33, 23.13],
    '昆明': [102.88, 25.4],
    '桂林': [110.53, 25.35],
    '厦门': [118.14, 24.66],
    '泉州': [118.25, 25.21],
    '安顺': [105.97, 26.0],
    '桃园': [121.24, 24.96],
    '丽江': [100.55, 26.96],
    '台北': [121.53, 25.09],
    '贵阳': [106.71, 26.84],
    '福州': [119.2, 26.08],
    '遵义': [107.09, 28.17],
    '宜宾': [104.62, 28.56],
    '林芝': [95.26, 29.19],
    '长沙': [113.15, 28.23],
    '重庆': [107.88, 30.06],
    '温州': [120.42, 27.91],
    '乐山': [103.59, 29.23],
    '岳阳': [113.27, 29.08],
    '南昌': [116.03, 28.66],
    '张家界': [110.53, 29.38],
    '九江': [115.44, 29.31],
    '景德镇': [117.25, 29.27],
    '荆州': [112.51, 30.01],
    '杭州': [119.47, 29.91],
    '拉萨': [91.1, 30.04],
    '成都': [103.95, 30.64],
    '宜昌': [111.14, 30.74],
    '黄山': [118.09, 29.87],
    '宁波': [121.5, 29.71],
    '武汉': [114.36, 30.62],
    '绵阳': [104.75, 31.84],
    '舟山': [122.25, 30.08],
    '襄阳': [111.96, 31.92],
    '芜湖': [118.18, 31.18],
    '合肥': [117.38, 31.78],
    '苏州': [120.66, 31.37],
    '上海': [121.42, 31.17],
    '南京': [118.88, 31.93],
    '扬州': [119.5, 32.72],
    '西安': [108.79, 34.12],
    '洛阳': [112.05, 34.29],
    '天水': [105.75, 34.65],
    '咸阳': [108.36, 34.79],
    '徐州': [117.5, 34.38],
    '郑州': [113.46, 34.63],
    '开封': [114.51, 34.59],
    '延安': [109.32, 36.44],
    '海东': [102.31, 36.37],
    '兰州': [103.67, 36.35],
    '临汾': [111.41, 36.22],
    '中卫': [105.51, 37.02],
    '西宁': [101.43, 36.85],
    '青岛': [120.17, 36.47],
    '吴忠': [106.58, 37.44],
    '济南': [117.25, 36.64],
    '烟台': [120.81, 37.26],
    '银川': [106.34, 38.29],
    '鄂尔多斯': [108.63, 39.41],
    '太原': [112.34, 37.97],
    '石家庄': [114.41, 38.14],
    '威海': [122.01, 37.14],
    '保定': [115.17, 39.02],
    '天津': [117.33, 39.33],
    '大同': [113.75, 39.91],
    '唐山': [118.36, 39.74],
    '大连': [122.24, 39.6],
    '呼和浩特': [111.51, 40.59],
    '北京': [116.4, 40.17],
    '包头': [110.29, 41.54],
    '承德': [117.58, 41.35],
    '哈密': [93.53, 43.03],
    '吐鲁番': [89.86, 42.38],
    '沈阳': [123.16, 42.08],
    '铁岭': [124.16, 42.66],
    '乌鲁木齐': [87.82, 43.75],
    '四平': [124.38, 43.48],
    '吉林': [126.89, 43.58],
    '长春': [125.62, 44.27],
    '哈尔滨': [127.98, 45.64],
    '大庆': [124.69, 46.33],
    '齐齐哈尔': [124.59, 47.72]
};


// Update info in main map
function update_main_map(date) {
    let HEData = [];
    let MIData = [];
    let LIData = [];

    // console.log("Updated!");
    // 生成请求对象
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/server_update_main_map", true);
    // 设置请求头
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");

    // 发送请求（空白）
    xhr.send(JSON.stringify({
        "MainMapRequest": 1,
        "Date": date,
    }))

    // 获取响应
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // 全部城市当天的AQI数据
            let response = JSON.parse(xhr.responseText)
            // 访问Object内的元素
            for(let key in response) {
                // 设置三类污染程度的集合：0～100，101～200，大于201
                // Level 1
                if(response[key] < 101) {
                    LIData.push([{name: key, value: response[key]}])
                }
                // Level 2
                if(response[key] >= 101 && response[key] < 201) {
                    MIData.push([{name: key, value: response[key]}])
                }
                // Level 3
                if(response[key] >= 201) {
                    HEData.push([{name: key, value: response[key]}])
                }
            }

            plot_main_map(LIData, MIData, HEData)
        }
    }
}
//对数据映射到minv到maxv
function normalize(arr,minv,maxv) {
    var maxval = 0;
    var minval = 100000;
    rearr = [];
    for (var i = 0;i < arr.length;i++) {
        if (arr[i][0].value < minval) minval = arr[i][0].value;
        if (arr[i][0].value > maxval) maxval = arr[i][0].value;
    }
    for (var i = 0;i < arr.length;i++) {
        rearr.push([{'name':arr[i][0].name,'value':parseInt((arr[i][0].value-minval)/(maxval-minval)*(maxv-minv)+minv)}])
    }
    return rearr;
}


function plot_main_map(LIData, MIData, HEData) {
    let planePath = '';

    // console.log(LIData);

    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem[0].name];
            var toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
                res.push([{
                    coord: fromCoord
                }, {
                    coord: toCoord
                }]);
            }
        }
        return res;
    };

    var color = ['#3ed4ff', '#ffa022', '#a6c84c'];
    var threshold = 80;
    var allseries = [];
    [
        ['重度严重污染', normalize(HEData,20,120)],
        ['轻度中度污染', normalize(MIData,20,120)],
        ['优良', normalize(LIData,20,120)]
    ].forEach(function (item, i) {
        allseries.push({
            name: item[0],
            type: 'lines',
            zlevel: 1,
            effect: {
                show: false,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
            },
            lineStyle: {
                normal: {
                    color: color[i],
                    width: 0,
                    curveness: 0.2
                }
            },

            // data: convertData(item[1])
        }, {
            name: item[0],
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
                brushType: 'stroke'
            },
            label: {
                normal: {
                    show: false,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            symbolSize: function (val) {
                return val[2] / 8;
            },
            itemStyle: {
                normal: {
                    color: color[i]
                }
            },
            data: item[1].map(function (dataItem) {
                return {
                    name: dataItem[0].name,
                    value: geoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                };
            })
        });
    });

    var series = [];
    [
        ['重度严重污染', normalize(HEData,20,120)],
        ['轻度中度污染', normalize(MIData,20,120)],
        ['优良', normalize(LIData,20,120)]
    ].forEach(function (item, i) {
        series.push({
            name: item[0],
            type: 'lines',
            zlevel: 1,
            effect: {
                show: false,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
            },
            lineStyle: {
                normal: {
                    color: color[i],
                    width: 0,
                    curveness: 0.2
                }
            },

            // data: convertData(item[1])
        }, {
            name: item[0],
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
                brushType: 'stroke'
            },
            label: {
                normal: {
                    show: false,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            symbolSize: function (val) {
                return val[2] / 8;
            },
            itemStyle: {
                normal: {
                    color: color[i]
                }
            },
            data: item[1].map(function (dataItem) {
            var tmpval;
            if (dataItem[0].value < threshold) {
                tmpval = 0;
            }
            else {
                tmpval = dataItem[0].value;
            }
            return {
                name: dataItem[0].name,
                value: geoCoordMap[dataItem[0].name].concat([tmpval])
            };
        })
        });
    });

    let option = {
        backgroundColor: '#080a20',
        title: {
            left: 'left',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
        trigger: 'item',
        "formatter": (p)=>{
            let condata = p.data;
            if(typeof(condata) === "undefined") {
                return "";
            }
            // console.log(condata);
            return condata.name + ":" + condata.value[2];

        }
        },
        legend: {
            type: 'plain',
            icon: 'square',//正方形图例
            data:['重度严重污染','轻度中度污染','优良'],
            align: 'left',//图例在文字左边
            left: 10,//距离左边
            top:10,//距离上边
            orient:'vertical',//垂直分布
            textStyle:{
                color:'#ffffff'
            }
        },
        geo: {
            map: 'china',
            scaleLimit: {
                min: 1.1,
                max: 5.0,
            },
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#142957',
                    borderColor: '#0692a4'
                },
                emphasis: {
                    areaColor: '#0b1c2d'
                }
            },
            zoom:1.2
        },
        series: series
    };

    var myecharts = echarts.init($('.geo')[0]);
    myecharts.setOption(option);

    // If clicked in the main map
    myecharts.on('click', function (params) {
        // Obtain params name
        let params_name = params.name;

        // Set news
        set_news(params_name);
        if(params_name in word_cloud_city_name) {
            set_word_cloud(params_name);
        }
        // If in observed city name
        if(observed_city_name.indexOf(params_name) !== -1) {
            // console.log(params_name);

            // Update current city name
            // setTimeout(function(){
            update_global_city(params_name);
            // }, 200);


        } else {
            // Provinces or other areas
        }

    });

    // let firstzoom = 2;
    let firstzoom = option.geo.zoom;

    if(typeof(option.geo) != "undefined") {
        console.log("Not undefined!");
    }

    myecharts.on('georoam', function(params) {
        // console.log('params', params); //第一次，可以打印出params

        let {dx, dy} = params;
        if (dx || dy || (dx === 0 && dy === 0)) {
            // 如果是拖拽事件就不做处理（我目前希望在缩放事件里面做相关的处理）
            return;
        }

        if(typeof(option.geo) != "undefined") {
            firstzoom = firstzoom * params.zoom;
            option.geo.zoom = firstzoom;
            // console.log(firstzoom);

            if (firstzoom > 1.7) {
                option.series = allseries;
            }
            else {
                option.series = series;
            }
        }
        // if (zoom >= 8) {
        //     // 当缩放等级大于等于8的时候
        //     // 可以配置你需要的操作
        //     console.log('缩放等级大于等于8了');
        // }
        // else {
        //      // 当缩放等级小于8的时候
        //     // 可以配置你需要的操作
        //     console.log('缩放等级小于8了');
        // }

        // this.chart.clear();
        myecharts.setOption(option);
    })
}
