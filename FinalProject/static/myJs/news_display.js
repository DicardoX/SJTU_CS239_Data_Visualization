// news_display.js

let has_news_area = ["上海", "北京", "四川", "山西", "新疆", "河北"];

// let word_cloud_city_name = ["上海"];

// 0 for news part, 1 for word cloud part
let cur_news_module_state = 0;

let cur_news_area_name = "北京";


// Draw news analysis pictures
function draw_news_analysis_pics() {
    console.log("Draw news analysis pics...");

    // console.log(cur_news_area_name);
    // console.log(has_news_area);

    if(has_news_area.indexOf(cur_news_area_name) !== -1) {
        console.log("Draw news analysis pics...");
        set_word_cloud(cur_news_area_name);
    }
}


// Update news area name
function update_news_area_name(area_name) {
    if(has_news_area.indexOf(area_name) !== -1) {
        cur_news_area_name = area_name;
    }
    // console.log(cur_news_area_name);
    news_button_control(cur_news_module_state);
}

// News button control
// Type: 0 for news, 1 for analysis
function news_button_control(type) {
    if(type === 0) {
        document.getElementById("news_button_1").style.color = "white";
        document.getElementById("news_button_2").style.color = "#1950c4";
    $('.content').html("<div class=\"marquee-view\">\n" +
        "                            <div class=\"marquee\">\n" +
        "\n" +
        "                            </div>\n" +
        "                        </div>");
        cur_news_module_state = 0;
        set_news(cur_news_area_name);


    } else {
        document.getElementById("news_button_1").style.color = "#1950c4";
        document.getElementById("news_button_2").style.color = "white";

        cur_news_module_state = 1;

        // Analysis
        $('.content').html("<div class=\'chart\'>\n" +
            "      <div id=\"word_cloud_container\" class=\"news_chart\">\n" +
            "                            </div>\n" +
            "                        </div>");//通过jquery方式获取table，并把tr,td的html输出到table中

        draw_news_analysis_pics();
    }
}

function set_news(area_name) {
    // If not prepared
    if(has_news_area.indexOf(area_name) === -1) {
        console.log("Unprepared area name to set news...exit")
        return
    }

    // If the analysis part is chosen
    if(cur_news_module_state === 1) {
        return
    }

    $.ajax({
        type : "GET",
        url : "../static/client_database/json/news_json/" + String(area_name) +".json",
        data : {
            method : "query"
        },
        dataType : "json",//返回的数据类型

        success : function(data) {

            var html = '';
            for ( var i = 0; i < data.length; i++) {//循环json对象，拼接tr,td的html
                html = html + "<div class='row'><span class='col'><img border='0' src='../static/images/news" + String(i%3+2) + ".jpeg'  width='100' height='70'></span><a class='col' href='https://sthj.sh.gov.cn" + data[i].link + "'>" + data[i].title + "</a ><span class='icon-dot'></span></div>";
            }
            $('.marquee').html(html);//通过jquery方式获取table，并把tr,td的html输出到table中
        },
        error : function() {
            alert("查询失败！");
        }
    });
}