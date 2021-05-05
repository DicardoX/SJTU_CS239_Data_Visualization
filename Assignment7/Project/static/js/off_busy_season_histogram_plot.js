// off_busy_season_histogram_plot.js

// 数据类别索引
let season_type_index = 0;

// 指示是否应该开始绘制热力图颜色的flag：0 for not draw; 1 for draw
let draw_heatmap_flag = 0;

// 表征淡季/旺季的数组
let season_list = [];

// 类名列表
let season_type_name_list = [];

// 根据选中的season_type_index改变或恢复button的底色
function change_season_button_color() {
    switch (season_type_index) {
        case 0:
            // Occ/LoS
            document.getElementById("occ_los_button").style.backgroundColor = "grey";
            document.getElementById("total_time_button").style.backgroundColor = "whitesmoke";
            break;
        case 1:
            // Total time
            document.getElementById("occ_los_button").style.backgroundColor = "whitesmoke";
            document.getElementById("total_time_button").style.backgroundColor = "grey";
            break;
        default:
            break;
    }
}

// 选择要展示哪一类数据
// index = 0: Occ / LoS; 1: Total time = Occ * LoS
function choose_season_data_type(table, index) {
    switch (index) {
        case 0:
            // Occ / LoS
            season_type_index = 0;
            season_type_name_list = ["Occ", "LoS"];
            console.log("Index for Occ/LoS...");
            break;
        case 1:
            // Total time
            season_type_index = 1;
            season_type_name_list = ["TT", "TT"];
            console.log("Index for total time...");

            // 绘制热力图，着色
            draw_heatmap_flag = 1;
            plot_heatmap(table);
            break;
        default:
            console.log("Error occurred in season index choosing...");
            break;
    }

    // 根据season_type_index改变button的颜色
    // console.log("Change season button color...");
    change_season_button_color();
    // Plot
    // console.log("Plot...");
    plot_season_histogram(table);
}

// 根据选择season_type_index生成相应的部分数据集
function generate_season_dataset(ori_dataset) {

    let ret = [];
    let idx = 0;

    for (let i = 0; i < ori_dataset.length; i++) {
        if (i === 17 || i === 18) {
            ret[idx] = [];
            for (let j = 0; j < ori_dataset[i].length; j++) {
                ret[idx][j] = ori_dataset[i][j];
            }
            idx++;
        }
    }

    // Generate Season list
    let ret_2 = [];
    ret_2[0] = [];
    for (let i = 0; i < ori_dataset[0].length; i++) {
        ret_2[0][i] = ret[0][i] * ret[1][i];
        season_list[i] = ret_2[0][i];
    }

    // 选择返回哪个
    if (season_type_index === 0) {
        return ret;
    } else {
        return ret_2;
    }


}

