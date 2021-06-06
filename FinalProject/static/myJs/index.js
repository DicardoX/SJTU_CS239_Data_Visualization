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

    //滚动
    //原理：把marquee下面的子盒子都复制一遍 加入到marquee中
    //      然后动画向上滚动，滚动到一半重新开始滚动
    //因为选取的是两个marquee  所以要遍历
    // $('.monitor .marquee').each(function (index, dom) {
    //     //将每个 的所有子级都复制一遍
    //     var rows = $(dom).children().clone();
    //     //再将新的到的加入原来的
    //     $(dom).append(rows);
    // });
    $.ajax({
        type : "GET",
        url : "../static/myJs/json/shanghai.json",
        data : {
            method : "query"
        },
        dataType : "json",//返回的数据类型

        success : function(data) {

            var html = '';
            for ( var i = 0; i < data.length; i++) {//循环json对象，拼接tr,td的html
                console.log(data[i]);
                html = html + "<div class='row'><span class='col'>" + data[i].date + "</span><a class='col' href=' " + data[i].link + "'>" + data[i].title + "</a ><span class='icon-dot'></span></div>";
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
//销售
(function () {
    var option = {
        //鼠标提示工具
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            // 类目类型                                  
            type: 'category',
            // x轴刻度文字                                  
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisTick: {
                show: false//去除刻度线
            },
            axisLabel: {
                color: '#4c9bfd'//文本颜色
            },
            axisLine: {
                show: false//去除轴线  
            },
            boundaryGap: false//去除轴内间距
        },
        yAxis: {
            // 数据作为刻度文字                                  
            type: 'value',
            axisTick: {
                show: false//去除刻度线
            },
            axisLabel: {
                color: '#4c9bfd'//文本颜色
            },
            axisLine: {
                show: false//去除轴线  
            },
            boundaryGap: false//去除轴内间距
        },
        //图例组件
        legend: {
            textStyle: {
                color: '#4c9bfd' // 图例文字颜色

            },
            right: '10%'//距离右边10%
        },
        // 设置网格样式
        grid: {
            show: true,// 显示边框
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            borderColor: '#012f4a',// 边框颜色
            containLabel: true // 包含刻度文字在内
        },
        series: [{
            name: '预期销售额',
            // 数据                                  
            data: [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
            // 图表类型                                  
            type: 'line',
            // 圆滑连接                                  
            smooth: true,
            itemStyle: {
                color: '#00f2f1'  // 线颜色
            }
        },
        {
            name: '实际销售额',
            // 数据                                  
            data: [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79],
            // 图表类型                                  
            type: 'line',
            // 圆滑连接                                  
            smooth: true,
            itemStyle: {
                color: '#ed3f35'  // 线颜色
            }
        }]
    };
    var myechart = echarts.init($('.line')[0]);
    myechart.setOption(option);

    //点击效果
    var data = {
        year: [
            [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
            [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79]
        ],
        quarter: [
            [23, 75, 12, 97, 21, 67, 98, 21, 43, 64, 76, 38],
            [43, 31, 65, 23, 78, 21, 82, 64, 43, 60, 19, 34]
        ],
        month: [
            [34, 87, 32, 76, 98, 12, 32, 87, 39, 36, 29, 36],
            [56, 43, 98, 21, 56, 87, 43, 12, 43, 54, 12, 98]
        ],
        week: [
            [43, 73, 62, 54, 91, 54, 84, 43, 86, 43, 54, 53],
            [32, 54, 34, 87, 32, 45, 62, 68, 93, 54, 54, 24]
        ]
    }
    $('.sales ').on('click', '.caption a', function () {
        $(this).addClass('active').siblings('a').removeClass('active');
        //option series   data
        //获取自定义属性值
        var key = $(this).attr('data-type');
        //取出对应的值
        key = data[key];
        //将值设置到 图表中
        option.series[0].data = key[0];
        option.series[1].data = key[1];
        //再次调用才能在页面显示
        myechart.setOption(option);
    });
    //定时器
    var index = 0;
    var timer = setInterval(function () {
        index++;
        if (index > 4) {
            index = 0;
        };
        $('.sales .caption a').eq(index).click();
    }, 2000);
})();
(function () {
    var option = {
        series: [
            {
                type: 'pie',
                radius: ['130%', '150%'],  // 放大图形
                center: ['50%', '80%'],    // 往下移动  套住75%文字
                label: {
                    show: false,
                },
                startAngle: 180,
                hoverOffset: 0,  // 鼠标经过不变大
                data: [
                    {
                        value: 100,
                        itemStyle: { // 颜色渐变#00c9e0->#005fc1
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    { offset: 0, color: '#00c9e0' },
                                    { offset: 1, color: '#005fc1' }
                                ]
                            }
                        }
                    },
                    { value: 100, itemStyle: { color: '#12274d' } }, // 颜色#12274d

                    { value: 200, itemStyle: { color: 'transparent' } }// 透明隐藏第三块区域
                ]
            }
        ]
    };
    var myechart = echarts.init($('.gauge')[0]);
    myechart.setOption(option);
})();
(function () {
    var data = [
        { name: '可爱多', num: '9,086' },
        { name: '娃哈哈', num: '8,341' },
        { name: '喜之郎', num: '7,407' },
        { name: '八喜', num: '6,080' },
        { name: '小洋人', num: '6,724' },
        { name: '好多鱼', num: '2,170' },
    ]
    $('.inner').on('mouseenter', '.sup li', function () {
        $(this).addClass('active').siblings().removeClass('active');
        //获取随机的值  sort方法 是给数组排序 a-b是从小到大
        //.5-随机0-1的数 可能为正可能为负 排序就会随机
        var radomData = data.sort(function (a, b) { return 0.5 - Math.random() });
        var html = '';
        radomData.forEach(function (item) {
            html += `<li><span>${item.name}</span><span>${item.num} <s class="icon-up"></s></span></li>`;
        });
        //渲染
        $('.sub').html(html);
    });
    $('.province .sup li').eq(0).mouseenter();
    var index = 0;
    var timer = setInterval(() => {
        index++;
        if (index > 5) {
            index = 0;
        }
        $('.sup li').eq(index).mouseenter();
    }, 2000);
})();