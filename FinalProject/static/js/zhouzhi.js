function trylineCharts() {
    var ROOT_PATH = '../static/data/syData.json';
            var chartDom = document.getElementById('trylineCharts');
            var myChart = echarts.init(chartDom);
            var option;

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
                                    { dimension: 'date', gte: 2000 },
                                    { dimension: 'pollution_type', '=': pollution}
                                ]
                            }
                        }
                    });
                    seriesList.push({
                        type: 'line',
                        datasetId: datasetId,
                        showSymbol: false,
                        name: pollution,
                        endLabel: {
                            show: true,
                            formatter: function (params) {
                                return params.value[0] + ': ' + params.value[2];
                            }
                        },
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

                option = {
                    animationDuration: 10000,
                    dataset: [{
                        id: 'dataset_raw',
                        source: _rawData
                    }].concat(datasetWithFilters),
                    title: {
                        text: 'Pollution of SanYa through out the date'
                    },
                    tooltip: {
                        order: 'valueDesc',
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        nameLocation: 'middle'
                    },
                    yAxis: {
                        name: 'ug/m^3'
                    },
                    grid: {
                        right: 140
                    },
                    series: seriesList
                };

                myChart.setOption(option);

            }

            option && myChart.setOption(option);
}
trylineCharts();

function tryRadarCharts() {
    var chartDom = document.getElementById('tryRadarCharts');
            var myChart = echarts.init(chartDom);
            var option;
            var dateStart = 2090;
            var dateEnd = 2110;

            var syData;
            d3.csv("../static/data/syData.csv",function(csvdata){
                return csvdata;
                }).then(function (data) {
                    syData = data;
                    option = {
                        title:{
                            text: 'SaYan Pollution Radar Chart',
                            top: 10,
                            left: 10
                        },
                        tooltip:{
                            trigger: 'item'
                        },
                        legend:{
                            type: 'scroll',
                            bottom: 10,
                            data: (function (){
                                var list = [];
                                for (var i = dateStart; i <=dateEnd; i++) {
                                    list.push(i + '');
                                }
                                return list;
                            })()
                        },
                        radar: {
                            indicator: [
                                { text: 'CO', max: 150},
                                { text: 'O3', max: 60},
                                { text: 'PM2.5', max: 50},
                                { text: 'PM10', max: 12},
                                { text: 'SO2', max: 12},
                                { text: 'NO2', max: 1}
                            ]
                        },
                        series: (function (){
                            var series = [];
                            for (var i = dateStart; i <= dateEnd; i++) {
                                var r = 250*(i-dateStart)/(dateEnd-dateStart);
                                //var g = 250*(i-dateStart)/(dateEnd-dateStart);
                                //var b = 250*(i-dateStart)/(dateEnd-dateStart);
                                series.push({
                                    name: 'pollution data',
                                    type: 'radar',
                                    symbol: 'none',
                                    lineStyle: {
                                        width: 3,
                                        color: 'rgba('+r+',0,0,0.7)'
                                    },
                                    emphasis: {
                                        areaStyle: {
                                            color: 'rgba(0,250,0,0.3)'
                                        }
                                    },
                                    data: [{
                                        value: [
                                            syData[i]['CO'],
                                            syData[i]['O3'],
                                            syData[i]['PM2.5'],
                                            syData[i]['PM10'],
                                            syData[i]['SO2'],
                                            syData[i]['NO2']
                                        ],
                                        name: i + ''
                                    }]
                                });
                            }
                            return series;
                        })()
                    };
                    option && myChart.setOption(option);
                });
}

tryRadarCharts();

function tryTempLineChart() {
    var chartDom = document.getElementById('tryTempLineChart');
            var myChart = echarts.init(chartDom);
            var option;
            var syData;
            /*
            var data = [["2000-06-05",116],["2000-06-06",129],["2000-06-07",135],["2000-06-08",86],["2000-06-09",73],["2000-06-10",85],["2000-06-11",73],["2000-06-12",68],["2000-06-13",92],["2000-06-14",130],["2000-06-15",245],["2000-06-16",139],["2000-06-17",115],["2000-06-18",111],["2000-06-19",309],["2000-06-20",206],["2000-06-21",137],["2000-06-22",128],["2000-06-23",85],["2000-06-24",94],["2000-06-25",71],["2000-06-26",106],["2000-06-27",84],["2000-06-28",93],["2000-06-29",85],["2000-06-30",73],["2000-07-01",83],["2000-07-02",125],["2000-07-03",107],["2000-07-04",82],["2000-07-05",44],["2000-07-06",72],["2000-07-07",106],["2000-07-08",107],["2000-07-09",66],["2000-07-10",91],["2000-07-11",92],["2000-07-12",113],["2000-07-13",107],["2000-07-14",131],["2000-07-15",111],["2000-07-16",64],["2000-07-17",69],["2000-07-18",88],["2000-07-19",77],["2000-07-20",83],["2000-07-21",111],["2000-07-22",57],["2000-07-23",55],["2000-07-24",60]];
            var dateList = data.map(function (item) {
                return item[0];
            });
            var valueList = data.map(function (item) {
                return item[1];
            });
            console.log(dateList);
            */
           dateList = []
           for(var i=1; i<=365; i++){
               dateList.push(i);
           }

            d3.csv("../static/data/syTempData.csv",function(csvdata){
                return csvdata;
                }).then(function (data) {
                    syData = data;
                    var valueList = [];
                    for(var i=0; i<syData.length; i++){
                        valueList.push(syData[i]['Temperature']);
                    }
                    option = {
                        // Make gradient line here
                        visualMap: [{
                            show: false,
                            type: 'continuous',
                            seriesIndex: 0,
                            min: Math.min(...valueList)-1,
                            max: Math.max(...valueList)+1
                        }],
                        tooltip: {
                            trigger: 'axis'
                        },
                        xAxis: [{
                            data: dateList
                        }],
                        yAxis: [{
                            min: Math.min(...valueList)-1,
                            max: Math.max(...valueList)+1
                        }],
                        series: [{
                            type: 'line',
                            showSymbol: false,
                            data: valueList
                        }]
                        };
                    option && myChart.setOption(option);
                });
}

tryTempLineChart();

function tryWindRose() {
    var chartDom = document.getElementById('tryWindRose');
            var myChart = echarts.init(chartDom);
            var option;
            var syData;

            d3.csv("../static/data/syWindFre.csv",function(csvdata){
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
                            boundaryGap: false
                        },
                        radiusAxis: {
                        },
                        polar: {
                        },
                        series: [{
                            type: 'bar',
                            data: syData0,
                            coordinateSystem: 'polar',
                            name: '0-3.3m/s, 轻风',
                            stack: 'a',
                            emphasis: {
                                focus: 'series'
                            }
                        }, {
                            type: 'bar',
                            data: syData1,
                            coordinateSystem: 'polar',
                            name: '3.4-7.9m/s, 和风',
                            stack: 'a',
                            emphasis: {
                                focus: 'series'
                            }
                        }, {
                            type: 'bar',
                            data: syData2,
                            coordinateSystem: 'polar',
                            name: '8.0- m/s, 劲风及以上',
                            stack: 'a',
                            emphasis: {
                                focus: 'series'
                            }
                        }
                    ],
                        legend: {
                            show: true,
                            data: ['0-3.3m/s, 轻风', '3.4-7.9m/s, 和风', '8.0- m/s, 劲风及以上']
                        }
                    };
                    option && myChart.setOption(option);
                });
}
tryWindRose();