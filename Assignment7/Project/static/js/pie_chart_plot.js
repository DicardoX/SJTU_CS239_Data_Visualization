// pie_chart_plot.js


// 选择pie_chart需要的相应部分数据集，根据main_type_index和month_index来决定
function generate_pie_chart_dataset(ori_dataset) {
    let ret = [];
    // 调用main_histogram里的数据集生成函数来初步生成数据集
    let tmp_data = generate_main_dataset(ori_dataset);

    // 根据main_type_index生成类名列表
    let type_name_list = [];
    switch (main_type_index) {
        case 0:
            // Area
            type_name_list = ["Local", "USA", "SA", "EU", "MEA", "ASIA"];
            break;
        case 1:
            // Gender
            type_name_list = ["Female", "Male"];
            break;
        case 2:
            // Age
            type_name_list = ["U20", "20to35", "35to55", "M55"];
            break;
        case 3:
            // Group
            type_name_list = ["Businessmen", "Tourists"];
            break;
        default:
            break;
    }

    // 根据当前选中的月份重新构造输入
    for (let i = 0; i < tmp_data.length; i++) {
        let info = {key: type_name_list[i], value: tmp_data[i][month_index]};
        ret.push(info);
    }

    return ret;
}

function plot_pie_chart(table) {
    // 删除旧的SVG，若无svg，selectAll()方法会创建一个空选择集并返回
    if (!d3.select("#pieChartContainer").selectAll("svg").filter(".myPieChartSVG").empty()) {
        d3.select("#pieChartContainer").selectAll("svg").filter(".myPieChartSVG").remove();
        console.log("Reconstructing pie chart...");
    }

    // 设置幕布尺寸
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    width *= 0.4;
    height *= 0.5;

    // const [width, height] = [750, 350];

    // 创建SVG
    let svg = d3.select("#pieChartContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .classed("myPieChartSVG", true);

    // 数据处理
    // get_table_data(table) 函数返回数据类型为string，需要转化为double，否则在比较大小时会把9判定为大于23
    // 注意若为空，则在画图时默认为0
    let ori_dataset = get_table_data(table);
    for (let i = 0; i < ori_dataset.length; i++) {
        for (let j = 0; j < ori_dataset[0].length; j++) {
            if (ori_dataset[i][j] !== "") {
                ori_dataset[i][j] = parseFloat(ori_dataset[i][j]);
            } else {
                ori_dataset[i][j] = 0;
            }
        }
    }

    let ori_data = generate_pie_chart_dataset(ori_dataset);

    // console.log(ori_data);


    let pie_chart = svg.append("g").attr("transform", `translate(${(width / 30)}, ${(height / 5)})`);

    // 饼图相关尺寸
    // 半径
    let radius = Math.min(width, height) * 0.6 / 2;
    // 弧
    let arc = d3.arc()
        .innerRadius(50)
        .cornerRadius(10);

    // 绘制用的数据，以及相关基础的设置（如每个值对应的角度等）
    let draw_data = d3.pie()
        .value(function (d){ return d.value; })
        .sort(null)
        .sortValues(null)
        .startAngle(0)
        .endAngle(Math.PI * 2)
        .padAngle(0.05)(ori_data)
    // console.log(draw_data)

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

    // 类名列表
    let types = ["Guests Sources", "Gender", "Client's age", "Group"]
    // 月份列表
    let months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."]

    // 创建表格名称
    let cur_text = types[main_type_index] + " Distribution in " + "\xa0" + months[month_index];
    // console.log(cur_text);
    svg.append("text")
        .text(cur_text)
        .style("font-size", "1vw")
        .attr("x", (width * 6.5 / 21))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y", (height / 12));

}
