// multi_curve.js

let target_list = ["PM2_5", "PM10", "SO2", "NO2", "CO", "O3", "U", "V", "TEMP", "RH", "PSFC"]

let cur_city_name = "合肥市";
let cur_target_type = "SO2";

// Change target type
function change_curve_info(type) {
    let index = 0;
    if (type === 0) {
        index = document.getElementById("pollution_select").selectedIndex;
        cur_target_type = target_list[index - 1];
    }
    else {
        index = document.getElementById("target_select").selectedIndex;
        cur_target_type = target_list[5 + index];
    }
    // console.log(index)
    // console.log(cur_city_name, cur_target_type);
    update_predicted_curve(cur_city_name, cur_target_type);
}

// Button control
// Chosen type: 0 for analysis (by default), 1 for prediction
function button_control(chosen_type) {
    console.log("Succeed!");

    if(chosen_type === 0) {
        document.getElementById("curve_button_1").style.color = "white";
        document.getElementById("curve_button_2").style.color = "#1950c4";
        let curve_chart = echarts.init($('.bar')[0]);
        curve_chart.clear();
        plot_analysis_curve();

    }
    else {
        document.getElementById("curve_button_2").style.color = "white";
        document.getElementById("curve_button_1").style.color = "#1950c4";
        let curve_chart = echarts.init($('.bar')[0]);
        curve_chart.clear();
        update_predicted_curve(cur_city_name, cur_target_type);
    }
}

//初始化表格
function update_predicted_curve(city_name, target_type) {
    // console.log("Updated!");
    // 生成请求对象
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/server_update_predicted_curve", true);
    // 设置请求头
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");
    // 发送请求（空白）
    xhr.send(JSON.stringify({
        "PredictedCurveRequest": 1,
        "City_name": city_name,
        "Target_type": target_type
    }))
    // 获取响应
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // 检测指标未来七天的预测数据
            // 特征
            let days_data = [0, 0, 0, 0, 0, 0, 0]
            // AQI
            let AQIs = [0, 0, 0, 0, 0, 0, 0]
            // IAQI
            let IAQIs = [0, 0, 0, 0, 0, 0, 0]

            days_data[0] = JSON.parse(xhr.responseText).day1[0]
            days_data[1] = JSON.parse(xhr.responseText).day2[0]
            days_data[2] = JSON.parse(xhr.responseText).day3[0]
            days_data[3] = JSON.parse(xhr.responseText).day4[0]
            days_data[4] = JSON.parse(xhr.responseText).day5[0]
            days_data[5] = JSON.parse(xhr.responseText).day6[0]
            days_data[6] = JSON.parse(xhr.responseText).day7[0]
            // console.log(days_data)
            AQIs[0] = JSON.parse(xhr.responseText).day1[1]
            AQIs[1] = JSON.parse(xhr.responseText).day2[1]
            AQIs[2] = JSON.parse(xhr.responseText).day3[1]
            AQIs[3] = JSON.parse(xhr.responseText).day4[1]
            AQIs[4] = JSON.parse(xhr.responseText).day5[1]
            AQIs[5] = JSON.parse(xhr.responseText).day6[1]
            AQIs[6] = JSON.parse(xhr.responseText).day7[1]
            // console.log(AQIs)
            IAQIs[0] = JSON.parse(xhr.responseText).day1[2]
            IAQIs[1] = JSON.parse(xhr.responseText).day2[2]
            IAQIs[2] = JSON.parse(xhr.responseText).day3[2]
            IAQIs[3] = JSON.parse(xhr.responseText).day4[2]
            IAQIs[4] = JSON.parse(xhr.responseText).day5[2]
            IAQIs[5] = JSON.parse(xhr.responseText).day6[2]
            IAQIs[6] = JSON.parse(xhr.responseText).day7[2]
            // console.log(IAQIs)

            // 绘制预测曲线
            plot_predicted_curve(days_data, AQIs, IAQIs)
        }
    }
}

