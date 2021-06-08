// wind_direction.js


// Plot wind direction
function update_wind_direction() {
    //var myechart = echarts.init($('.wind-graph')[0]);
    var myechart = echarts.init(document.getElementById("wind-graph"));
    var option;

    d3.csv("../static/client_database/csv/syWindFre.csv",function(csvdata){
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
                        color: '#FFFFFF',
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
                    center: ['50%', '50%'],
                    roam: true
                },
                series: [{
                    type: 'bar',
                    data: syData0,
                    coordinateSystem: 'polar',
                    name: '0-3.3m/s, 轻风',
                    stack: 'a',
                    itemStyle: {
                        color: '#006cff'  // 线颜色
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
                        color: '#60cda0'
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
                        color: '#ed8884'
                    },
                    emphasis: {
                        focus: 'series'
                    }
                }
            ],
                legend: {
                    show: false,
                    data: ['0-3.3m/s, 轻风', '3.4-7.9m/s, 和风', '8.0- m/s, 劲风及以上'],
                    orient: 'vertical',
                    right: '5%',
                    textStyle: {
                        color: '#4c9bfd'
                    }
                }
            };
            myechart.setOption(option);
        });
}
