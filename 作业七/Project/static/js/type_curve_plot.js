// type_curve_plot.js

// 代表当前选中的子类的索引：sub_type_index
// 代表当前选中的大类的索引：main_type_index
// 横坐标：月份(m)
// 纵坐标：某一个type的amount

// 选择curve需要的相应部分数据集
function generate_curve_dataset(ori_dataset) {
    let ret = [];
    let data_index = 0;
    let idx = 0;

    switch (main_type_index) {
        case 0:
            // Area
            data_index = 1 + sub_type_index;
            break;
        case 1:
            // Gender
            if (sub_type_index === 0) {
                data_index = sub_type_index;
            } else {
                // Male
                ret[idx] = [];
                for (let i = 0; i < ori_dataset[0].length; i++) {
                    ret[idx][i] = 100 - ori_dataset[0][i];
                }
                return ret;
            }
            break;
        case 2:
            // Age
            data_index = 12 + sub_type_index;
            break;
        case 3:
            // Group
            data_index = 7 + sub_type_index;
            break;
        default:
            break;
    }

    ret[idx] = [];
    for (let i = 0; i < ori_dataset[0].length; i++) {
        ret[idx][i] = ori_dataset[data_index][i];
    }

    return ret;
}

// 绘制类型曲线
function plot_type_curve(table) {
    // 删除旧的SVG，若无svg，selectAll()方法会创建一个空选择集并返回
    if (!d3.select("#curveContainer").selectAll("svg").filter(".myCurveSVG").empty()) {
        d3.select("#curveContainer").selectAll("svg").filter(".myCurveSVG").remove();
        console.log("Reconstructing type curve...");
    }

    // 设置幕布尺寸
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    width *= 0.4;
    height *= 0.5;
    // 创建SVG
    let svg = d3.select("#curveContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .classed("myCurveSVG", true);


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
    let dataset = generate_curve_dataset(ori_dataset);
    // 类名列表
    let main_types = ["Guests Sources", "Gender", "Client's age", "Group"];
    let sub_types = [["Local", "USA", "SA", "EU", "MEA", "ASIA"], ["Female", "Male"], ["U20", "20to35", "35to55", "M55"], ["Businessmen", "Tourists"]];

    // console.log(dataset);

    // x坐标轴设置
    // 比例尺
    let x_scale = d3.scaleLinear()
        .domain([0, dataset[0].length])
        .range([(width / (dataset[0].length + 5)), 13 * (width / (dataset[0].length + 5))]);

    let x_axis = d3.axisBottom()            // axisBottom表示数字显示在坐标轴的下方
        .scale(x_scale)
        .ticks(dataset[0].length);
    // SVG添加坐标轴
    svg.append("g")
        .attr("class", "x_axis")
        .attr('transform', `translate(0, ${height - (height / 15)})`)           // 访问变量
        .call(x_axis);
    // y坐标轴设置
    // 比例尺
    let y_scale = d3.scaleLinear()
        .domain([0, 100])
        .range([height * (14 / 15), (height / 15)]);

    let y_axis = d3.axisLeft()            // axisBottom表示数字显示在坐标轴的下方
        .scale(y_scale)
        .ticks(10);
    // SVG添加坐标轴
    svg.append("g")
        .attr("class", "y_axis")
        .attr('transform', `translate(${(width / (dataset[0].length + 5))}, 0)`)           // 访问变量
        .call(y_axis);

    // 添加坐标轴说明
    svg.append("text")
        .text(sub_types[main_type_index][sub_type_index] + "(%)")
        .attr("x", (width / (dataset[0].length + 5)) / 2)
        .attr("y", (height / 30))

    svg.append("text")
        .text("Month(m)")
        .attr("x", 13 * (width / (dataset[0].length + 5)))
        .attr("y", height - (height / 180))

    // 绘制矩形
    let histogram = svg.selectAll("rect")
        .data(dataset[0])
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return (i + 1.8) * (width / (dataset[0].length + 5));
        })
        .attr("y", function (d) { return height * (14 / 15); })
        .attr("width", (width / (dataset[0].length + 5)) * 0.4)
        .attr("height", 0)
        // .attr("fill", function (d, i) { return 'rgba(160, 102, 211)'; })
            .attr("fill", function (d, i) { return 'rgba(65, 105, 225)'; })
        .on("mouseover", function (d) {
            d3.select(this)
                // .attr("fill", function (d, i) { return 'rgba(65, 105, 225)'; });
                .attr("fill", function (d, i) { return "grey"; });
        })
        .on("mouseout", function (d) {
            d3.select(this)
                // .attr("fill", function (d, i) { return 'rgba(160, 102, 211)'; });
                .attr("fill", function (d, i) { return 'rgba(65, 105, 225)'; });
        })
        .transition()               // 动画效果
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .attr("height", function (d) { return Math.abs((d / 100)) * (13 / 15) * height; })
        .attr("y", function (d) { return height - (d / 100) * (13 / 15) * height - (height / 15); });

    // 绘制折线
    // 重新构造数据数组
    let new_dataset = new Array(dataset[0].length - 1);
    for (let i = 0; i < new_dataset.length; i++) {
        new_dataset[i] = [];
        new_dataset[i].push(dataset[0][i]);
        new_dataset[i].push(dataset[0][i + 1]);
    }
    // 绘制线段
    for(let i = 0; i < new_dataset.length; i++) {
        svg.append("line")
            .attr("x1",  (i + 2) * (width / (new_dataset.length + 6)))
            .attr("x2", (i + 3) * (width / (new_dataset.length + 6)))
            .attr("y1", function (d) { return height * (14 / 15); })
            .attr("y2", function (d) { return height * (14 / 15); })
            .transition()               // 动画效果
            .duration(1000)
            .attr("y1", (height - (new_dataset[i][0] / 100) * (13 / 15) * height) - (height / 15))
            .attr("y2", (height - (new_dataset[i][1] / 100) * (13 / 15) * height) - (height / 15))
            .attr("stroke", "red")
            .attr("stroke-width", 3);
    }

    // 创建表格名称
    let header_text = "Change Curve for " + sub_types[main_type_index][sub_type_index] + " in " + main_types[main_type_index];
    svg.append("text")
        .text(header_text)
        .style("font-size", "1vw")
        .attr("x", (width * 8 / 17))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y", (height / 50));

}
