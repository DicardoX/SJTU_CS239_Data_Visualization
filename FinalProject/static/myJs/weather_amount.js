// weather_amount.js

let global_current_year = "0";
let global_current_city = "东京";

// PLot weather amount
function plot_weather_amount(wind_list, temp_list, rh_list, psfc_list) {
    //假设可以获取到全年的数据，将其按12个月求平均，得到12个值
    let avg_temperature, avg_wind_speed, avg_moisture, avg_atmosphere;
    avg_temperature = temp_list;
    avg_wind_speed = wind_list;
    avg_moisture = rh_list;
    avg_atmosphere = psfc_list;

    //对temp，wind进行归一化成百分数，用于综合面板的展示
    let max_temp = Math.max(...avg_temperature), max_wind_speed = Math.max(...avg_wind_speed);
    let norm_temp = Array(12).fill(0), norm_wind_speed = Array(12).fill(0);
    for(let i=0; i<12; i++){
        norm_temp[i] = avg_temperature[i]*100/max_temp;
        norm_wind_speed[i] = avg_wind_speed[i]*100/max_wind_speed;
    }

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
            data: avg_temperature,
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
            avg_temperature, norm_temp
        ],
        wind_speed: [
            avg_wind_speed, norm_wind_speed
        ],
        moisture: [
            avg_moisture
        ],
        atmosphere: [
            avg_atmosphere
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
        if(key !== "integrate"){
            let series = [{
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
            let series = [];
            for(let i=0; i<4; i++){
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
                //获取归一化的数据
                if(i === 0 || i === 1){
                    tmp_series.data = current_data[1];
                }
                else {
                    tmp_series.data = current_data[0];
                }
                tmp_series.itemStyle.color = color[data_type[i]];
                tmp_series.name = name[data_type[i]];
                series.push(tmp_series);
            }
            option.series = series;

            myechart.setOption(option);
        }
    });
}


// Update weather amount
function update_weather_amount() {
    //获取当前城市及时间
    let current_city = document.getElementById('current_city').innerText;
    let current_date = document.getElementById('current_date').innerText;
    let current_year = current_date.slice(0,4);

    if(current_year === global_current_year && current_city === global_current_city) {
        // console.log("Dont update weather amount info...");
        return;
    } else {
        // console.log("Weather amount info updated!");
        global_current_year = current_year;
        global_current_city = current_city;
    }

    //根据城市与时间获取相关指标
    let avg_temperature_list, avg_wind_speed_list, avg_moisture_list, avg_atmosphere_list;

    // 生成请求对象
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/server_update_weather_amount", true);
    // 设置请求头
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");
    // 发送请求（空白）
    xhr.send(JSON.stringify({
        "WeatherAmountRequest": 1,
        "City_name": current_city,
        "Current_year": current_year
    }))
    // 获取响应
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(xhr.responseText);

            avg_wind_speed_list = response.wind_speed;
            avg_temperature_list = response.temp;
            avg_moisture_list = response.rh;
            avg_atmosphere_list = response.psfc;

            // 绘制气象指标
            plot_weather_amount(avg_wind_speed_list, avg_temperature_list, avg_moisture_list, avg_temperature_list)
        }
    }

}
