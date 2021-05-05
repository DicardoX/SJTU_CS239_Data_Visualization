// HistogramPlot.js

// 数据类别索引
let main_type_index = 0;

// 月份索引，为饼图的绘制提供接口
let month_index = 0;

// 子类索引，为曲线图绘制提供接口
let sub_type_index = 0;

// 类名列表
let main_type_name_list = [];

// 根据选中的type_index改变或恢复button的底色
function change_main_button_color() {
    switch (main_type_index) {
        case 0:
            // Area
            document.getElementById("area_button").style.backgroundColor = "grey";
            document.getElementById("gender_button").style.backgroundColor = "whitesmoke";
            document.getElementById("age_button").style.backgroundColor = "whitesmoke";
            document.getElementById("group_button").style.backgroundColor = "whitesmoke";
            break;
        case 1:
            // Gender
            document.getElementById("area_button").style.backgroundColor = "whitesmoke";
            document.getElementById("gender_button").style.backgroundColor = "grey";
            document.getElementById("age_button").style.backgroundColor = "whitesmoke";
            document.getElementById("group_button").style.backgroundColor = "whitesmoke";
            break;
        case 2:
            // Age
            document.getElementById("area_button").style.backgroundColor = "whitesmoke";
            document.getElementById("gender_button").style.backgroundColor = "whitesmoke";
            document.getElementById("age_button").style.backgroundColor = "grey";
            document.getElementById("group_button").style.backgroundColor = "whitesmoke";
            break;
        case 3:
            // Group
            document.getElementById("area_button").style.backgroundColor = "whitesmoke";
            document.getElementById("gender_button").style.backgroundColor = "whitesmoke";
            document.getElementById("age_button").style.backgroundColor = "whitesmoke";
            document.getElementById("group_button").style.backgroundColor = "grey";
            break;
        default:
            break;
    }
}

// 选择要展示哪一类数据
// index = 0: Area; 1: Gender; 2: Age; 3: Group;
function choose_main_data_type(table, index) {
    switch (index) {
        case 0:
            // Area
            main_type_index = 0;
            main_type_name_list = ["Local", "USA", "SA", "EU", "MEA", "ASIA"];
            console.log("Index for Area...");
            break;
        case 1:
            // Gender
            main_type_index = 1;
            main_type_name_list = ["Female", "Male"];
            console.log("Index for Gender...");
            break;
        case 2:
            // Age
            main_type_index = 2;
            main_type_name_list = ["U20", "20to35", "35to55", "M55"];
            console.log("Index for Age...");
            break;
        case 3:
            // Group
            main_type_index = 3;
            main_type_name_list = ["Businessmen", "Tourists"];
            console.log("Index for Group...");
            break;
        default:
            console.log("Error occurred in index choosing...");
            break;
    }

    // 根据type_index改变button的颜色
    // console.log("Change button color...");
    change_main_button_color();
    // Plot
    // console.log("Plot...");
    plot_main_histogram(table);

    // 绘制饼图
    plot_pie_chart(table);
}

// 根据选择type_index生成相应的部分数据集
function generate_main_dataset(ori_dataset) {
    let ret = [];
    let idx = 0;
    for (let i = 0; i < ori_dataset.length; i++) {
        switch (main_type_index) {
            case 0:
                // Area
                if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5 || i ===6) {
                    ret[idx] = [];
                    for (let j = 0; j < ori_dataset[i].length; j++) {
                        ret[idx][j] = ori_dataset[i][j];
                    }
                    idx++;
                }
                break;
            case 1:
                // Gender
                if (i === 0) {
                    // Female
                    ret[idx] = [];
                    for (let j = 0; j < ori_dataset[i].length; j++) {
                        ret[idx][j] = ori_dataset[i][j];
                    }
                    idx++;
                    // Male
                    ret[idx] = [];
                    for (let j = 0; j < ori_dataset[i].length; j++) {
                        ret[idx][j] = 100 - ori_dataset[i][j];
                    }
                }
                break;
            case 2:
                // Age
                if (i === 12 || i === 13 || i === 14 || i === 15) {
                    ret[idx] = [];
                    for (let j = 0; j < ori_dataset[i].length; j++) {
                        ret[idx][j] = ori_dataset[i][j];
                    }
                    idx++;
                }
                break;
            case 3:
                // Group
                if (i === 7 || i === 8) {
                    ret[idx] = [];
                    for (let j = 0; j < ori_dataset[i].length; j++) {
                        ret[idx][j] = ori_dataset[i][j];
                    }
                    idx++;
                }
                break;
            default:
                break;
        }
    }
    return ret;
}

