// d3Table.js

let tArray = [];
let type_name_array = ["Female", "Local", "USA", "SA", "EU", "MEA", "ASIA", "Businessmen", "Tourists", "DR", "Agency",
    "AC", "U20", "20-35", "35-55", "M55", "Price", "LoS", "Occupancy", "Convention"];


function d3_table_update() {
    // 获取本地数据
    get_input();

    // 注意，前后端数据传输需要时间，因此必须添加一个延时函数，100ms就足够了！
    setTimeout(function () {
        console.log("Data Transformation completed! Begin work...")
        // console.log(tArray);

        // 删除旧的form，若无form，selectAll()方法会创建一个空选择集并返回
        if (!d3.select("#container").selectAll("form").filter(".myD3TableForm").empty()) {
            d3.select("#container").selectAll("form").filter(".myD3TableForm").remove();
            console.log("Remove d3Table form...");
        }

        // 设置幕布尺寸
        let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        width *= 0.8;
        height *= 0.8;

        // console.log(width)

        // 创建供用户输入的 HTML 表单，注意不可以包含在svg内部，因为并不是画图！
        let form = d3.select("#container")
            .append("form")
            .classed("myD3TableForm", true)
            .attr("id", "form1")
            .attr("name", "form1")
            .attr("method", "post")
            .attr("action", "")

        // 表格标题
        let title = form.append("h3")
            .text("Hotel Data")

        // 表格
        let table = form.append("table")
            .classed("myD3Table", true)
            .attr("id", "tabProduct")

        // 表格tbody
        let tbody = table.append("tbody")

        // 添加类名行
        let type_name_tr = tbody.append("tr")
        // 添加空白框
        type_name_tr.append("td")
            .classed("tdStyle", true)
            .attr("width", "25px")
            .attr("name", "Num");
        // 添加类名
        for (let i = 0; i < type_name_array.length; i++) {
            type_name_tr.append("td")
                .classed("tdStyle", true)
                .text(type_name_array[i])
                .attr("name", type_name_array[i])
                .attr("EditType", "TextBox");
        }

        console.log(table)

        // 添加空白数据行
        let data_tr = tbody.append("tr")
        // 添加勾选框
        data_tr.append("td")
            .classed("tdStyle", true)
            .attr("width", "25px")
            .append("input")
            .attr("type", "checkbox")
            .attr("name", "checkbox")
            .attr("value", "checkbox")
        // 添加数据
        for (let j = 0; j < tArray[0].length; j++) {
            data_tr.append("td")
                .classed("tdStyle", true)
                .text(0)
        }

        // 第一行 (emptyRow) 的内容
        console.log(table)
        // let row = table.rows[1];
        // for (let i = 1; i < row.cells.length; i++) {
        //     row.cells[i].innerHTML = tArray[0][i - 1];
        // }
        // // 其余行的内容
        // for (let i = 1; i < initLen; i++) {
        //     add_row(table, tArray[i]);
        // }



    }, 100)
}
