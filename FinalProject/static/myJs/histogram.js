// histogram.js
var AQI;
var tmp_list = [0,0,0,0,0,0,0]

function get_max_AQI(city, date, i) {
    let data_path = "../static/client_database/csv/city_AQI_csv/" + city + "市单日AQI统计.csv";
    d3.csv(data_path,function(csvdata){
        return csvdata;
        }).then(function (data) {
        tmp_list[i] = data[0][date];
    });
}


// Plot histogram
function update_histogram() {
    var my_chart = echarts.init($('.histogram')[0]);
    //获取当前城市
    let current_city = document.getElementById('current_city').innerText;
    let current_date = document.getElementById('current_date').innerText;
    let province_name;
    //从当前城市获取省份
    for(let i = 0; i < province_3D_prov_city_loc.length; i++) {
        let new_city_name = current_city + "市";
        if(province_3D_prov_city_loc[i].city_name === new_city_name) {
            // Is city
            province_name = province_3D_prov_city_loc[i].province_name;
            break;
        }
    }
    //根据省份修改innerHTML
    document.getElementById("province_city_bar").innerText = province_name + "城市空气质量排行";
    //根据省份获取城市list
    let current_city_list = [];
    for(let i = 0; i < province_3D_prov_city_loc.length; i++) {
        if(province_3D_prov_city_loc[i].province_name === province_name) {
            //去掉最后面的"市"字符
            let tmp_length = province_3D_prov_city_loc[i].city_name.length;
            current_city_list.push(province_3D_prov_city_loc[i].city_name.substring(0, tmp_length - 1));
        }
    }
    //根据current_city_list和current_date获取其AQI list
    let current_AQI_list = [];
    //逐个请求其AQI，在请求全部完成以后再绘图
    for(let i=0; i<current_city_list.length; i++){
        let city = current_city_list[i];
        let date = current_date;
        get_max_AQI(city, date, i);
        current_AQI_list.push(tmp_list[i]);
    }

    //整成source
    let data_source = [['AQI', 'city']];
    for(let i=0; i<current_city_list.length; i++){
        data_source.push([current_AQI_list[i], current_city_list[i]]);
    }
    //获取最大值最小值并更新innerHTML
    let smallest_index=0, largest_index=0, max_AQI=0, min_AQI=10000;
    for(let i=0; i<current_AQI_list.length; i++){
        if(current_AQI_list[i]>max_AQI){
            max_AQI = current_AQI_list[i];
            largest_index = i;
        }
        if(current_AQI_list[i]<min_AQI){
            min_AQI = current_AQI_list[i];
            smallest_index = i;
        }
    }
    document.getElementById("max_city").innerText = current_city_list[largest_index];
    document.getElementById("min_city").innerText = current_city_list[smallest_index];

    option = {
        dataset: {
            source: data_source
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
            axisLabel: {
                color: '#4c9bfd'//文本颜色
            },
            nameTextStyle:{
                fontSize: 10,
                color: '#4c9bfd'
            }
        },
        yAxis: {
            name: '城市',
            type: 'category',
            nameGap: 5,
            sortSeriesIndex: 0,
            inverse: true,
            axisLabel: {
                color: '#4c9bfd'//文本颜色
            },
            nameLocation: 'start',
            nameTextStyle:{
                color: '#4c9bfd'
            }
        },
        visualMap: {
            type: 'continuous',
            orient: 'horizontal',
            left: 'center',
            min: 0,
            max: 300,
            text: ['High Score', 'Low Score'],
            // Map the score column to color
            dimension: 0,
            inRange: {
                color: ['#0ACF00', '#FFCE34', '#FF0000']
            }
        },
        series: [
            {
                type: 'bar',
                realtimeSort: true,
                encode: {
                    // Map the "amount" column to X axis.
                    x: 'AQI',
                    // Map the "product" column to Y axis
                    y: 'city'
                }
            }
        ]
    };
    my_chart.setOption(option);
}