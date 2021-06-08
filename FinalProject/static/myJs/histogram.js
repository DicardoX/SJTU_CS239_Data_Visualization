// histogram.js


// Plot histogram
function update_histogram() {
    var my_chart = echarts.init($('.histogram')[0]);
    option = {
        dataset: {
            source: [
                ['score', 'amount', 'product'],
                [89.3, 10, '南昌'],
                [57.1, 8, '赣州'],
                [74.4, 2, '九江'],
                [50.1, 5, '萍乡']
            ]
        },
        grid: {
            containLabel: true,
            top: 25,
            bottom: 40,
            left: 10
        },
        xAxis: {
            type: 'value',
            name: 'AQI',
            nameGap: 5,
            nameTextStyle:{
                fontSize: 10
            }
        },
        yAxis: {
            name: '城市',
            type: 'category',
            nameGap: 5
        },
        visualMap: {
            orient: 'horizontal',
            left: 'center',
            min: 10,
            max: 100,
            text: ['High Score', 'Low Score'],
            // Map the score column to color
            dimension: 0,
            inRange: {
                color: ['#65B581', '#FFCE34', '#FD665F']
            }
        },
        series: [
            {
                type: 'bar',
                encode: {
                    // Map the "amount" column to X axis.
                    x: 'amount',
                    // Map the "product" column to Y axis
                    y: 'product'
                }
            }
        ]
    };
    my_chart.setOption(option);
}