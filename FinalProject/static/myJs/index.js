//自调用函数

(function () {
    // 1、页面一加载就要知道页面宽度计算
    var setFont = function () {
        // 因为要定义变量可能和别的变量相互冲突，污染，所有用自调用函数
        var html = document.documentElement;// 获取html
        // 获取宽度
        var width = html.clientWidth;

        // 判断
        if (width < 1024) width = 1024
        if (width > 1920) width = 1920
        // 设置html的基准值
        var fontSize = width / 80 + 'px';
        // 设置给html
        html.style.fontSize = fontSize;
    }
    setFont();
    // 2、页面改变的时候也需要设置
    // 尺寸改变事件
    window.onresize = function () {
        setFont();
    }
})();

(function () {
    //事件委托
    $('.monitor').on('click', ' a', function () {
        //点击当前的a 加类名 active  他的兄弟删除类名
        $(this).addClass('active').siblings().removeClass('active');
        //获取一一对应的下标
        var index = $(this).index();
        //选取content 然后狗日对应下标的 显示   当前的兄弟.content隐藏
        $('.content').eq(index).show().siblings('.content').hide();
    });

    $.ajax({
        type : "GET",
        url : "../static/myJs/client_database/news_json/北京.json",
        data : {
            method : "query"
        },
        dataType : "json",//返回的数据类型

        success : function(data) {

            var html = '';
            for ( var i = 0; i < data.length; i++) {//循环json对象，拼接tr,td的html
                // console.log(data[i]);
                html = html + "<div class='row'><span class='col'><img border='0' src='../static/myJs/images/news" + String(i%3+2) + ".jpeg'  width='100' height='70'></span><a class='col' href='https://sthj.sh.gov.cn" + data[i].link + "'>" + data[i].title + "</a ><span class='icon-dot'></span></div>";
            }
            $('.marquee').html(html);//通过jquery方式获取table，并把tr,td的html输出到table中
        },
        error : function() {
            alert("查询失败！");
        }
    });

})();

//订单
(function () {
    var data = {
        day365: { orders: '20,301,987', amount: '99834' },
        day90: { orders: '301,987', amount: '9834' },
        day30: { orders: '1,987', amount: '3834' },
        day1: { orders: '987', amount: '834' }
    }
    //点击事件
    $('.order').on('click', '.filter a', function () {
        //点击之后加类名
        $(this).addClass('active').siblings().removeClass('active');
        // 先获取点击a的 data-key自定义属性
        var key = $(this).attr('data-key');
        //获取自定义属性
        // data{}==>data.shuxing data['shuxing]
        key = data[key];//
        $('.order .item h4:eq(0)').text(key.orders);
        $('.order .item h4:eq(1)').text(key.amount);
    });
    //定时器
    var index = 0;
    var aclick = $('.order a');
    setInterval(function () {
        index++;
        if (index > 3) {
            index = 0;
        }
        //每san秒调用点击事件
        aclick.eq(index).click();
    }, 3000);
})();