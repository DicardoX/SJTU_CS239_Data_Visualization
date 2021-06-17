// province_3D.js

let div_province_3D = document.querySelector('#province_3D') //3D整体div的ID

// console.log(div_province_3D);

// 绘图区域
var div_province_3D_draw = document.createElement("div");
div_province_3D_draw.setAttribute("id", "province_3D_draw");
// 设置宽高，这个操作是必须的。后期如何获取父类，或者我们自己定义一个？
div_province_3D_draw.setAttribute("style", "width:18rem;height:15rem;");

// div_province_3D.appendChild(div_province_3D_button);
div_province_3D.appendChild(div_province_3D_draw);

var province_3D_data_map = [
    { province_name: "北京", file_name: "110000" },
    { province_name: "天津", file_name: "120000" },
    { province_name: "河北", file_name: "130000" },
    { province_name: "山西", file_name: "140000" },
    { province_name: "内蒙古", file_name: "150000" },//挤在一起
    { province_name: "辽宁", file_name: "210000" },
    { province_name: "吉林", file_name: "220000" },
    { province_name: "黑龙江", file_name: "230000" },//挤在一起
    { province_name: "上海", file_name: "310000" },
    { province_name: "江苏", file_name: "320000" },
    { province_name: "浙江", file_name: "330000" },
    { province_name: "安徽", file_name: "340000" },//有点挤
    { province_name: "福建", file_name: "350000" },//有点挤
    { province_name: "江西", file_name: "360000" },//最上方
    { province_name: "山东", file_name: "370000" },//有点挤
    { province_name: "河南", file_name: "410000" },
    { province_name: "湖北", file_name: "420000" },
    { province_name: "湖南", file_name: "430000" },//最上方
    { province_name: "广东", file_name: "440000" },//有点挤
    { province_name: "广西", file_name: "450000" },
    { province_name: "海南", file_name: "460000" },//特殊情况
    { province_name: "重庆", file_name: "500000" },
    { province_name: "四川", file_name: "510000" },//有点挤
    { province_name: "贵州", file_name: "520000" },
    { province_name: "云南", file_name: "530000" },
    { province_name: "西藏", file_name: "540000" },//整体显得有点小
    { province_name: "陕西", file_name: "610000" },//有点挤
    { province_name: "甘肃", file_name: "620000" },//整体显得有点小
    { province_name: "青海", file_name: "630000" },//有点挤，整体显得有点小
    { province_name: "宁夏", file_name: "640000" },//最上方
    { province_name: "新疆", file_name: "650000" },//整体显得有点小
    { province_name: "台湾", file_name: "710000" },//最上方
    { province_name: "香港", file_name: "810000" },
    { province_name: "澳门", file_name: "640000" }
];
var province_3D_prov_city_loc = [
    {
        city_name: "三亚市", province_name: "海南", pos: [109.47
            , 18.42]
    },
    {
        city_name: "海口市", province_name: "海南", pos: [110.39
            , 19.84]
    },
    {
        city_name: "北海市", province_name: "广西", pos: [109.37
            , 21.67]
    },
    {
        city_name: "珠海市", province_name: "广东", pos: [113.32
            , 22.09]
    },
    {
        city_name: "南宁市", province_name: "广西", pos: [108.48
            , 23.05]
    },
    {
        city_name: "深圳市", province_name: "广东", pos: [114.14
            , 22.67]
    },
    {
        city_name: "广州市", province_name: "广东", pos: [113.54
            , 23.36]
    },
    {
        city_name: "高雄市", province_name: "台湾", pos: [120.58
            , 22.97]
    },
    {
        city_name: "台南市", province_name: "台湾", pos: [120.33
            , 23.13]
    },
    {
        city_name: "昆明市", province_name: "云南", pos: [102.88
            , 25.4]
    },
    {
        city_name: "桂林市", province_name: "广西", pos: [110.53
            , 25.35]
    },
    {
        city_name: "厦门市", province_name: "福建", pos: [118.14
            , 24.66]
    },
    {
        city_name: "泉州市", province_name: "福建", pos: [118.25
            , 25.21]
    },
    {
        city_name: "安顺市", province_name: "贵州", pos: [105.97
            , 26]
    },
    {
        city_name: "桃园市", province_name: "台湾", pos: [121.24
            , 24.96]
    },
    {
        city_name: "丽江市", province_name: "云南", pos: [100.55
            , 26.96]
    },
    {
        city_name: "台北市", province_name: "台湾", pos: [121.53
            , 25.09]
    },
    {
        city_name: "贵阳市", province_name: "贵州", pos: [106.71
            , 26.84]
    },
    {
        city_name: "福州市", province_name: "福建", pos: [119.2
            , 26.08]
    },
    {
        city_name: "遵义市", province_name: "贵州", pos: [107.09
            , 28.17]
    },
    {
        city_name: "宜宾市", province_name: "四川", pos: [104.62
            , 28.56]
    },
    {
        city_name: "林芝市", province_name: "西藏", pos: [95.26
            , 29.19]
    },
    {
        city_name: "长沙市", province_name: "湖南", pos: [113.15
            , 28.23]
    },
    {
        city_name: "重庆市", province_name: "重庆", pos: [107.88
            , 30.06]
    },
    {
        city_name: "温州市", province_name: "浙江", pos: [120.42
            , 27.91]
    },
    {
        city_name: "乐山市", province_name: "四川", pos: [103.59
            , 29.23]
    },
    {
        city_name: "岳阳市", province_name: "湖南", pos: [113.27
            , 29.08]
    },
    {
        city_name: "南昌市", province_name: "江西", pos: [116.03
            , 28.66]
    },
    {
        city_name: "张家界市", province_name: "湖南", pos: [110.53
            , 29.38]
    },
    {
        city_name: "九江市", province_name: "江西", pos: [115.44
            , 29.31]
    },
    {
        city_name: "景德镇市", province_name: "江西", pos: [117.25
            , 29.27]
    },
    {
        city_name: "荆州市", province_name: "湖北", pos: [112.51
            , 30.01]
    },
    {
        city_name: "杭州市", province_name: "浙江", pos: [119.47
            , 29.91]
    },
    {
        city_name: "拉萨市", province_name: "西藏", pos: [91.1
            , 30.04]
    },
    {
        city_name: "成都市", province_name: "四川", pos: [103.95
            , 30.64]
    },
    {
        city_name: "宜昌市", province_name: "湖北", pos: [111.14
            , 30.74]
    },
    {
        city_name: "黄山市", province_name: "安徽", pos: [118.09
            , 29.87]
    },
    {
        city_name: "宁波市", province_name: "浙江", pos: [121.5
            , 29.71]
    },
    {
        city_name: "武汉市", province_name: "湖北", pos: [114.36
            , 30.62]
    },
    {
        city_name: "绵阳市", province_name: "四川", pos: [104.75
            , 31.84]
    },
    {
        city_name: "舟山市", province_name: "浙江", pos: [122.25
            , 30.08]
    },
    {
        city_name: "襄阳市", province_name: "湖北", pos: [111.96
            , 31.92]
    },
    {
        city_name: "芜湖市", province_name: "安徽", pos: [118.18
            , 31.18]
    },
    {
        city_name: "合肥市", province_name: "安徽", pos: [117.38
            , 31.78]
    },
    {
        city_name: "苏州市", province_name: "江苏", pos: [120.66
            , 31.37]
    },
    {
        city_name: "上海市", province_name: "上海", pos: [121.42
            , 31.17]
    },
    {
        city_name: "南京市", province_name: "江苏", pos: [118.88
            , 31.93]
    },
    {
        city_name: "扬州市", province_name: "江苏", pos: [119.5
            , 32.72]
    },
    {
        city_name: "西安市", province_name: "陕西", pos: [108.79
            , 34.12]
    },
    {
        city_name: "洛阳市", province_name: "河南", pos: [112.05
            , 34.29]
    },
    {
        city_name: "天水市", province_name: "甘肃", pos: [105.75
            , 34.65]
    },
    {
        city_name: "咸阳市", province_name: "陕西", pos: [108.36
            , 34.79]
    },
    {
        city_name: "徐州市", province_name: "江苏", pos: [117.5
            , 34.38]
    },
    {
        city_name: "郑州市", province_name: "河南", pos: [113.46
            , 34.63]
    },
    {
        city_name: "开封市", province_name: "河南", pos: [114.51
            , 34.59]
    },
    {
        city_name: "延安市", province_name: "陕西", pos: [109.32
            , 36.44]
    },
    {
        city_name: "海东市", province_name: "青海", pos: [102.31
            , 36.37]
    },
    {
        city_name: "兰州市", province_name: "甘肃", pos: [103.67
            , 36.35]
    },
    {
        city_name: "临汾市", province_name: "山西", pos: [111.41
            , 36.22]
    },
    {
        city_name: "中卫市", province_name: "宁夏", pos: [105.51
            , 37.02]
    },
    {
        city_name: "西宁市", province_name: "青海", pos: [101.43
            , 36.85]
    },
    {
        city_name: "青岛市", province_name: "山东", pos: [120.17
            , 36.47]
    },
    {
        city_name: "吴忠市", province_name: "宁夏", pos: [106.58
            , 37.44]
    },
    {
        city_name: "济南市", province_name: "山东", pos: [117.25
            , 36.64]
    },
    {
        city_name: "烟台市", province_name: "山东", pos: [120.81
            , 37.26]
    },
    {
        city_name: "银川市", province_name: "宁夏", pos: [106.34
            , 38.29]
    },
    {
        city_name: "鄂尔多斯市", province_name: "内蒙古", pos: [108.63
            , 39.41]
    },
    {
        city_name: "太原市", province_name: "山西", pos: [112.34
            , 37.97]
    },
    {
        city_name: "石家庄市", province_name: "河北", pos: [114.41
            , 38.14]
    },
    {
        city_name: "威海市", province_name: "山东", pos: [122.01
            , 37.14]
    },
    {
        city_name: "保定市", province_name: "河北", pos: [115.17
            , 39.02]
    },
    {
        city_name: "天津市", province_name: "天津", pos: [117.33
            , 39.33]
    },
    {
        city_name: "大同市", province_name: "山西", pos: [113.75
            , 39.91]
    },
    {
        city_name: "唐山市", province_name: "河北", pos: [118.36
            , 39.74]
    },
    {
        city_name: "大连市", province_name: "辽宁", pos: [122.24
            , 39.6]
    },
    {
        city_name: "呼和浩特市", province_name: "内蒙古", pos: [111.51
            , 40.59]
    },
    {
        city_name: "北京市", province_name: "北京", pos: [116.4
            , 40.17]
    },
    {
        city_name: "包头市", province_name: "内蒙古", pos: [110.29
            , 41.54]
    },
    {
        city_name: "承德市", province_name: "河北", pos: [117.58
            , 41.35]
    },
    {
        city_name: "哈密市", province_name: "新疆", pos: [93.53
            , 43.03]
    },
    {
        city_name: "吐鲁番市", province_name: "新疆", pos: [89.86
            , 42.38]
    },
    {
        city_name: "沈阳市", province_name: "辽宁", pos: [123.16
            , 42.08]
    },
    {
        city_name: "铁岭市", province_name: "辽宁", pos: [124.16
            , 42.66]
    },
    {
        city_name: "乌鲁木齐市", province_name: "新疆", pos: [87.82
            , 43.75]
    },
    {
        city_name: "四平市", province_name: "吉林", pos: [124.38
            , 43.48]
    },
    {
        city_name: "吉林市", province_name: "吉林", pos: [126.89
            , 43.58]
    },
    {
        city_name: "长春市", province_name: "吉林", pos: [125.62
            , 44.27]
    },
    {
        city_name: "哈尔滨市", province_name: "黑龙江", pos: [127.98
            , 45.64]
    },
    {
        city_name: "大庆市", province_name: "黑龙江", pos: [124.69
            , 46.33]
    },
    {
        city_name: "齐齐哈尔市", province_name: "黑龙江", pos: [124.59
            , 47.72]
    },



];
// 接口
// var threeD_type = "AQI";
// var threeD_province = "内蒙古";
function readFile() {
    let file_url = 'dataset/city_province_loc.csv';
    let xhr = new XMLHttpRequest();
    xhr.open("get", file_url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (this.status === 200) {
            console.log(this.response)
            const reader = new FileReader()
            reader.onload = function () {
                //   console.log('reader.result', reader.result)
                var innerline = reader.result.split("\n");
                var mystr = ""
                for (let i = 1; i < innerline.length - 1; ++i) {
                    var lineitem = innerline[i].split(",");
                    var tmpcontent = {};
                    var tmppos = [];
                    mystr += "{ city_name: \"" + lineitem[0] + "\", province_name: \"" + lineitem[1] + "\", pos: [" + lineitem[3] + "," + lineitem[2] + "] },\n";
                    tmpcontent["city_name"] = lineitem[0];
                    tmpcontent["province_name"] = lineitem[1];
                    tmppos.push(parseFloat(lineitem[3]));
                    tmppos.push(parseFloat(lineitem[2]));
                    tmpcontent["pos"] = tmppos;
                    province_3D_prov_city_loc.push(tmpcontent);
                }
                console.log(mystr);
            }
            reader.readAsText(this.response);
        }
    };
    xhr.send();
}


