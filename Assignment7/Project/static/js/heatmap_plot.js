// heatmap_plot.js

// 代表淡旺季的list：season_list
// 横坐标：月份(m)
// 纵坐标：某一个type的amount

// 选择heatmap需要的相应部分数据集
function generate_heatmap_dataset(ori_dataset) {
    let ret = [];
    let idx = 0;

    // 第一维是表示淡季/旺季的season_list
    ret[idx] = [];
    for (let i = 0; i < season_list.length; i++) {
        ret[idx][i] = season_list[i];
    }
    idx++;

    // 接下来两维分别是price和conventions
    for (let i = 0; i < ori_dataset.length; i++) {
        if (i === 16 || i === 19) {
            ret[idx] = [];
            for (let j = 0; j < ori_dataset[i].length; j++) {
                ret[idx][j] = ori_dataset[i][j];
            }
            idx++;
        }
    }
    return ret;
}

// 绘制热力图
function plot_heatmap(table) {

    // 删除旧的SVG，若无svg，selectAll()方法会创建一个空选择集并返回
    if (!d3.select("#heatmapContainer").selectAll("svg").filter(".myHeatmapSVG").empty()) {
        d3.select("#heatmapContainer").selectAll("svg").filter(".myHeatmapSVG").remove();
        console.log("Reconstructing heatmap...");
    }

    // 设置幕布尺寸
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    width *= 0.4;
    height *= 0.5;
    // 创建SVG
    let svg = d3.select("#heatmapContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .classed("myHeatmapSVG", true);

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
    // console.log(ori_dataset)
    // console.log(d3.max(dataset))

    // 根据选择的类别生成相应的数据集
    let dataset = generate_heatmap_dataset(ori_dataset);
    // 类名列表
    let type_name_array = ["Total Time", "Price", "Conventions"];

    // console.log(dataset);

    // 颜色级别
    let colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#61b6c4","#4d91c0","#325ea8","#253494","#181d58", "#151d08", "#081d58", "#041d58"];
    // 图例，月份
    let months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."]

    // 绘制矩形
    let heatmap = svg.selectAll("rect");

    if (draw_heatmap_flag === 0) {
        for (let i = 0; i < dataset.length; i++) {
            heatmap.data(dataset[i])
                .enter()
                .append("rect")
                .attr("x", function (d, j) { return (j + 2) * (width / (dataset[0].length + 5)); })
                .attr("y", function (d) { return (i + 3) * (height / (dataset.length + 9)) * (28 / 30) + height / 30; })
                .attr("width", (width / (dataset[0].length + 5)) * 0.8)
                .attr("height", (height * (28 / 30) / (dataset.length + 9)) * 0.8)
                .on("mouseover", function (d) {
                    d3.select(this)
                        .transition()
                        .delay(10)
                        .attr("width", (width / (dataset[0].length + 5)))
                        .attr("height", (height * (28 / 30) / (dataset.length + 9)))
                        .attr("y", function (d) { return (i + 3) * (height / (dataset.length + 9)) * (28 / 30) + height / 30 - (height * (28 / 30) / (dataset.length + 9)) * 0.1; })
                })
                .on("mouseout", function (d) {
                    d3.select(this)
                        .transition()
                        .delay(0)
                        .attr("width", (width / (dataset[0].length + 5)) * 0.8)
                        .attr("height", (height * (28 / 30) / (dataset.length + 9)) * 0.8)
                        .attr("y", function (d) { return (i + 3) * (height / (dataset.length + 9)) * (28 / 30) + height / 30; })
                })
                .attr("fill", "#ffffd9")
                .classed("myHeatmap", true)
                .attr("stroke", "#A1A1A1")
        }
    } else {
        for (let i = 0; i < dataset.length; i++) {
            heatmap.data(dataset[i])
                .enter()
                .append("rect")
                .attr("x", function (d, j) { return (j + 2) * (width / (dataset[0].length + 5)); })
                .attr("y", function (d) { return (i + 3) * (height / (dataset.length + 9)) * (28 / 30) + height / 30; })
                .attr("width", (width / (dataset[0].length + 5)) * 0.8)
                .attr("height", (height * (28 / 30) / (dataset.length + 9)) * 0.8)
                .on("mouseover", function (d) {
                    d3.select(this)
                        .transition()
                        .delay(10)
                        .attr("width", (width / (dataset[0].length + 5)))
                        .attr("height", (height * (28 / 30) / (dataset.length + 9)))
                        .attr("y", function (d) { return (i + 3) * (height / (dataset.length + 9)) * (28 / 30) + height / 30 - (height * (28 / 30) / (dataset.length + 9)) * 0.1; })
                })
                .on("mouseout", function (d) {
                    d3.select(this)
                        .transition()
                        .delay(0)
                        .attr("width", (width / (dataset[0].length + 5)) * 0.8)
                        .attr("height", (height * (28 / 30) / (dataset.length + 9)) * 0.8)
                        .attr("y", function (d) { return (i + 3) * (height / (dataset.length + 9)) * (28 / 30) + height / 30; })
                })
                .attr("fill", "#ffffd9")
                .classed("myHeatmap", true)
                .attr("stroke", "#A1A1A1")
                // .attr("stroke", "black")
                .transition()               // 动画效果
                .duration(1500)
                .attr("fill", function (d, j) {
                    let idx = search_rank_pos(dataset[i][j], dataset[i]);
                    return colors[idx];
                })
        }
    }

    // 月份图例
    let month_legend = svg.selectAll(".month_legend")
        .data(months)
        .enter()
        .append("g")
        .classed("month_legend", true)
        .append("text")
        .text(function (d) {return d;})
        .attr("x", function (d, j) { return (j + 2.1) * (width / (dataset[0].length + 5));})
        .attr("y", (2.5) * (height / (dataset.length + 9)) * (28 / 30) + height / 30)
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
        .attr("y", function (d, j) {return (j + 3.2) * (height / (dataset.length + 9)) * (28 / 30) + height / 30;})
        .attr("dy", "1em")
        .style("font-size", 10)

    // 创建表格名称
    let header_text = "Heatmap for The Influence Factors of TT";
    svg.append("text")
        .text(header_text)
        .style("font-size", "1vw")
        .attr("x", (width * 8 / 17))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y", (height / (dataset.length + 9)) * (28 / 30) + height / 30);

    // 创建颜色意义提示
    let note_text = "(Note: Deeper color means hotter season / larger amount.)"
    svg.append("text")
        .text(note_text)
        .style("font-size", "0.8vw")
        .attr("x", (width * 6.7 / 17))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y",(5) * ((height / (dataset.length + 9)) * (28 / 30) + height / 30));
}
