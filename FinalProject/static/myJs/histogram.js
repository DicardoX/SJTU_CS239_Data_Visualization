(function () {
    let my_chart = echarts.init($('.histogram')[0]);
    console.log("Histogram show!");
    option = {
        dataset: {
            source: [
                ['score', 'amount', 'product'],
                [89.3, 58212, 'Matcha Latte'],
                [57.1, 78254, 'Milk Tea'],
                [74.4, 41032, 'Cheese Cocoa'],
                [50.1, 12755, 'Cheese Brownie'],
                [89.7, 20145, 'Matcha Cocoa'],
                [68.1, 79146, 'Tea'],
                [19.6, 91852, 'Orange Juice'],
                [10.6, 101852, 'Lemon Juice'],
                [32.7, 20112, 'Walnut Brownie']
            ]
        },
        grid: {containLabel: true},
        xAxis: {name: 'amount'},
        yAxis: {type: 'category'},
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

    // option = {
    //     // 控制提示
    //     tooltip: {
    //         // 非轴图形，使用item的意思是放到数据对应图形上触发提示
    //         trigger: 'item',
    //         // 格式化提示内容：
    //         // a 代表图表名称 b 代表数据名称 c 代表数据  d代表  当前数据/总数据的比例
    //         formatter: "{a} <br/>{b} : {c} ({d}%)"
    //     },
    //     // 控制图表
    //     series: [
    //         {
    //             // 图表名称
    //             name: '地区',
    //             // 图表类型
    //             type: 'pie',
    //             // 南丁格尔玫瑰图 有两个圆  内圆半径10%  外圆半径70%
    //             // 百分比基于  图表DOM容器的半径
    //             radius: ['10%', '70%'],
    //             // 图表中心位置 left 50%  top 50% 距离图表DOM容器
    //             center: ['50%', '50%'],
    //             // 半径模式，另外一种是 area 面积模式
    //             roseType: 'radius',
    //             // 数据集 value 数据的值 name 数据的名称
    //             data: [
    //                 { value: 20, name: '云南' },
    //                 { value: 5, name: '北京' },
    //                 { value: 15, name: '山东' },
    //                 { value: 25, name: '河北' },
    //                 { value: 20, name: '江苏' },
    //                 { value: 35, name: '浙江' },
    //                 { value: 30, name: '四川' },
    //                 { value: 40, name: '湖北' }
    //             ],
    //             //文字调整
    //             label: {
    //                 fontSize: 10
    //             },
    //             //引导线
    //             labelLine: {
    //                 length: 8,
    //                 length2: 10
    //             }
    //         }
    //     ],
    //     color: ['#006cff', '#60cda0', '#ed8884', '#ff9f7f', '#0096ff', '#9fe6b8', '#32c5e9', '#1d9dff']
    // };
})();