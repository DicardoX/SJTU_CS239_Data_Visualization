// weather_amount.js


// Update weather amount
function update_whether_amount() {
    var option = {
        //鼠标提示工具
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            // 类目类型
            type: 'category',
            // x轴刻度文字
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisTick: {
                show: false//去除刻度线
            },
            axisLabel: {
                color: '#4c9bfd'//文本颜色
            },
            axisLine: {
                show: false//去除轴线
            },
            boundaryGap: false//去除轴内间距
        },
        yAxis: {
            // 数据作为刻度文字
            type: 'value',
            axisTick: {
                show: false//去除刻度线
            },
            axisLabel: {
                color: '#4c9bfd'//文本颜色
            },
            axisLine: {
                show: false//去除轴线
            },
            boundaryGap: false//去除轴内间距
        },
        //放缩组件
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: 0
            }
        ],
        //图例组件
        legend: {
            textStyle: {
                color: '#4c9bfd' // 图例文字颜色

            },
            right: '10%'//距离右边10%
        },
        // 设置网格样式
        grid: {
            show: true,// 显示边框
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            borderColor: '#012f4a',// 边框颜色
            containLabel: true // 包含刻度文字在内
        },
        series: [{
            name: '气温',
            // 数据
            data: [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
            // 图表类型
            type: 'line',
            // 圆滑连接
            smooth: true,
            itemStyle: {
                color: '#ed3f35'  // 线颜色
            }
        }]
    };
    var myechart = echarts.init($('.line')[0]);
    myechart.setOption(option);

    var data_type = ["temprature", "wind_speed", "moisture", "atmosphere"];
    //点击效果
    var data = {
        temprature: [
            [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120]
        ],
        wind_speed: [
            [23, 75, 12, 97, 21, 67, 98, 21, 43, 64, 76, 38]
        ],
        moisture: [
            [34, 87, 32, 76, 98, 12, 32, 87, 39, 36, 29, 36]
        ],
        atmosphere: [
            [43, 73, 62, 54, 91, 54, 84, 43, 86, 43, 54, 53]
        ]
    }
	//每种指标的单位不同
    var units = {
        temprature: "单位: 摄氏度",
        wind_speed: "单位: m/s",
        moisture: "单位: %",
        atmosphere: "单位: %",
        integrate: "单位: 相对值"
    }
    //每条指标的着色不同
    var color = {
        temprature: "#ed3f35",
        wind_speed: "#eacf19",
        moisture: "#00f2f1",
        atmosphere: "#4c9bfd"
    }

    var name = {
        temprature: "气温",
        wind_speed: "风速",
        moisture: "湿度",
        atmosphere: "气压"
    }
    $('.sales ').on('click', '.caption a', function () {
        $(this).addClass('active').siblings('a').removeClass('active');
        //option series data
        //获取自定义属性值
        var key = $(this).attr('data-type');
        //根据选中button修改单位
        document.getElementById("unit").innerText = units[key];
        if(key != "integrate"){
            var series = [{
                name: '气温',
                // 数据
                data: [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
                // 图表类型
                type: 'line',
                // 圆滑连接
                smooth: true,
                itemStyle: {
                    color: '#ed3f35'  // 线颜色
                }
            }];
            //恢复到规模为1的数组
            option.series = series;
            //取出对应的值
            let current_data = data[key];
            //将值设置到 图表中
            option.series[0].data = current_data[0];
            //设置曲线颜色
            option.series[0].itemStyle.color = color[key];
            //设置图例
            option.series[0].name = name[key];
            myechart.clear();
            myechart.setOption(option);
        }
        //开始处理综合情况
        else{
            var series = [];
            for(var i=0; i<4; i++){
                let tmp_series = {
                    name: '气温',
                    // 数据
                    data: [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
                    // 图表类型
                    type: 'line',
                    // 圆滑连接
                    smooth: true,
                    itemStyle: {
                        color: '#ed3f35'  // 线颜色
                    }
                };
                let current_data = data[data_type[i]];
                tmp_series.data = current_data[0];
                tmp_series.itemStyle.color = color[data_type[i]];
                tmp_series.name = name[data_type[i]];
                series.push(tmp_series);
            }
            option.series = series;

            myechart.setOption(option);
        }
    });
}