// 绘制直方图
function plot_season_histogram(table) {

    // 删除旧的SVG，若无svg，selectAll()方法会创建一个空选择集并返回
    if (!d3.select("#seasonContainer").selectAll("svg").filter(".mySeasonHistogramSVG").empty()) {
        d3.select("#seasonContainer").selectAll("svg").filter(".mySeasonHistogramSVG").remove();
        console.log("Reconstructing season histogram...");
    }

    // 设置幕布尺寸
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    width *= 0.5;
    height *= 0.5;
    // 创建SVG
    let svg = d3.select("#seasonContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .classed("mySeasonHistogramSVG", true);

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
    let dataset = generate_season_dataset(ori_dataset);

    // console.log(dataset)

    // 颜色块设置
    let color_scale = ["rgba(160, 102, 211)", "rgba(128, 42, 42)"];

    // x坐标轴设置
    // 比例尺
    let x_scale = d3.scaleLinear()
        .domain([0, dataset[0].length + 1])
        .range([(width / (dataset[0].length + 5)), 14 * (width / (dataset[0].length + 5))]);

    let x_axis = d3.axisBottom()            // axisBottom表示数字显示在坐标轴的下方
        .scale(x_scale)
        .ticks(dataset[0].length + 1);
    // SVG添加坐标轴
    svg.append("g")
        .attr("class", "x_axis")
        .attr('transform', `translate(0, ${height - (height / 15)})`)           // 访问变量
        .call(x_axis);

    // y坐标轴设置，根据season_type_index
    switch (season_type_index) {
        case 0:
            // Occ/LoS
            // y_left坐标轴设置，for Occ
            // 比例尺
            let y_left_scale = d3.scaleLinear()
                .domain([0, 100])
                .range([height * (14 / 15), (height / 15)]);
            // 坐标轴设置
            let y_left_axis = d3.axisLeft()
                .scale(y_left_scale)
                .ticks(10);
            // SVG添加坐标轴
            svg.append("g")
                .attr("class", "y_left_axis")
                .attr('transform', `translate(${(width / (dataset[0].length + 5))}, 0)`)           // 访问变量
                .call(y_left_axis);
            // y_right坐标轴设置, for LoS
            // 比例尺
            let y_right_scale = d3.scaleLinear()
                .domain([0, d3.max(dataset[0])])
                .range([height * (14 / 15), (height / 15)]);
            // 坐标轴设置
            let y_right_axis = d3.axisRight()
                .scale(y_right_scale)
                .ticks(5);
            // SVG添加坐标轴
            svg.append("g")
                .attr("class", "y_right_axis")
                .attr('transform', `translate(${14 * (width / (dataset[0].length + 5))}, 0)`)           // 访问变量
                .call(y_right_axis);

            // 添加坐标轴说明
            svg.append("text")
                .text("Occupancy(%)")
                .attr("x", (width / (dataset[0].length + 5)) / 2)
                .attr("y", (height / 30))

            svg.append("text")
                .text("LoS(d)")
                .attr("x", (14 * (width / (dataset[0].length + 5))))
                .attr("y", (height / 30))

            svg.append("text")
                .text("Month(m)")
                .attr("x", 14 * (width / (dataset[0].length + 5)))
                .attr("y", height - (height / 180))

            // 绘制矩形
            let histogram = svg.selectAll("rect")
                .data(dataset[1])
                .enter()
                .append("rect")
                .attr("x", function (d, i) {
                    return (i + 1.6) * (width / (dataset[0].length + 5));
                })
                .attr("y", function (d) { return height * (14 / 15); })
                .attr("width", (width / (dataset[0].length + 5)) * 0.8)
                .attr("height", 0)
                .attr("fill", function (d, i) { return "rgba(160, 102, 211)"; })
                .on("mouseover", function (d) {
                    d3.select(this)
                        .attr("fill", 'rgba(65, 105, 225)')
                })
                .on("mouseout", function (d) {
                    d3.select(this)
                        .attr("fill", function () { return "rgba(160, 102, 211)"; });
                })
                .transition()               // 动画效果
                .duration(1000)
                .ease(d3.easeCubicInOut)
                .attr("height", function (d, i) {
                    return Math.abs((d / 100) * (13 / 15) * height);
                })
                .attr("y", function (d) {
                    return height - (d / 100) * (13 / 15) * height - (height / 15);
                });

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
                    .attr("x1",  (i + 2) * (width / (dataset[0].length + 5)))
                    .attr("y1", height * (14 / 15))
                    .attr("x2", (i + 3) * (width / (dataset[0].length + 5)))
                    .attr("y2", height * (14 / 15))
                    .on("mouseover", function (d) {
                        d3.select(this)
                            .attr("stroke", "grey")
                    })
                    .on("mouseout", function (d) {
                        d3.select(this)
                            .attr("stroke", 'rgba(128, 42, 42)');
                    })
                    .transition()
                    .duration(1000)
                    .attr("y1", (height - (new_dataset[i][0] / d3.max(dataset[0])) * (13 / 15) * height) - (height / 15))
                    .attr("y2", (height - (new_dataset[i][1] / d3.max(dataset[0])) * (13 / 15) * height) - (height / 15))

                    .attr("stroke", 'rgba(128, 42, 42)')
                    .attr("stroke-width", 3);
            }
            // 绘制数据点圆圈
            svg.selectAll("circle")
                .data(dataset[0])
                .enter()
                .append("circle")
                .attr("r", 3.5)
                .attr("fill", "white")
                .attr("stroke", function (d, i) { return 'rgba(128, 42, 42)'; })
                .attr("stroke-width", 0.8)
                .attr("cx", function (d, i) { return (i + 2) * (width / (dataset[0].length + 5)); })
                .attr("cy", function (d) { return height * (14 / 15); })
                .on("mouseover", function (d) {
                    d3.select(this)
                        .attr("fill", "grey")
                })
                .on("mouseout", function (d) {
                    d3.select(this)
                        .attr("fill", "white");
                })
                .transition()               // 动画效果
                .duration(1000)
                .attr("cy", function (d) { return (height - (d / d3.max(dataset[0])) * (13 / 15) * height) - (height / 15); })


            // 创建表格名称
            let header_text = "Occ/LoS for Hotel Off/Busy Season";
            svg.append("text")
                .text(header_text)
                .style("font-size", "1vw")
                .attr("x", (width * 6 / 13))
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("y", (height / 50));
            break;

        case 1:
            // Total time
            // y_left坐标轴设置，for Occ
            // 比例尺
            let y_scale = d3.scaleLinear()
                .domain([0, d3.max(dataset[0])])
                .range([height * (14 / 15), (height / 15)]);
            // 坐标轴设置
            let y_axis = d3.axisLeft()
                .scale(y_scale)
                .ticks(10);
            // SVG添加坐标轴
            svg.append("g")
                .attr("class", "y_axis")
                .attr('transform', `translate(${(width / (dataset[0].length + 5))}, 0)`)           // 访问变量
                .call(y_axis);

            // 添加坐标轴说明
            svg.append("text")
                .text("TT(h)")
                .attr("x", (width / (dataset[0].length + 5)) / 2)
                .attr("y", (height / 30))

            svg.append("text")
                .text("Month(m)")
                .attr("x", 14 * (width / (dataset[0].length + 5)))
                .attr("y", height - (height / 180))

            // 绘制矩形
            let histogram_total = svg.selectAll("rect")
                .data(dataset[0])
                .enter()
                .append("rect")
                .attr("x", function (d, i) {
                    return (i + 1.6) * (width / (dataset[0].length + 5));
                })
                .attr("y", function (d) { return height * (14 / 15); })
                .attr("width", (width / (dataset[0].length + 5)) * 0.8)
                .attr("height", 0)
                .attr("fill", function (d, i) { return "rgba(160, 102, 211)"; })
                .on("mouseover", function (d) {
                    d3.select(this)
                        .attr("fill", 'rgba(65, 105, 225)')
                })
                .on("mouseout", function (d) {
                    d3.select(this)
                        .attr("fill", function () { return "rgba(160, 102, 211)"; });
                })
                .transition()               // 动画效果
                .duration(1000)
                .ease(d3.easeCubicInOut)
                .attr("height", function (d, i) {
                    return Math.abs((d / d3.max(dataset[0])) * (13 / 15) * height);
                })
                .attr("y", function (d) {
                    return height - (d / d3.max(dataset[0])) * (13 / 15) * height - (height / 15);
                });

            // 绘制折线
            // 重新构造数据数组
            let new_dataset_2 = new Array(dataset[0].length - 1);
            for (let i = 0; i < new_dataset_2.length; i++) {
                new_dataset_2[i] = [];
                new_dataset_2[i].push(dataset[0][i]);
                new_dataset_2[i].push(dataset[0][i + 1]);
            }
            // 绘制线段
            for(let i = 0; i < new_dataset_2.length; i++) {
                svg.append("line")
                    .attr("x1",  (i + 2) * (width / (dataset[0].length + 5)))
                    .attr("y1", height * (14 / 15))
                    .attr("x2", (i + 3) * (width / (dataset[0].length + 5)))
                    .attr("y2", height * (14 / 15))
                    .on("mouseover", function (d) {
                        d3.select(this)
                            .attr("stroke", "grey")
                    })
                    .on("mouseout", function (d) {
                        d3.select(this)
                            .attr("stroke", 'rgba(128, 42, 42)');
                    })
                    .transition()
                    .duration(1000)
                    .attr("y1", (height - (new_dataset_2[i][0] / d3.max(dataset[0])) * (13 / 15) * height) - (height / 15))
                    .attr("y2", (height - (new_dataset_2[i][1] / d3.max(dataset[0])) * (13 / 15) * height) - (height / 15))

                    .attr("stroke", 'rgba(128, 42, 42)')
                    .attr("stroke-width", 3);
            }
            // 绘制数据点圆圈
            svg.selectAll("circle")
                .data(dataset[0])
                .enter()
                .append("circle")
                .attr("r", 3.5)
                .attr("fill", "white")
                .attr("stroke", function (d, i) { return 'rgba(128, 42, 42)'; })
                .attr("stroke-width", 0.8)
                .attr("cx", function (d, i) { return (i + 2) * (width / (dataset[0].length + 5)); })
                .attr("cy", function (d) { return height * (14 / 15); })
                .on("mouseover", function (d) {
                    d3.select(this)
                        .attr("fill", "grey")
                })
                .on("mouseout", function (d) {
                    d3.select(this)
                        .attr("fill", "white");
                })
                .transition()               // 动画效果
                .duration(1000)
                .attr("cy", function (d) { return (height - (d / d3.max(dataset[0])) * (13 / 15) * height) - (height / 15); })

            // 创建表格名称
            let header_text_2 = "Total Time (OCC * LoS) for Hotel Off/Busy Season";
            svg.append("text")
                .text(header_text_2)
                .style("font-size", "1vw")
                .attr("x", (width * 6 / 13))
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("y", (height / 50));
            break;
        default:
            break;
    }

    // 图例，容器
    let legend = svg.append("g")
        .attr("transform", `translate(${15 * (width / (dataset[0].length + 5))}, ${height / 15})`)
        .selectAll("g")
        // .data(draw_data)
        .data(season_type_name_list)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {return `translate(0, ${i * height / 15})`});

    // 图例中的颜色条
    legend.append("rect")
        .attr("width", width / 30)
        .attr("height", height / 20)
        // .attr("fill", function (d) {return color_scale(d.index)});
        .attr("fill", function (d, i) {return color_scale[i]});

    // 图例中的文字
    legend.append("text")
        .text(function (d) {return d;})
        .style("font-size", 13)
        .attr("y", "1em")
        .attr("x", "3em")
        .attr("dy", 3)
}