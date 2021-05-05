# 数据可视化作业七：D3.js制作图表交互效果

- *Transition*：动画效果，参见作业六的源代码即可。
- *Drag*：拖动效果：[Ref: d3-drag](https://github.com/d3/d3-drag/blob/master/README.md#drag)

```javascript
// 拖动函数
function drag_elm(event) {
    // 通过d3.event来获取鼠标位置
    // let x = d3.pointer(event)[0]
    // let y = d3.pointer(event)[1]
    d3.select(this)
        .raise()
        .attr("x", event.x)
        .attr("y", event.y)
    // console.log(this)
}

// 创建拖动事件，绑定动作监听函数
let drag = d3.drag()
    // .on("start", () => {})
    .on("start", function (d) {console.log("Drag start...")})
    // .on("end", () => {})
    .on("end", function (d) {console.log("Drag end!")})
    .on("drag", drag_elm)

// 手动调用call，并将drag作为第一个参数，以将拖动事件绑定到特定的元素上
svg.append("rect")
        .attr("width", width / 20)
        .attr("height", height / 20)
        .attr("fill", function (d, i) {return color_scale(i)})
				.call(drag);
```

​	特别需要注意的是，需要根据不同元素的位置关键词（如 *x*、*y* 或 *cx*、*cy*）来定制拖动函数。

​	例如，要想整体移动图表，就应该使用`.attr("transform")`来改变整体的位置：

```javascript
// 拖动函数
function drag_elm(event) {
  	let ori_transform_x = width / 5
		let ori_transform_y = height / 5
    d3.select(this)
    		.raise()
        .attr("transform", `translate(${event.x - ori_transform_x}, ${event.y - ori_transform_y})`)
				// .attr("x", event.x)
				// .attr("y", event.y)
}

// 创建拖动事件，绑定动作监听函数
let drag = d3.drag()
		.on("start", function (d) {console.log("Drag start...")})
    .on("end", function (d) {console.log("Drag end!")})
    .on("drag", drag_elm)
        
let pie_chart = svg.append("g")
		.attr("transform", `translate(${(width / 5)}, ${(height / 5)})`);

// 手动调用call，并将drag作为第一个参数，以将拖动事件绑定到特定的元素上
pie_chart.call(drag);
```

​		注意，`.call`的调用位置也有讲究。

- *Zoom*：缩放效果。

  - 最简单的缩放实现：

  ```javascript
  // 设置Zoom效果
  let zoom = d3.zoom()
  		.on("zoom", function (event) {
      svg.attr("transform", event.transform)
  });
  // 绑定事件
  svg.call(zoom);
  ```

  ​	然而，上述实现会将整个 *svg* 放大，并不能实现在窗口内仅放大图表内容，即 *pie_chart* 的功能。因此需要修改为：

  ```javascript
  // 设置Zoom效果
  let zoom = d3.zoom()
  		.on("zoom", function (event) {
      pie_chart.attr("transform", event.transform)
  });
  // 绑定事件
  svg.call(zoom);
  ```

  ​	注意，上述绑定事件时仍使用 *svg* 进行绑定的原因是增大判定面积。

  - *Brush*：区域选中效果，常用于平行坐标、散点图、折线图的数据筛选。

- ***Java Script* 的数字数组排序**：

  ```javascript
  tmp_arr.sort(function(a, b) {return a - b});
  ```

  注意：直接 *.sort()* 会将 *12* 排在 *4* 前面！

