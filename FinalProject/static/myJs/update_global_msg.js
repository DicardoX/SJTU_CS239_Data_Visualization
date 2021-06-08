// update_global_msg.js

// Update global city by clicking in the main map
function update_global_city(city_name) {
    // Update current city in the header
    update_current_city(city_name);

    // Update curve module
    change_curve_info(0);

    // // Update pollution amount module
    // setTimeout(function(){
    update_pollution_amount();
    // }, 200);

    // Update news module
    update_news_area_name(city_name);
}


// Update global date by selecting in the date selector
function update_global_date() {
    let date = document.getElementById("date_choose").value;
    date = date.replaceAll("-", "_");
    // console.log(date);

    // Update current date in the header
    update_current_date(date);

    // Update curve module
    change_curve_info(0);

    // Update main map
    update_main_map(date);

    // Plot pollution amount, query database, sleep for a while in case that the conflict on querying the database
    // setTimeout(function(){
    update_pollution_amount();
        // }, 200);
}

// Update global type by selecting in the global type selector
function update_global_type() {
    let type = document.getElementById("datatype").value;
    // console.log(type);

    // Update current type in the header
    update_current_type(type);

    // Update sub selectors
    document.getElementById("pollution_select").value = type;
    change_curve_info(0);
}