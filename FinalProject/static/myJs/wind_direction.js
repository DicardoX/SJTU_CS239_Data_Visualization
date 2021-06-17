// wind_direction.js


// Plot wind direction
function update_wind_direction() {
    //var myechart = echarts.init($('.wind-graph')[0]);
    let current_city = document.getElementById("current_city").innerText;
    let data_path = "../static/client_database/csv/city_wind_csv/" + current_city + "市风向分布统计.csv";
    var myechart = echarts.init(document.getElementById("wind-graph"));
    var option;
    var legend_rename = [
        {value: '轻风', name: '0-3.3m/s, 轻风'},
        {value: '和风', name: '3.4-7.9m/s, 和风'},
        {value: '劲风', name: '8.0- m/s, 劲风及以上'},
    ]

    d3.csv(data_path,function(csvdata){
        return csvdata;
        }).then(function (data) {
            syData = data;
            var windList = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], syData0=[], syData1=[], syData2=[];
            for(var i=0; i<8; i++){
                syData0.push(syData[0][windList[i]]);
                syData1.push(syData[1][windList[i]]);
                syData2.push(syData[2][windList[i]]);
            }

            option = {
                tooltip: {
                    trigger: 'item',
                    textStyle: {
                        fontSize: 16,
                        color: '#000',
                        fontFamily: 'Microsoft YaHei'
                    }
                },
                angleAxis: {
                    type: 'category',
                    data: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
                    boundaryGap: false,
                    axisLabel: {
                        color: '#4c9bfd',
                        show: false
                    },
                },
                radiusAxis: {
                    type: 'value',
                    show: true,
                    axisLabel: {
                        show: false
                    },
                },
                polar: {
                    center: ['30%', '50%'],
                    roam: true
                },
                series: [{
                    type: 'bar',
                    data: syData0,
                    coordinateSystem: 'polar',
                    name: '0-3.3m/s, 轻风',
                    stack: 'a',
                    itemStyle: {
                        color: '#30fc26'  // 线颜色
                    },
                    emphasis: {
                        focus: 'series'
                    }
                }, {
                    type: 'bar',
                    data: syData1,
                    coordinateSystem: 'polar',
                    name: '3.4-7.9m/s, 和风',
                    stack: 'a',
                    itemStyle: {
                        color: '#22f1e9'
                    },
                    emphasis: {
                        focus: 'series'
                    }
                }, {
                    type: 'bar',
                    data: syData2,
                    coordinateSystem: 'polar',
                    name: '8.0- m/s, 劲风及以上',
                    stack: 'a',
                    itemStyle: {
                        color: '#3b78f9'
                    },
                    emphasis: {
                        focus: 'series'
                    }
                }
            ],
                legend: {
                    show: true,
                    formatter: function(name){
                        for(var i=0; i<legend_rename.length; i++){
                            if(legend_rename[i].name == name){
                                return legend_rename[i].value;
                            }
                        }
                    },
                    orient: 'vertical',
                    right: '0%',
                    top: '10%',
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        color: '#4c9bfd'
                    }
                }
            };
            myechart.setOption(option);
        });
}
