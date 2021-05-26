function run(rawData){
    var pollutions = ['Pollution1','Pollution2','Pollution3'];
    var seriesList = [];
    var datasetWithFilters = [];
    echarts.util.each(pollutions, function(pollution){
        //对每个pollution按时间绘图，先不管zoom的问题
        var datasetId = 'dataset_' + pollution;
        //看是第几个pollution
        var number = 0;
        for(var i=0; i<length(pollutions); i++){
            if(pollutions[i] == pollutions){
                number = i;
                break;
            }
        }
        /*
        datasetWithFilters.push({
            id: datasetId,
            fromDatasetId: 'dataset_raw',
            transform: {
                type: 'filter',
                config: {
                    and: [
                        { dimension: 'Date', gte: 2012},
                        { dimension: '', '=': pollution}
                    ]
                }
            }
        });
        */
       //每次都push一条线进去
       seriesList.push({
           type: 'line',
           datasetId: datasetId,
           showSymbol: false,
           name: pollution,
           endLabel: {
               show: true, 
               formatter: function(params){
                   return pollutions[number] + ':' + params.value[number];
               }
           },
           labelLayout: {
               moveOverlap: 'shiftY'
           },
           emphasis: {
               focus: 'series'
           },
           encode: {
               //这里还要对数据的时间表示弄弄清楚，暂定是year
               x: 'Date',
               y: 'Relative Pollution',
               label: [pollution, 'Relative Pollution'],
               itemName: 'Date',
               tooltip: ['Relative Polltion'],
           }
       });
    });

    option = {
        animationDuration: 10000,
        dataset: [{
            id: 
        }]
    };

    myChart.setOption(option);
}