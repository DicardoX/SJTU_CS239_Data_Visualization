var div_province_3D = document.querySelector('#province_3D') //3D整体div的ID

// 测试按钮，等待后续更改
var div_province_3D_button = document.createElement("input");
div_province_3D_button.setAttribute("type", "submit");
div_province_3D_button.setAttribute("value", "Province 3D");
var state_province_3D_button = 0;
function upd_province_3D_button(state) {
    if (state == 0) return 1;
    else return 0;
}
div_province_3D_button.addEventListener('click', draw_province_3D_click_test);

// 绘图区域
var div_province_3D_draw = document.createElement("div");
div_province_3D_draw.setAttribute("id", "province_3D_draw");
// 设置宽高，这个操作是必须的。后期如何获取父类，或者我们自己定义一个？
div_province_3D_draw.setAttribute("style", "width:800px;height:900px;");

div_province_3D.appendChild(div_province_3D_button);
div_province_3D.appendChild(div_province_3D_draw);

function draw_province_3D_click_test() {
    // alert('click');
    if (state_province_3D_button == 0) {
        draw_province_3D();
    } else {
        div_province_3D_draw.innerHTML = ""
        div_province_3D_draw.setAttribute("_echarts_instance_", "");
    }
    state_province_3D_button = upd_province_3D_button(state_province_3D_button);
}

function draw_province_3D() {
    // 710000是台湾省（狗头）
    var uploadedDataURL2 = "../static/data/dataset/130000.json"; //接口
    var uploadedDataURL = uploadedDataURL2;

    let cart = document.querySelector('#province_3D_draw') //绘图div的ID，参见绘图区域部分
    let myChart = echarts.init(cart);
    // 接口
    var center = {
        // "高雄市": [120.58, 22.97],
        "太原市":[112.34,37.97],

        "石家庄市": [144.41, 38.14],
        "保定市": [115.17, 39.02],
        "唐山市":[118.36,39.74]
        // "开封市": [114.341447, 34.797049],
        // "洛阳市": [112.434468, 34.663041],
        // "平顶山市": [113.307718, 33.735241]
    }
    var center2 = center
    // 接口
    var data = [
        { name: '太原市', value: (Math.random() * 200 + 1000).toFixed(0) },
        { name: '石家庄市', value: (Math.random() * 200 + 1000).toFixed(0) },
        { name: '保定市', value: (Math.random() * 200 + 1000).toFixed(0) },
        { name: '唐山市', value: (Math.random() * 200 + 1000).toFixed(0) },

        // { name: '洛阳市', value: (Math.random() * 200 + 1000).toFixed(0) },
        // { name: '平顶山市', value: (Math.random() * 200 + 1000).toFixed(0) },
    ]
    var lineData = data.map(item => {
        return {
            coords: [
                center[item.name],
                [center[item.name][0], center[item.name][1] + item.value * 0.0001]
            ]
        }
    })
    var scatterData = data.map(item => {
        return [center[item.name][0], center[item.name][1] + item.value * 0.0001]
    })
    var scatterData2 = data.map(item => {
        return center[item.name]
    })

    var scatterData3 = data.map(item => {
        return center2[item.name].concat(item.name)
    })
    // 设置底部模块
    $.get(uploadedDataURL2, function (json) {
        echarts.registerMap('js2', json);
    })
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
                    offset: 0, color: '#0D2468' // 0% 处的颜色
                }, {
                    offset: 1, color: '#09134A' // 100% 处的颜色
                }],
                global: false // 缺省为 false
            },
            tooltip: {
                trigger: 'item',
                show: true,
                formatter: function (data) {
                    console.log(data);
                    let name = `<div class="tip-box">
                            <p>区域：${data.value[data.value.length - 1]}</p>
                            <p>X：${data.value[0]}</p>
                            <p>Y：${data.value[1]}</p>
                            </div>`;
                    return name;
                }
            },
            geo: [{
                map: 'js',//最上面模块配置
                aspectScale: 0.9,
                roam: false, //是否允许缩放
                layoutSize: '95%',
                layoutCenter: ['50%', '50%'],
                itemStyle: {//默认颜色边框等
                    areaColor: '#183890',
                    borderColor: '#2EA7E0',
                    borderWidth: 2,
                },
                emphasis: {
                    itemStyle: {
                        areaColor: '#033376'
                    },
                    label: {
                        show: 0,
                        color: '#B7E3FF'
                    }
                },
                zlevel: 3,

            },
            {
                map: 'js2',
                aspectScale: 0.9,
                roam: false, //是否允许缩放
                //zoom: 1.1, //默认显示级别
                layoutSize: '95%',
                layoutCenter: ['50%', '52%'],
                itemStyle: {
                    areaColor: '#0D2468',
                    borderColor: '#329BF5',
                    borderWidth: 1,
                },
                zlevel: 1,
                silent: true,
            },
            ],
            series: [
                {
                    type: 'lines',//圆柱体
                    zlevel: 5,
                    effect: {
                        show: false,
                        period: 4, //箭头指向速度，值越小速度越快
                        trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                        symbol: 'arrow', //箭头图标
                        symbolSize: 5, //图标大小
                    },
                    lineStyle: {
                        width: 8, //尾迹线条宽度
                        color:
                        {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1.5,
                            colorStops: [{
                                offset: 0.3, color: '#BAA752' // 100% 处的颜色
                            }, {
                                offset: 0.7, color: '#fff' // 0% 处的颜色
                            },],
                            global: false // 缺省为 false
                        },
                        // opacity: 1, //尾迹线条透明度
                        // curveness: 0 //尾迹线条曲直度
                    },
                    label: {
                        show: 0,
                        position: 'end',
                        formatter: '245'
                    },
                    silent: true,
                    data: lineData
                },
                {
                    type: 'scatter',//圆柱体顶部
                    coordinateSystem: 'geo',
                    geoIndex: 0,
                    zlevel: 5,
                    label: {
                        show: !0,
                        position: 'right',
                        formatter: params => data[params.dataIndex].value,
                        padding: [4, 8],
                        backgroundColor: '#003F5E',
                        borderRadius: 5,
                        borderColor: '#67F0EF',
                        borderWidth: 1,
                        color: '#67F0EF'
                    },
                    symbol: 'circle',
                    symbolSize: [8, 4],//柱子上面圆的宽高
                    itemStyle: {
                        color: '#BAA752',
                        opacity: 0.6
                    },
                    silent: true,
                    data: scatterData
                },
                {
                    type: 'effectScatter',//光标，标注点文字显示配置
                    coordinateSystem: 'geo',
                    geoIndex: 0,
                    symbol: 'circle',
                    symbolSize: 4,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'fill',
                        scale: 10
                    },
                    hoverAnimation: true,
                    label: {//文字
                        formatter: p => p.data[2],
                        position: 'right',
                        color: '#B7E3FF',
                        fontSize: 14,
                        distance: 10,
                        show: !0,
                    },
                    itemStyle: {//光标点
                        color: '#FEF134',
                    },
                    zlevel: 6,
                    data: scatterData3
                }
            ]
        };

        myChart.setOption(option);
    });

    myChart.on("click", function (e) {
        //防止重复点击
        if (this.name == e.name) {
            return false;
        }
        option.series[0].data[0].name = e.name;
        myChart.setOption(option);
        console.log(e.name)
        this.name = e.name;
    })
}
