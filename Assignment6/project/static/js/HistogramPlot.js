// HistogramPlot.js

function plot_histogram(table) {
    // column_index为当前选中的列数，全局变量，定义在Utils.js
    if(column_index <= 0) {
        console.log("Invalid Index Error. The column index is:", column_index);
        return 0;
    }

    // 删除旧的SVG，若无svg，selectAll()方法会创建一个空选择集并返回
    if (!d3.select("body").selectAll("svg").filter(".myHistogramSVG").empty()) {
        d3.select("body").selectAll("svg").filter(".myHistogramSVG").remove();
        console.log("Remove histogram...");
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
        .classed("myHistogramSVG", true);

    // 数据，类型为string，需要转化为int，否则在比较大小时会把9判定为大于23
    // 注意若为空，则在画图时默认为0
    let dataset = get_table_data(table)[column_index - 1];
    for(let i = 0; i < dataset.length; i++) {
        // dataset[i] = parseInt(dataset[i]);
        if (dataset[i] !== "") {
            dataset[i] = parseFloat(dataset[i]);
        } else {
            dataset[i] = 0;
        }
    }
    // console.log(dataset)
    // console.log(d3.max(dataset))

    // x坐标轴设置
    // 比例尺
    let x_scale = d3.scaleLinear()
        .domain([0, dataset.length])
        .range([(width / (dataset.length + 2)), width - (width / (dataset.length + 2))]);

    let x_axis = d3.axisBottom()            // axisBottom表示数字显示在坐标轴的下方
        .scale(x_scale)
        .ticks(dataset.length);
    // SVG添加坐标轴
    svg.append("g")
        .attr("class", "x_axis")
        .attr('transform', `translate(0, ${height - (height / 15)})`)           // 访问变量
        .call(x_axis);
    // y坐标轴设置
    // 比例尺
    let y_scale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        // .range([(height / 20), height * (19 / 20)]);
        .range([height * (14 / 15), (height / 15)]);

    let y_axis = d3.axisLeft()            // axisBottom表示数字显示在坐标轴的下方
        .scale(y_scale)
        .ticks(10);
    // SVG添加坐标轴
    svg.append("g")
        .attr("class", "y_axis")
        .attr('transform', `translate(${(width / (dataset.length + 2))}, 0)`)           // 访问变量
        .call(y_axis);

    // 绘制矩形
    let histogram = svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function (d, i) { return (i + 1.6) * (width / (dataset.length + 2)); })
        .attr("y", function (d) { return height * (14 / 15); })
        .attr("width", (width / (dataset.length + 2)) * 0.8)
        .attr("height", 0)
        .attr("fill", function (d, i) { return 'rgba(160, 102, 211)'; })
        .on("mouseover", function (d) {
            d3.select(this)
                .attr("fill", function (d, i) { return 'rgba(65, 105, 225)'; });
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .attr("fill", function (d, i) { return 'rgba(160, 102, 211)'; });
        })
        .transition()               // 动画效果
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .attr("height", function (d) { return Math.abs((d / d3.max(dataset)) * (13 / 15) * height); })
        .attr("y", function (d) { return height - (d / d3.max(dataset)) * (13 / 15) * height - (height / 15); });

    // 绘制折线
    // 重新构造数据数组
    let new_dataset = new Array(dataset.length - 1);
    for (let i = 0; i < new_dataset.length; i++) {
        new_dataset[i] = [];
        new_dataset[i].push(dataset[i]);
        new_dataset[i].push(dataset[i + 1]);
    }
    // 绘制线段
    for(let i = 0; i < new_dataset.length; i++) {

        svg.append("line")
            .attr("x1",  (i + 2) * (width / (new_dataset.length + 3)))
            .attr("y1", (height - (new_dataset[i][0] / d3.max(dataset)) * (13 / 15) * height) - (height / 15))
            .attr("x2", (i + 3) * (width / (new_dataset.length + 3)))
            .attr("y2", (height - (new_dataset[i][1] / d3.max(dataset)) * (13 / 15) * height) - (height / 15))
            .attr("stroke", 'rgba(128, 42, 42)')
            .attr("stroke-width", 3);
    }
    // 绘制数据点圆圈
    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) { return (i + 2) * (width / (dataset.length + 2)); })
        .attr("cy", function (d) { return (height - (d / d3.max(dataset)) * (13 / 15) * height) - (height / 15); })
        .attr("r", 5)
        .attr("fill", "white")
        .attr("stroke", function (d, i) { return 'rgba(128, 42, 42)'; })
        .attr("stroke-width", 1.5);

    // 创建表格名称
    let cur_text = table.rows[0].cells[column_index].innerHTML;
    // console.log(cur_text);
    svg.append("text")
        .text(cur_text)
        .style("font-size", "1vw")
        .attr("x", (width / 2))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y", (height / 25));
}