// Input area_name, output the city_name_list
function get_city_name_list(area_name) {
    // Province name
    let province_name = "";
    // City name list
    let city_name_list = [];

    // Judge province or city, get province name
    for(let i = 0; i < province_3D_prov_city_loc.length; i++) {
        if(province_3D_prov_city_loc[i].province_name === area_name) {
            // Is province
            province_name = area_name;
            break;
        }
        let new_area_name = area_name + "市";
        if(province_3D_prov_city_loc[i].city_name === new_area_name) {
            // Is city
            province_name = province_3D_prov_city_loc[i].province_name;
            break;
        }
    }

    // Get city_name list based on the province name
    if(province_name === "") {
        console.log("Error occurred when getting province name...");
        return city_name_list;
    }
    // Traverse
    for(let i = 0; i < province_3D_prov_city_loc.length; i++) {
        if(province_3D_prov_city_loc[i].province_name === province_name) {
            city_name_list.push(province_3D_prov_city_loc[i].city_name);
        }
    }
    return [city_name_list, province_name];
}


function update_province_3D(date, area_name) {
    // Get city name list based on area_name
    let [city_name_list, province_name] = get_city_name_list(area_name);

    // 生成请求对象
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/server_update_province_3D", true);
    // 设置请求头
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");
    // 发送请求（空白）
    xhr.send(JSON.stringify({
        "Province3DRequest": 1,
        "City_name_list": city_name_list,
        "Date": date,
    }))
    // 获取响应
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(xhr.responseText);

            let type_dict = {};
            // 访问Object内的元素
            for(let key in response) {
                type_dict[key] = response[key];
            }

            // 删除旧有的该模块的echarts
            let cart = document.querySelector('#province_3D_draw') //绘图div的ID，参见绘图区域部分
            let myChart = echarts.init(cart);
            myChart.clear();

            // Draw province 3D
            draw_province_3D(type_dict, province_name);
        }
    }
}


