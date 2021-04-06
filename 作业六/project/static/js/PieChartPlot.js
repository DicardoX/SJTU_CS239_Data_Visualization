// PieChartPlot.js
// 绘制Hotel Data里旅客来源地的统计结果

// 当前选择的月份
let date_index = 9;

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
    // 饼图与文字相连的曲线起点
    let start_point = d3.arc()
        .innerRadius(radius + 20)
        .outerRadius(radius + 20);
    //饼图与文字相连的曲线终点
    let end_point = d3.arc()
      .innerRadius(radius + 20)
      .outerRadius(radius + 20)

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
        .duration(2000)
        .attrTween("d", function (d) {
            //初始加载时的过渡效果
            let fn = d3.interpolate({endAngle: d.startAngle}, d)
            return function(t) { return arc(fn(t)) }
        })


    // console.log(dataset)
    // console.log(d3.max(dataset))

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

            console.log(subPart);

            // subPart.append("g")
            //     .append("text")
            //     .text(function (d) {console.log(d.data.key); return d.data.key})
            //     .attr("transform", `translate(30, 0)`)
            //     .style("font-size", "1vm")
            //     .attr("y", "1em")
            //     .attr("x", "3em")
            //     .attr("dy", 3)
        }
    }

    // 文字


    // 文字层
    // let sum = d3.sum(ori_data, d => d.value);
    // svg.append("g")
    //     .attr("transform", `translate(${radius}, ${radius})`)
    //     .selectAll("text")
    //     .data(draw_data)
    //     .enter()
    //     .append("text")
    //     .attr("transform", function (d) {
    //         // arc.centroid(d)将文字平移到弧的中心
    //         // rotate 使文字旋转扇形夹角一半的位置(也可不旋转)
    //         return `translate(${arc.centroid(d)}) rotate(${-90 + (d.startAngle + (d.endAngle - d.startAngle) / 2) * 180 / Math.PI})`
    //     })
    //     .attr("text-anchor", "middle")          // 文字居中显示
    //     .attr("font-size", "10px")
    //     .text(function (d) { return (d.data.value / sum * 100).toFixed(2) + "%"; })             // 格式化文字显示格式

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

}