// 绘制直方图
function plot_main_histogram(table) {
    // 删除旧的SVG，若无svg，selectAll()方法会创建一个空选择集并返回
    if (!d3.select("#mainHistogramContainer").selectAll("svg").filter(".myMainHistogramSVG").empty()) {
        d3.select("#mainHistogramContainer").selectAll("svg").filter(".myMainHistogramSVG").remove();
        console.log("Reconstructing main histogram...");
    }

    // 设置幕布尺寸
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    width *= 0.7;
    height *= 0.5;
    // 创建SVG
    let svg = d3.select("#mainHistogramContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .classed("myMainHistogramSVG", true);

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

    // 根据选择的类别生成相应的数据集
    let dataset = generate_main_dataset(ori_dataset);

    // console.log(dataset)

    // 颜色块设置
    let color_scale = d3.scaleOrdinal()
        .domain(d3.range(0, dataset[0].length))
        .range(d3.schemeSet1);

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

    let types = ["Guests Sources", "Gender", "Client's age", "Group"]

    // 添加坐标轴说明
    svg.append("text")
        .text(types[main_type_index] + "(%)")
        .attr("x", (width / (dataset[0].length + 5)) / 2)
        .attr("y", (height / 30))

    svg.append("text")
        .text("Month(m)")
        .attr("x", 13 * (width / (dataset[0].length + 5)))
        .attr("y", height - (height / 180))

    let prev_sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let cur_sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // 注意，必须要这样才能重复添加矩形！
    let histogram = svg.selectAll("rect");

    for (let j = 0; j < dataset.length; j++) {
        // 绘制矩形
        histogram.data(dataset[j])
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return (i + 1.65) * (width / (dataset[0].length + 5));
            })
            .attr("y", function (d) { return height * (14 / 15); })
            .attr("width", (width / (dataset[0].length + 5)) * 0.7)
            .attr("height", 0)
            .attr("fill", function (d, i) { return color_scale(j); })
            .attr("id", function (d, i) { return (j * dataset[0].length + i).toString(); })
            .on("mouseover", function (d) {
                d3.select(this)
                    // .attr("fill", function (d) {
                    //     return 'rgba(65, 105, 225)';
                    // })
                    .attr("fill", "grey")
                // 设置相应提示框的不透明度
                // console.log(this.id);
                document.getElementById("tips" + this.id).style.opacity = "1.0";
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("fill", function (d, i) { return color_scale(j); });
                // 恢复相应提示框为透明状态
                // console.log(this.id);
                document.getElementById("tips" + this.id).style.opacity = "0.0";
            })
            .on("click", function (d) {
                // 通过id计算获取当前rect对应的月份（即横坐标），并更新month_index
                month_index = parseFloat(this.id) % dataset[0].length;
                // 重新绘制饼图
                plot_pie_chart(table);
                // 通过id计算获取当前rect对应的子类，并更新sub_type_index
                sub_type_index = Math.floor(parseFloat(this.id) / dataset[0].length)
                // 重新绘制曲线图
                plot_type_curve(table);
            })
            .transition()               // 动画效果
            .duration(1000)
            .ease(d3.easeCubicInOut)
            .attr("height", function (d, i) {
                prev_sum[i] = cur_sum[i];
                cur_sum[i] += d;
                return Math.abs((d / 100) * (13 / 15) * height);
            })
            // .attr("height", function (d) { return Math.abs((d / d3.max(dataset)) * (13 / 15) * height); })
            .attr("y", function (d, i) {
                return height - ((d + prev_sum[i]) / 100) * (13 / 15) * height - (height / 15);
            });
            // .attr("y", function (d) { return height - (d / d3.max(dataset)) * (13 / 15) * height - (height / 15); });

        // console.log(cur_sum);
        // console.log(prev_sum);
    }

    // 绘制提示框
    let tip_prev_sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let tip_cur_sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let j = 0; j < dataset.length; j++) {
        for (let i = 0; i < dataset[0].length; i++) {
            tip_prev_sum[i] = tip_cur_sum[i];
            tip_cur_sum[i] += dataset[j][i];
            svg.append("text")
                .text(function (d) {
                    return (dataset[j][i]) + "%";
                })
                .attr("id", function (d) { return "tips" + (j * dataset[0].length + i).toString(); })
                .style("font-size", 13)
                .attr("x", function (d) {
                    return (i + 2) * (width / (dataset[0].length + 5));
                })
                .attr("y", function (d) {
                    return height - ((dataset[j][i] + tip_prev_sum[i]) / 100) * (13 / 15) * height - (height / 15);
                })
                // 默认为透明状态
                .style("opacity", 0.0);
        }
    }

    // 图例，容器
    let legend = svg.append("g")
        .attr("transform", `translate(${14 * (width / (dataset[0].length + 5))}, ${height / 15})`)
        .selectAll("g")
        // .data(draw_data)
        .data(main_type_name_list)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {return `translate(0, ${i * height / 15})`});

    // 图例中的颜色条
    legend.append("rect")
        .attr("width", width / 30)
        .attr("height", height / 20)
        // .attr("fill", function (d) {return color_scale(d.index)});
        .attr("fill", function (d, i) {return color_scale(i)});

    // 绘制折线
    // 重新构造数据数组
    let new_dataset = new Array(dataset[0].length - 1);
    for (let i = 0; i < new_dataset.length; i++) {
        new_dataset[i] = [];
        new_dataset[i].push(dataset[0][i]);
        new_dataset[i].push(dataset[0][i + 1]);
    }

    // console.log("New Dataset:");
    // console.log(new_dataset);

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
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    }

    // 图例中的文字
    legend.append("text")
        // .text(function (d) {return d.data.key})
        .text(function (d) {return d;})
        .style("font-size", 13)
        .attr("y", "1em")
        .attr("x", "4em")
        .attr("dy", 3)

    // 创建表格名称
    let header_text = "Customers' Features: " + types[main_type_index] + " in Hotel Data";
    svg.append("text")
        .text(header_text)
        .style("font-size", "1vw")
        .attr("x", (width * 9.5 / 21))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y", (height / 50));
}