// The last two elms in type_dict are locations
function draw_province_3D(type_dict, province_name) {
    var jsonfile = "";
    for (let i = 0; i < 34; ++i) {
        // console.log(province_3D_data_map[i].province_name);
        if (province_3D_data_map[i].province_name === province_name) {
            jsonfile = province_3D_data_map[i].file_name;
            break;
        }
    }
    if (jsonfile === "") {
        alert("In province_3d.js: Invalid province name!");
        return;
    }

    let uploadedDataURL = "../static/client_database/json/province_edge_json/" + jsonfile + ".json";

    let cart = document.querySelector('#province_3D_draw') //绘图div的ID，参见绘图区域部分
    let myChart = echarts.init(cart);
    let center = {};
    let data = [];
    let data_tooltip = {};
    let initgraphcenter = [0.0, 0.0];

    for (let i = 0; i < province_3D_prov_city_loc.length; ++i) {
        if (province_3D_prov_city_loc[i].province_name === province_name) {
            let cur_city_name = province_3D_prov_city_loc[i].city_name.replace("市", "");
            center[cur_city_name] = province_3D_prov_city_loc[i].pos;
            var tmpindata = {};
            tmpindata["name"] = cur_city_name;
            tmpindata["value"] = Math.max(...type_dict[cur_city_name].slice(0, 6));
            tmpindata["all_type"] = type_dict[cur_city_name].slice(0, 6);
            data.push(tmpindata);
            // data_tooltip[cur_city_name] = tmpindata["value"];
            data_tooltip[cur_city_name] = tmpindata["all_type"];
            initgraphcenter[0] += province_3D_prov_city_loc[i].pos[0];
            initgraphcenter[1] += province_3D_prov_city_loc[i].pos[1];
        }
    }

    if (center === {}) {
        alert("error of loading center");
        return;
    }
    initgraphcenter[0] /= data.length;
    initgraphcenter[1] /= data.length;
    // console.log(initgraphcenter)
    // console.log(data)
    var data_max = parseFloat(data[0].value);
    var data_min = parseFloat(data[0].value);
    for (let i = 0; i < data.length; ++i) {
        if (data_max < parseFloat(data[i].value)) data_max = parseFloat(data[i].value);
        if (data_min > parseFloat(data[i].value)) data_min = parseFloat(data[i].value);
    }
    // console.log("data max = ", data_max);
    // console.log("data min = ", data_min);

    if (data.length === 1) {
        var lineData = data.map(item => {
            // console.log({
            //     name: item.name, 
            //     value: [center[item.name][0], center[item.name][1], 30]
            // })
            return {
                name: item.name,
                value: [center[item.name][0], center[item.name][1], 30]
            }
        })
        var scatterData = data.map(item => {
            // console.log(center[item.name].concat( 30))
            return center[item.name].concat(30)
        })

    // console.log("3 here\n")
    var scatterData3 = data.map(item => {
        // console.log((center[item.name].concat(0)).concat(item.name))
        return (center[item.name].concat(15)).concat(item.name)
    })
    } else {
        // console.log("Linedata here\n")
        var lineData = data.map(item => {
            // console.log({
            //     name: item.name, 
            //     value: [center[item.name][0], center[item.name][1], (((item.value - data_min) / (data_max - data_min) * 20) + 20)]
            // })
            return {
                name: item.name,
                value: [center[item.name][0], center[item.name][1], (((item.value - data_min) / (data_max - data_min) * 30) + 20)]
            }
        })
        // console.log("scatterData here\n")
        var scatterData = data.map(item => {
            // console.log(center[item.name].concat( (((item.value - data_min) / (data_max - data_min) * 20) + 20)))
            return center[item.name].concat((((item.value - data_min) / (data_max - data_min) * 30) + 20))
        });

    // console.log("3 here\n")
    var scatterData3 = data.map(item => {
        // console.log((center[item.name].concat(0)).concat(item.name))
        return (center[item.name].concat((((item.value - data_min) / (data_max - data_min) * 30) + 20)/2)).concat(item.name)
    })
    }
    var scatterData_basic = data.map(item => {
        // console.log((center[item.name].concat(0)).concat(item.name))
        return (center[item.name].concat(3)).concat(item.name)
    })

    console.log("Begin draw 3D province...");

    let option = {}
    $.get(uploadedDataURL, function (json) {
        echarts.registerMap('js', json);
        option = {
            // backgroundColor: '#333',
            backgroundColor: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#101129' // 0% 处的颜色
                }, {
                    offset: 1, color: '#09134A' // 100% 处的颜色
                }],
                global: false // 缺省为 false
            },
            visualMap: [{
                type: 'continuous',
                show: false,
                seriesIndex: 0,
                text: ['bar3D'],
                calculable: true,
                max: 300,
                inRange: {
                    color: ['#87aa66', '#eba438', '#d94d4c']
                }
            }],
            tooltip: {
                trigger: 'item',
                show: true,
                formatter: function (data) {
                    // console.log(data);
                    // Modify the tag

                    console.log(data);

                    let name = `<div class="tip-box">
                            <p>区域：${data.value[data.value.length - 1]}</p>
                            <p>${"PM2.5"}：${data_tooltip[data.value[data.value.length - 1]][0]}</p>
                            <p>${"PM10"}：${data_tooltip[data.value[data.value.length - 1]][1]}</p>
                            <p>${"SO2"}：${data_tooltip[data.value[data.value.length - 1]][2]}</p>
                            <p>${"NO2"}：${data_tooltip[data.value[data.value.length - 1]][3]}</p>
                            <p>${"CO"}：${data_tooltip[data.value[data.value.length - 1]][4]}</p>
                            <p>${"O3"}：${data_tooltip[data.value[data.value.length - 1]][5]}</p>
                            </div>`;
                    return name;
                }
            },
            geo3D: [{
                map: 'js',//最上面模块配置
                aspectScale: 0.9,
                roam: true, //是否允许缩放
                viewControl: {
                    minBeta: 0,
                    maxBeta: 359,
                    maxDistance: 150
                },
                // center: initgraphcenter,
                layoutSize: '80%',
                layoutCenter: ['50%', '50%'],
                itemStyle: {//默认颜色边框等
                    color: 'rgb(20,41,87)',
                    borderColor: '#2EA7E0',
                    borderWidth: 2,
                },
                emphasis: {
                    itemStyle: {
                        color: 'rgb(20,41,87)',
                    },
                    label: {
                        show: 0,
                        color: '#B7E3FF'
                    },
                },
                light: {
                    main: {
                        color: '#fff', //光照颜色
                        intensity: 1.2, //光照强度
                        shadowQuality: 'high', //阴影亮度
                        shadow: false, //是否显示阴影
                        //                        alpha: 55,
                        beta: 40
                    },
                    ambient: {
                        intensity: 0.3
                    }
                }
                // zlevel: 3,
            },
            ],
            series: [
                {
                    name: 'bar3D',
                    type: "bar3D",
                    coordinateSystem: 'geo3D',
                    geoIndex: 0,
                    itemStyle: {
                        color: [1, 1, 1, 1],
                        // opacity: 0.6
                    },
                    barSize: 3, //柱子粗细
                    shading: 'lambert',

                    silent: true,
                    data: lineData
                },
                {
                    type: 'scatter3D',//圆柱体顶部
                    coordinateSystem: 'geo3D',
                    geoIndex: 0,
                    // zlevel: 5,
                    label: {
                        show: !0,
                        position: 'top',
                        formatter: params => (data[params.dataIndex].value),
                        padding: [4, 8],
                        backgroundColor: '#67F0EF',
                        borderRadius: 5,
                        borderColor: '#67F0EF',
                        borderWidth: 1,
                        color: '#67F0EF',
                        textStyle:{
                            // color:"#67F0EF",
                            // borderColor: "#67F0EF"
                        },
                    },
                    symbol: 'circle',
                    symbolSize: [10, 4],//柱子上面圆的宽高
                    itemStyle: {
                        color: 'rgba(0,0,0,0)',
                        // opacity: 0.6
                    },
                    silent: true,
                    data: scatterData
                },
                {
                    type: 'scatter3D',//光标，标注点文字显示配置
                    coordinateSystem: 'geo3D',
                    geoIndex: 0,
                    symbol: 'circle',
                    symbolSize: 50,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'fill',
                        scale: 10
                    },
                    label: {//文字
                        formatter: p => p.data[3],
                        position: 'right',
                        color: '#B7E3FF',
                        fontSize: 14,
                        distance: 10,
                        show: true,
                        textStyle:{
                            // color:"#67F0EF",
                            // borderColor: "#67F0EF"
                        },
                    },
                    hoverAnimation: true,
                    itemStyle: {//光标点
                        color: 'rgba(0,0,0,0)',
                    },
                    // zlevel: 6,
                    data: scatterData3
                },
                {
                    type: 'scatter3D',//垫底用的
                    coordinateSystem: 'geo3D',
                    geoIndex: 0,
                    symbol: 'circle',
                    symbolSize: 30,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'fill',
                        scale: 10
                    },
                    label: {//文字
                        formatter: p => p.data[3],
                        position: 'right',
                        color: '#B7E3FF',
                        fontSize: 14,
                        distance: 10,
                        show: 0,
                    },
                    hoverAnimation: true,
                    itemStyle: {//光标点
                        color: 'rgba(0,0,0,0)',
                    },
                    // zlevel: 6,
                    silent: true,
                    data: scatterData_basic
                }
            ]
        };
        if (province_name === "海南") {
            option["geo3D"][0]["viewControl"]["distance"] = 130;
            option["geo3D"][0]["viewControl"]["alpha"] = 8;
            option["geo3D"][0]["viewControl"]["beta"] = 203;
            option["geo3D"][0]["light"]["main"]["beta"] = 240;
            option["geo3D"][0]["viewControl"]["maxDistance"] = 200;
        }
        // console.log(option);
        myChart.setOption(option);
    });

    myChart.on("click", function (e) {
        //防止重复点击
        if (this.name === e.name) {
            return false;
        }
        option.series[0].data[0].name = e.name;
        myChart.setOption(option);
        // console.log(e.name)
        this.name = e.name;
    })
}
