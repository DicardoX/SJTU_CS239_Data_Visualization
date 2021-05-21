// Utils.js

// 单元格选中效果
// 选择的列数，全局变量
let column_index = 1;

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

// 获取表格数据，转化为列形式
function get_table_data(table) {
    // 容器定义
    let ret = [];
    for (let j = 1; j < table.getElementsByTagName("tr")[0].cells.length; j++) {
        ret[j - 1] = [];
    }
    // 转化为列的形式
    for (let i = 1; i < table.getElementsByTagName("tr").length; i++) {
        for (let j = 1; j < table.getElementsByTagName("tr")[i].cells.length; j++) {
            // 读取表格单元格数据
            ret[j - 1][i - 1] = table.getElementsByTagName("tr")[i].cells[j].innerHTML;
        }
    }

    return ret;
}

// 寻找元素elm是序列arr中的第几小的元素
function search_rank_pos(elm, arr) {
    // 排序，注意要完全复制，不能简单赋值，否则为拷贝，调用.sort()函数时会改变原dataset
    let tmp_arr = [];
    for (let i = 0; i < arr.length; i++) {
        tmp_arr.push(arr[i]);
    }

    // 注意，这里不能直接.sort()
    tmp_arr.sort(function(a, b) {return a - b});


    for (let i = 0; i < tmp_arr.length; i++) {
        if (tmp_arr[i] === elm) {
            return i;
        }
        if (tmp_arr[i] > elm) {
            return i - 1;
        }
    }
    console.log("error elm: " + elm.toString());
    return -1;
}
