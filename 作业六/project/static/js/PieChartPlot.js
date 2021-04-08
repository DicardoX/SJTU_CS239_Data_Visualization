// PieChartPlot.js
// 绘制Hotel Data里旅客来源地的统计结果

// 当前选择的月份
let date_index = 9;

// 查询第一个选中的行号
function update_date_index(table) {
    // 遍历所有行，查看哪一行被选中
    for (let i = 1; i < table.rows.length; i++) {
        let chk_order = table.rows[i].cells[0].firstChild;
        if (chk_order && chk_order.type === "checkbox" && chk_order.checked) {
            date_index = i - 1;
            return;
        }
    }

    for(let i = table.rows.length - 1; i > 0; i--) {
        let chkOrder = table.rows[i].cells[0].firstChild;
        if(chkOrder && chkOrder.type === "checkbox" && chkOrder.checked) {
            //执行删除
            table.deleteRow(i);
        }
    }
}

function plot_pie_chart(table) {
    // 删除旧的SVG，若无svg，selectAll()方法会创建一个空选择集并返回
    if (!d3.select("body").selectAll("svg").filter(".myPieChartSVG").empty()) {
        d3.select("body").selectAll("svg").filter(".myPieChartSVG").remove();
        console.log("Remove pie chart...");
    }

    // 设置幕布尺寸
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    width *= 0.32;
    height *= 0.5;

    // const [width, height] = [750, 350];

    // 创建SVG
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .classed("myPieChartSVG", true);

    // 数据，类型为string，需要转化为int，否则在比较大小时会把9判定为大于23
    // 注意若为空，则在画图时默认为0
    let ori_dataset = get_table_data(table);
    let dataset = [];
    let dataset_type_name = [];
    let amount = 0;

    // 遍历类名，匹配住客来源地相关数据
    for (let i = 1; i < table.getElementsByTagName("tr")[0].cells.length; i++) {
        let type_name = table.getElementsByTagName("tr")[0].cells[i].innerHTML;
        if (type_name === "USA" || type_name === "SA" || type_name === "EU" || type_name === "MEA" || type_name === "ASIA" || type_name === "Local") {
            // 符合条件的类名入列
            dataset_type_name.push(type_name);
            // 创建一个空列表
            dataset[amount] = [];
            // 数据拷贝
            for (let j = 0; j < ori_dataset[i - 1].length; j++) {
                dataset[amount][j] = ori_dataset[i - 1][j];
                // 类型转化
                if (dataset[amount][j] !== "") {
                    dataset[amount][j] = parseFloat(dataset[amount][j]);
                } else {
                    dataset[amount][j] = 0;
                }
            }
            amount += 1;
        }
    }

    // 更新当前选中的月份
    update_date_index(table);
    console.log("Date index: " + date_index);

    // 根据当前选中的月份重新构造输入
    let ori_data = [];
    for (let i = 0; i < amount; i++) {
        let info = {key: dataset_type_name[i], value: dataset[i][date_index]};
        ori_data.push(info);
    }
    // console.log(ori_data);

    let pie_chart = svg.append("g").attr("transform", `translate(${(width / 5)}, ${(height / 5)})`);

    // 饼图相关尺寸
    // 半径
    let radius = Math.min(width, height) * 0.6 / 2;
    // 弧
    let arc = d3.arc()
        .innerRadius(50)
        .cornerRadius(10);
    // // 饼图与文字相连的曲线起点
    // let start_point = d3.arc()
    //     .innerRadius(radius + 20)
    //     .outerRadius(radius + 20);
    // //饼图与文字相连的曲线终点
    // let end_point = d3.arc()
    //   .innerRadius(radius + 20)
    //   .outerRadius(radius + 20)

    // 绘制用的数据，以及相关基础的设置（如每个值对应的角度等）
    let draw_data = d3.pie()
        .value(function (d){ return d.value; })
        .sort(null)
        .sortValues(null)
        .startAngle(0)
        .endAngle(Math.PI * 2)
        .padAngle(0.05)(ori_data)
    console.log(draw_data)

    // 颜色块设置
    let color_scale = d3.scaleOrdinal()
        .domain(d3.range(0, ori_data.length))
        .range(d3.schemeSet1);

    // path标签：可以组成任何形状的形状
    pie_chart.append("g")
        .attr("transform", `translate(${radius}, ${radius})`)
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1)
        .selectAll("path")
        .data(draw_data)
        .enter()
        .append("path")
        .attr("fill", function (d) { return color_scale(d.index) })
        .attr("d", function (d) {
            d.outerRadius = radius;
            return arc(d);
        })
        .on("mouseover", arcTween(radius + 20, 0))
        .on("mouseout", arcTween(radius, 150))
        .transition()
        .duration(1500)
        .attrTween("d", function (d) {
            //初始加载时的过渡效果
            let fn = d3.interpolate({endAngle: d.startAngle}, d)
            return function(t) { return arc(fn(t)) }
        })

    // 设置缓动函数,为鼠标事件使用
    function arcTween(outerRadius, delay) {
        return function() {
            let subPart = d3.select(this)
                .transition()
                .delay(delay)
                .attrTween('d', function(d) {
                    let i = d3.interpolate(d.outerRadius, outerRadius)
                    return function(t) { d.outerRadius = i(t); return arc(d) }
                });
        }
    }

    // 图例，容器
    let legend = pie_chart.append("g")
        .attr("transform", `translate(${radius * 2}, 0)`)
        .selectAll("g")
        .data(draw_data)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {return `translate(${width / 10}, ${i * height / 10})`});

    // 图例中的颜色条
    legend.append("rect")
        .attr("width", width / 20)
        .attr("height", height / 20)
        .attr("fill", function (d) {return color_scale(d.index)});

    // 图例中的文字
    legend.append("text")
        .text(function (d) {return d.data.key})
        .style("font-size", 13)
        .attr("y", "1em")
        .attr("x", "3em")
        .attr("dy", 3)

    // 创建表格名称
    let cur_text = "Guests Sources Distribution in Date " + (date_index + 1).toString();
    console.log(cur_text);
    svg.append("text")
        .text(cur_text)
        .style("font-size", "1vw")
        .attr("x", (width / 2))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y", (height / 12));

}