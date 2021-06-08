// multi_curve.js

let target_list = ["PM2_5", "PM10", "SO2", "NO2", "CO", "O3", "U", "V", "TEMP", "RH", "PSFC"]

// Global button choice
let global_button_choice = 0;

// Obtain global city name and type
let cur_city_name = document.getElementById("current_city").innerText;
let cur_target_type = document.getElementById("current_type").innerText;

// Change target type
function change_curve_info(type) {
    cur_city_name = document.getElementById("current_city").innerText;

    if(type === 0) {
        // Global modification
        cur_target_type = document.getElementById("current_type").innerText;
    } else {
        // Local modification
        let index = document.getElementById("pollution_select").selectedIndex;
        cur_target_type = target_list[index - 1];
    }
    if(global_button_choice === 0) {
        // Plot analysis curve
    } else {
        update_predicted_curve(cur_city_name, cur_target_type);
    }
}

// Button control
// Chosen type: 0 for analysis (by default), 1 for prediction
function button_control(chosen_type) {
    // Update info
    cur_city_name = document.getElementById("current_city").innerText;
    cur_target_type = document.getElementById("current_type").innerText;
    // Reset the local selection
    document.getElementById("pollution_select").value = cur_target_type;

    if(chosen_type === 0) {
        document.getElementById("curve_button_1").style.color = "white";
        document.getElementById("curve_button_2").style.color = "#1950c4";
        global_button_choice = 0;

        let my_curve_chart = echarts.init($('.bar')[0]);
        my_curve_chart.clear();
        plot_analysis_curve();

    }
    else {
        document.getElementById("curve_button_2").style.color = "white";
        document.getElementById("curve_button_1").style.color = "#1950c4";
        global_button_choice = 1;

        let my_curve_chart = echarts.init($('.bar')[0]);
        my_curve_chart.clear();
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
    let my_curve_chart = echarts.init($('.bar')[0]);
    //在这里载入文件，还需要修改
    var ROOT_PATH = '../static/client_database/json/weather_json/syData.json';
    $.get(ROOT_PATH, function (_rawData) {
      run(_rawData);
    });
    function run(_rawData) {
      //这里选择要画几种污染物
      var pollutions = ['PM2.5','O3', 'PM10','SO2','NO2','CO'];
      var datasetWithFilters = [];
      var seriesList = [];
      echarts.util.each(pollutions, function (pollution) {
          var datasetId = 'dataset_' + pollution;
          datasetWithFilters.push({
              id: datasetId,
              fromDatasetId: 'dataset_raw',
              transform: {
                  type: 'filter',
                  config: {
                      and: [
                        //这里选择时间范围
                          { dimension: 'date', gte: 2000 },
                          { dimension: 'pollution_type', '=': pollution}
                      ]
                  }
              }
          });
          seriesList.push({
              type: 'line',
              smooth: true,
              datasetId: datasetId,
              showSymbol: false,
              name: pollution,
              /* endLabel: {
                  show: false,
                  formatter: function (params) {
                      return params.value[0] + ': ' + params.value[2];
                  },
                  color: '#ffffff',
              }, */
              labelLayout: {
                  moveOverlap: 'shiftY'
              },
              emphasis: {
                  focus: 'series'
              },
              encode: {
                  x: 'date',
                  y: 'relative_value',
                  label: ['pollution_type', 'relative_value'],
                  itemName: 'date',
                  tooltip: ['relative_value'],
              }
          });
      });

      let option = {
          animationDuration: 5000,
          dataset: [{
              id: 'dataset_raw',
              source: _rawData
          }].concat(datasetWithFilters),
          tooltip: {
              order: 'valueDesc',
              trigger: 'axis'
          },
          dataZoom: [
            {
              type: 'slider',
              xAxisIndex: 0
            },
            {
              type: 'inside',
              yAxisIndex: 0
            }
          ],
          xAxis: {
              type: 'category',
              nameLocation: 'middle',
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
              name: 'mg/m^3',
              nameTextStyle: {
                color: '#4c9bfd'
              },
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
          grid: {
              top: 35,
              bottom: 40
          },
          series: seriesList
      };

      my_curve_chart.setOption(option);
  }
}

// 绘制预测曲线
function plot_predicted_curve(days_data, AQIs, IAQIs) {
    let option = {
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
    let my_curve_chart = echarts.init($('.bar')[0]);                                                            // Modified
    my_curve_chart.setOption(option);
}