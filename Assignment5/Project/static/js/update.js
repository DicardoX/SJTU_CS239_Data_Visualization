// update.js

//初始化表格
function table_init(table) {
    // 初始行数
    let initLen;
    // 生成请求对象
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/update_hotel_info", true);
    // 设置请求头
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");
    // 发送请求（空白）
    xhr.send(JSON.stringify({
        "None": -1
    }))
    // 获取响应
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // 初始化行数
            initLen = JSON.parse(xhr.responseText).female.length;

            let female = JSON.parse(xhr.responseText).female;
            let local = JSON.parse(xhr.responseText).local;
            let USA = JSON.parse(xhr.responseText).USA;
            let SA = JSON.parse(xhr.responseText).SA;
            let EU = JSON.parse(xhr.responseText).EU;
            let MEA = JSON.parse(xhr.responseText).MEA;
            let ASIA = JSON.parse(xhr.responseText).ASIA;
            let businessmen = JSON.parse(xhr.responseText).businessmen;
            let tourists = JSON.parse(xhr.responseText).tourists;
            let DR = JSON.parse(xhr.responseText).DR;
            let agency = JSON.parse(xhr.responseText).agency;
            let AC = JSON.parse(xhr.responseText).AC;
            let u20 = JSON.parse(xhr.responseText).u20;
            let _20to35 = JSON.parse(xhr.responseText)._20to35;
            let _35to55 = JSON.parse(xhr.responseText)._35to55;
            let m55 = JSON.parse(xhr.responseText).m55;
            let price = JSON.parse(xhr.responseText).price;
            let LoS = JSON.parse(xhr.responseText).LoS;
            let occupancy = JSON.parse(xhr.responseText).occupancy;
            let conventions = JSON.parse(xhr.responseText).conventions;
            // 转化成行的形式，以列表返回
            let tArray = [];
            for (let i = 0; i < initLen; i++) {
                tArray[i] = [];
                tArray[i][0] = female[i]
                tArray[i][1] = local[i]
                tArray[i][2] = USA[i]
                tArray[i][3] = SA[i]
                tArray[i][4] = EU[i]
                tArray[i][5] = MEA[i]
                tArray[i][6] = ASIA[i]
                tArray[i][7] = businessmen[i]
                tArray[i][8] = tourists[i]
                tArray[i][9] = DR[i]
                tArray[i][10] = agency[i]
                tArray[i][11] = AC[i]
                tArray[i][12] = u20[i]
                tArray[i][13] = _20to35[i]
                tArray[i][14] = _35to55[i]
                tArray[i][15] = m55[i]
                tArray[i][16] = price[i]
                tArray[i][17] = LoS[i]
                tArray[i][18] = occupancy[i]
                tArray[i][19] = conventions[i]
            }

            // 第一行 (emptyRow) 的内容
            let row = table.rows[1];
            for (let i = 1; i < row.cells.length; i++) {
                row.cells[i].innerHTML = tArray[0][i - 1];
            }
            // 其余行的内容
            for (let i = 1; i < initLen; i++) {
                add_row(table, tArray[i]);
            }
        }
    }
}

// 更新表格信息，将表格信息同步到本地服务器
function update_hotel_info(table) {
    // 获取列形式的表格数据
    let ret = get_table_data(table);
    // 生成请求对象
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/update_hotel_info", true);
    // 设置请求头
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("kbn-version", "5.3.0");
    // 发送请求
    xhr.send(JSON.stringify({
        "female": ret[0],
        "local": ret[1],
        "USA": ret[2],
        "SA": ret[3],
        "EU": ret[4],
        "MEA": ret[5],
        "ASIA": ret[6],
        "businessmen": ret[7],
        "tourists": ret[8],
        "DR": ret[9],
        "agency": ret[10],
        "AC": ret[11],
        "u20": ret[12],
        "_20to35": ret[13],
        "_35to55": ret[14],
        "m55": ret[15],
        "price": ret[16],
        "LoS": ret[17],
        "occupancy": ret[18],
        "conventions": ret[19]
    }))
    // 获取响应
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // Do nothing
        }
    }
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

