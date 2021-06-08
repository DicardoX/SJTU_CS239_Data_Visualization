// pollution_amount.js

// Pollution type
let pollution_type_list = ["PM2_5", "PM10", "SO2", "NO2", "CO", "O3"]

function unit_getMaxIndex(arr) {
    let max = arr[0];
    let max_index = 0;
    for (let i = 0; i < arr.length; i++) {
        if (max < arr[i]) {
            max = arr[i];
            max_index = i;
        }
    }
    return max_index;
}


function getMaxIndex(arr) {
    // Copy
    let new_arr = [];
    for(let i = 0; i < arr.length; i++) {
        new_arr.push(arr[i]);
    }

    let max_index = unit_getMaxIndex(new_arr);
    new_arr[max_index] = -10;
    let sec_max_index = unit_getMaxIndex(new_arr);

    return [max_index, sec_max_index];
}


// Set pollution amount in html
function set_pollution_amount(max_name, max_amount, sec_name, sec_amount) {
    document.getElementById("city_aqi").innerText = max_amount;
    document.getElementById("first_type").innerText = max_name;
    document.getElementById("second_aqi").innerText = sec_amount;
    document.getElementById("second_type").innerText = sec_name;
}


// Update pollution amount
function update_pollution_amount() {
    // Get global city name and date
    let city_name = document.getElementById("current_city").innerText;
    let date = document.getElementById("current_date").innerText;

    // 生成请求对象
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/server_update_pollution_amount", true);
    // 设置请求头
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");

    // 发送请求
    xhr.send(JSON.stringify({
        "PollutionAmountRequest": 1,
        "Date": date,
        "City_name": city_name,
    }))

    // 获取响应
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // 全部城市当天的AQI数据
            let response = JSON.parse(xhr.responseText)

            let AQI_list = [];
            // console.log(Object.keys(response)) // "北京"
            // 访问Object内的元素
            for(let key in response) {
                AQI_list.push(response[key]);
            }
            // console.log(AQI_list[0]);
            let [max_elm_index, sec_elm_index] = getMaxIndex(AQI_list[0]);
            // console.log(max_elm_index, sec_elm_index);

            let max_type = pollution_type_list[max_elm_index];
            let sec_max_type = pollution_type_list[sec_elm_index];

            // Set the elms in html
            set_pollution_amount(max_type, AQI_list[0][max_elm_index], sec_max_type, AQI_list[0][sec_elm_index]);

        }
    }
}