// 绘制分析曲线
function plot_analysis_curve() {
    // 中间省略的数据  准备三项
    const item = {
        name: '',
        value: 1200,
        // 柱子颜色
        itemStyle: {
            color: '#254065'
        },
        // 鼠标经过柱子颜色
        emphasis: {
            itemStyle: {
                color: '#254065'
            }
        },
        // 工具提示隐藏
        tooltip: {
            extraCssText: 'opacity:0'
        }
    };
    option = {
        // 工具提示
        tooltip: {
            // 触发类型  经过轴触发axis  经过轴触发item
            trigger: 'item',
            // 轴触发提示才有效
            axisPointer: {
                // 默认为直线，可选为：'line' 线效果 | 'shadow' 阴影效果
                type: 'shadow'
            }
        },
        // 图表边界控制
        grid: {
            // 距离 上右下左 的距离
            left: '0',
            right: '3%',
            bottom: '3%',
            top: '5%',
            // 大小是否包含文本【类似于boxsizing】
            containLabel: true,
            //显示边框
            show: true,
            //边框颜色
            borderColor: 'rgba(0, 240, 255, 0.3)'
        },
        // 控制x轴
        xAxis: [
            {
                // 使用类目，必须有data属性
                type: 'category',
                // 使用 data 中的数据设为刻度文字
                data: ['上海', '广州', '北京', '深圳', '合肥', '', '......', '', '杭州', '厦门', '济南', '成都', '重庆'],
                // 刻度设置
                axisTick: {
                    // true意思：图形在刻度中间
                    // false意思：图形在刻度之间
                    alignWithLabel: false,
                    show: false
                },
                //文字
                axisLabel: {
                    color: '#4c9bfd'
                }
            }
        ],
        // 控制y轴
        yAxis: [
            {
                // 使用数据的值设为刻度文字
                type: 'value',
                axisTick: {
                    // true意思：图形在刻度中间
                    // false意思：图形在刻度之间
                    alignWithLabel: false,
                    show: false
                },
                //文字
                axisLabel: {
                    color: '#4c9bfd'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(0, 240, 255, 0.3)'
                    }
                },
            }
        ],
        // 控制x轴
        series: [
            {
                // series配置
                // 颜色
                itemStyle: {
                    // 提供的工具函数生成渐变颜色
                    color: new echarts.graphic.LinearGradient(
                        // (x1,y2) 点到点 (x2,y2) 之间进行渐变
                        0, 0, 0, 1,
                        [
                            { offset: 0, color: '#00fffb' }, // 0 起始颜色
                            { offset: 1, color: '#0061ce' }  // 1 结束颜色
                        ]
                    )
                },
                // 图表数据名称
                name: '用户统计',
                // 图表类型
                type: 'bar',
                // 柱子宽度
                barWidth: '60%',
                // 数据
                data: [2100, 1900, 1700, 1560, 1400, item, item, item, 900, 750, 600, 480, 240]
            }
        ]
    };
    // const myechart = echarts.init($('.users .bar')[0]);
    let curve_chart = echarts.init($('.bar')[0]);                                                          // Modified
    curve_chart.setOption(option);
}

// 绘制预测曲线
function plot_predicted_curve(days_data, AQIs, IAQIs) {
    option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              width: 3,
              color: '#019688',
            },
          },
        },
        grid: {
          left: '4%',
          right: '3%',
          bottom: '3%',
          containLabel: true,
        },
        color: ['#019688', '#119AC2'],
        xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: ['2019-01-01', '2019-01-02', '2019-01-03', '2019-01-04',
                  '2019-01-05', '2019-01-06', '2019-01-07'],
                // axisLabel: {
                //   rotate: 25,
                // },
                splitLine: {
                  show: true,
                  lineStyle: {
                    width: 1,
                    type: 'solid',
                    color: 'rgba(226,226,226,0.5)',
                  },
                },
              axisLabel: { color: '#505050' },
                axisTick: { // 轴刻度线
                  show: false,
                },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: 'IAQI',
            min: 0.0,
            max: (Math.ceil(Math.max(...AQIs) / 100)) * 100,
            interval: (Math.ceil(Math.max(...AQIs) / 100)) * 20,
            axisTick: { // 轴刻度线
              show: false,
            },
            // 刻度文字颜色
            axisLabel: { color: '#808080' },
            // y轴刻度设置
            axisLine: {
              lineStyle: {
                width: 2,
                color: '#019688',
              },
            },
            // y轴分隔线设置
            splitLine: {
              lineStyle: {
                color: 'rgba(226,226,226,0.5)',
              },
            },
            // y轴分隔区域设置
            splitArea: {
              show: true,
              areaStyle: {
                color: ['rgba(250,250,250,0.3)', 'rgba(226,226,226,0.3)'],
              },
            },
          },
          {
            type: 'value',
            name: '  AQI',
            min: 0.0,
            max: (Math.ceil(Math.max(...AQIs) / 100)) * 100,
            interval: (Math.ceil(Math.max(...AQIs) / 100)) * 20,
            axisTick: { // 轴刻度线
              show: false,
            },
            axisLabel: { color: '#808080' },
            axisLine: {
              lineStyle: {
                width: 2,
                color: '#019688',
              },
            },
            // y轴分隔线设置
            splitLine: {
              lineStyle: {
                color: 'rgba(226,226,226,0.5)',
              },
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ['#101129', '#101129'],
              },
            },
          },
        ],
        series: [
          {
            name: 'IAQI',
            type: 'line',
            data: [IAQIs[0], IAQIs[1], IAQIs[2], IAQIs[3], IAQIs[4], IAQIs[5], IAQIs[6]],
            smooth: true,
            symbolSize: 6,
            areaStyle: {},
            itemStyle: {
              borderWidth: 2,
            },
          },
          {
            name: 'AQI',
            type: 'line',
            yAxisIndex: 1,
            data: [AQIs[0], AQIs[1], AQIs[2], AQIs[3], AQIs[4], AQIs[5], AQIs[6]],
            smooth: true,
            symbolSize: 6,
            areaStyle: {},
            itemStyle: {
              borderWidth: 2,
            },
          },
        ],
      };
    // const myechart = echarts.init($('.users .bar')[0]);
    let curve_chart = echarts.init($('.bar')[0]);                                                            // Modified
    curve_chart.setOption(option);
}