// 针对多个表格
function EditTables() {
    for(let i = 0; i < arguments.length; i++) {
       SetTableCanEdit(arguments[i]);
    }
}

//设置表格是可编辑的
function SetTableCanEdit(table) {
    for(let i = 1; i < table.rows.length; i++) {
       SetRowCanEdit(table.rows[i]);
    }
}

function SetRowCanEdit(row){
    for(let j = 0; j < row.cells.length; j++) {
       //如果当前单元格指定了编辑类型，则表示允许编辑
        let editType = row.cells[j].getAttribute("EditType");
        if(!editType) {
            //如果当前单元格没有指定，则查看当前列是否指定
            editType = row.parentNode.rows[0].cells[j].getAttribute("EditType");
        }
        if(editType) {
            row.cells[j].onclick = function (){
                EditCell(this);
            }
        }
    }
}

//设置指定单元格可编辑
function EditCell(element) {
    let editType = element.getAttribute("EditType");
    if(!editType) {
       //如果当前单元格没有指定，则查看当前列是否指定
       editType = element.parentNode.parentNode.rows[0].cells[element.cellIndex].getAttribute("EditType");
    }
    if (editType === "TextBox") {
        CreateTextBox(element, element.innerHTML);
    }
}

//为单元格创建可编辑输入框
function CreateTextBox(element, value){
    //检查编辑状态，如果已经是编辑状态，跳过
    let editState = element.getAttribute("EditState");
    if(editState !== "true") {
       //创建文本框
        const textBox = document.createElement("INPUT");
        textBox.type = "text";
        textBox.className="EditCell_TextBox";
       //设置文本框当前值
       if(!value) {
        value = element.getAttribute("Value");
       }
       textBox.value = value;
       //设置文本框的失去焦点事件
       textBox.onblur = function () {
        CancelEditCell(this.parentNode, this.value);
       }
       //向当前单元格添加文本框
       ClearChild(element);
       element.appendChild(textBox);
       textBox.focus();
       textBox.select();
       //改变状态变量
       element.setAttribute("EditState", "true");
       element.parentNode.parentNode.setAttribute("CurrentRow", element.parentNode.rowIndex);
    }
}

//取消单元格编辑状态
function CancelEditCell(element, value, text){
    element.setAttribute("Value", value);
    if(text) {
       element.innerHTML = text;
    }else {
       element.innerHTML = value;
    }
    element.setAttribute("EditState", "false");
}

//清空指定对象的所有字节点
function ClearChild(element) {
    element.innerHTML = "";
}

//添加行
function add_row(table, infoRow) {

    // 创建行对象，从空白行克隆
    let row = document.getElementById("emptyRow").cloneNode(true);
    // 若infoRow不为0，说明是在初始化时导入原数据；否则为添加空白行
    if (infoRow != null) {
        for (let i = 1; i < row.cells.length; i++) {
            row.cells[i].innerHTML = infoRow[i - 1];
        }
    } else {
        // 生成空白行，将内容全部清空
        for (let i = 1; i < row.cells.length; i++) {
            row.cells[i].innerHTML = "";
        }
    }
    table.tBodies[0].appendChild(row);          // 将该行加入表格对象的第一个表格的子对象（本例中仅一个表格）
    SetRowCanEdit(row);                         // 设置为可编辑
    return row;
}

//删除行
function delete_row(table) {
    // 遍历所有行，查看哪一行被选中
    for(let i = table.rows.length - 1; i > 0; i--) {
        let chkOrder = table.rows[i].cells[0].firstChild;
        if(chkOrder && chkOrder.type === "checkbox" && chkOrder.checked) {
            //执行删除
            table.deleteRow(i);
        }
    }
}