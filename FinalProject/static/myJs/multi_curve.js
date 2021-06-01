// multi_curve.js

// Button control
// Chosen type: 0 for analysis (by default), 1 for prediction
function button_control(chosen_type) {
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
        plot_predicted_curve();
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
function plot_predicted_curve() {
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
            data: ['2020-10-01 12:00:00', '2020-10-01 13:00:00', '2020-10-01 14:00:00', '2020-10-01 15:00:00',
              '2020-10-01 16:00:00', '2020-10-01 17:00:00', '2020-10-01 18:00:00', '2020-10-01 19:00:00',
              '2020-10-01 20:00:00', '2020-10-01 21:00:00', '2020-10-01 22:00:00', '2020-10-01 23:00:00'],
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
            axisTick: { // 轴刻度线
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '浓度数据',
            max: 0.5,
            interval: 0.1,
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
            name: '测量原始值',
            min: 0,
            max: 10,
            interval: 2,
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
                color: ['rgba(250,250,250,0.3)', 'rgba(226,226,226,0.3)'],
              },
            },
          },
        ],
        series: [
          {
            name: '浓度数据',
            type: 'line',
            data: [0.2, 0.049, 0.07, 0.23, 0.25, 0.07, 0.15, 0.162, 0.32, 0.2, 0.06, 0.33],
            smooth: true,
            symbolSize: 6,
            areaStyle: {},
            itemStyle: {
              borderWidth: 2,
            },
          },
          {
            name: '测量原始值',
            type: 'line',
            yAxisIndex: 1,
            data: [2.6, 5.9, 9.0, 6.4, 8.7, 0.7, 5.6, 2.2, 0.4, 0.18, 0.24, 0.25],
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