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
    width *= 0.32;
    height *= 0.5;
    // 创建SVG
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .classed("myHeatmapSVG", true);

    // 数据，类型为string，需要转化为int，否则在比较大小时会把9判定为大于23
    // 注意若为空，则在画图时默认为0
    let dataset = get_table_data(table);
    for(let i = 0; i < dataset.length; i++) {
        for(let j = 0; j < dataset[i].size; i++) {
            if (dataset[i][j] !== "") {
                dataset[i][j] = parseFloat(dataset[i][j]);
            } else {
                dataset[i][j] = 0;
            }
        }
    }
    console.log(dataset)
    // console.log(d3.max(dataset))

}