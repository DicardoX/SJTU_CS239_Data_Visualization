// header.js

// Update current city
function update_current_city(city_name) {
    document.getElementById("current_city").innerText = city_name;
}

// Update current date
function update_current_date(date) {
    document.getElementById("current_date").innerText = date;
}

// Update current type
function update_current_type(type) {
    document.getElementById("current_type").innerText = type;
}

// Update current air level, called in pollution_amount.js
function update_current_air_level(AQI) {
    let air_level = "";
    if(AQI <= 50) {
        air_level = "优";
    }
    if(AQI > 50 && AQI <= 100) {
        air_level = "良";
    }
    if(AQI > 100 && AQI <= 150) {
        air_level = "轻度污染";
    }
    if(AQI > 150 && AQI <= 200) {
        air_level = "中度污染";
    }
    if(AQI > 200 && AQI <= 300) {
        air_level = "重度污染";
    }
    if(AQI > 300) {
        air_level = "严重污染";
    }
    document.getElementById("current_air_level").innerText = air_level;

}