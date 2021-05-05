// HeatmapPlot.js

function plot_heatmap(table) {

    // 删除旧的SVG，若无svg，selectAll()方法会创建一个空选择集并返回
    if (!d3.select("body").selectAll("svg").filter(".myHeatmapSVG").empty()) {
        d3.select("body").selectAll("svg").filter(".myHeatmapSVG").remove();
        console.log("Remove heatmap...");
    }

    // 设置幕布尺寸
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    width *= 0.5;
    height *= 0.7;
    // 创建SVG
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .classed("myHeatmapSVG", true);

    // 数据处理
    // get_table_data(table) 函数返回数据类型为string，需要转化为double，否则在比较大小时会把9判定为大于23
    // 注意若为空，则在画图时默认为0
    let dataset = get_table_data(table);
    for (let i = 0; i < dataset.length; i++) {
        for (let j = 0; j < dataset[0].length; j++) {
            if (dataset[i][j] !== "") {
                dataset[i][j] = parseFloat(dataset[i][j]);
            } else {
                dataset[i][j] = 0;
            }
        }
    }
    // 添加类名列表
    let type_name_array = [];
    for (let i = 1; i < table.getElementsByTagName("tr")[0].cells.length; i++) {
        // 读取类名并记录
        let type_name = table.getElementsByTagName("tr")[0].cells[i].innerHTML;
        type_name_array.push(type_name);
    }

    console.log(type_name_array);
    console.log(dataset)

    // 颜色级别
    let colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#61b6c4","#4d91c0","#325ea8","#253494","#181d58", "#151d08", "#081d58", "#041d58"];
    // 图例，月份
    let months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."]

    // 绘制矩形
    let heatmap = svg.selectAll("rect");

    for (let i = 0; i < dataset.length; i++) {
        heatmap.data(dataset[i])
            .enter()
            .append("rect")
            .attr("x", function (d, j) { return (j + 1) * (width / (dataset[0].length + 2)); })
            .attr("y", function (d) { return (i + 1) * (height / (dataset.length)) * (13 / 15) + height / 15; })
            .attr("width", (width / (dataset[0].length + 2)) * 0.8)
            .attr("height", (height * (13 / 15) / dataset.length) * 0.8)
            .on("mouseover", function (d) {
                d3.select(this)
                    .transition()
                    .delay(10)
                    .attr("width", (width / (dataset[0].length + 2)))
                    .attr("height", (height * (13 / 15) / dataset.length))
                    // .attr("x", function (d, j) { return (j + 1) * (width / (dataset[0].length + 2)) - (width / (dataset[0].length + 2)) * 0.1; })
                    // .attr("x", function (d) { console.log(event); return (d.clientX + 1) * (width / (dataset[0].length + 2)); })
                    .attr("y", function (d) { return (i + 1) * (height / (dataset.length)) * (13 / 15) + height / 15 - (height * (13 / 15) / dataset.length) * 0.1; })
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .transition()
                    .delay(0)
                    .attr("width", (width / (dataset[0].length + 2)) * 0.8)
                    .attr("height", (height * (13 / 15) / dataset.length) * 0.8)
                    // .attr("x", function (d, j) { return (j + 1) * (width / (dataset[0].length + 2)); })
                    .attr("y", function (d) { return (i + 1) * (height / (dataset.length)) * (13 / 15) + height / 15; })
            })
            .attr("fill", "#ffffd9")
            .classed("myHeatmap", true)
            .attr("stroke", "#A1A1A1")
            // .attr("stroke", "black")
            .transition()               // 动画效果
            .duration(1500)
            .attr("fill", function (d, j) {
                let idx = search_rank_pos(dataset[i][j], dataset[i]);
                // console.log(idx);
                return colors[idx];
            })
    }

    // 月份图例
    let month_legend = svg.selectAll(".month_legend")
        .data(months)
        .enter()
        .append("g")
        .classed("month_legend", true)
        .append("text")
        .text(function (d) {return d;})
        .attr("x", function (d, j) { return (j + 1.2) * (width / (dataset[0].length + 2));})
        .attr("y", height / 15 + 20)
        .style("font-size", 13);

    // 类名图例
    let type_name_legend = svg.selectAll(".type_name_legend")
        .data(type_name_array)
        .enter()
        .append("g")
        .classed("type_name_legend", true)
        .attr("width", "auto")
        .append("text")
        .text(function (d) {return d;})
        .attr("x",  0)
        .attr("y", function (d, j) {return (j + 1.2) * (height / (dataset.length)) * (13 / 15) + height / 15;})
        .attr("dy", "1em")
        .style("font-size", 10)

    // 创建表格名称
    let header_text = "Heatmap for Hotel Data";
    svg.append("text")
        .text(header_text)
        .style("font-size", "1vw")
        .attr("x", (width / 2))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y", (height / 30));

}