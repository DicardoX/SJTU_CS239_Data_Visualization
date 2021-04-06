// Utils.js

// 单元格选中效果
// 选择的列数，全局变量
let column_index = 0;

// 获取列号 + 改变选择单元格的背景颜色
function get_column_index(table, index) {
    console.log(index)
    column_index = index;
    let unit = table.rows[0].cells[index];
    unit.style.backgroundColor = "grey";
}

// 恢复单元格的背景颜色
function recover_unit_color(table, index) {
    let unit = table.rows[0].cells[index];
    unit.style.backgroundColor = "whitesmoke";
}

// 绘制所有类别的图表
function plot_all_graphs(table) {
    // 删除旧的SVG
    // d3.select("body").selectAll("svg").remove();

    // 绘制柱状图 & 折线图
    // plot_histogram(table);
    // 绘制饼图
    plot_pie_chart(table);
    // 绘制热点图
    // plot_heatmap(table);
}