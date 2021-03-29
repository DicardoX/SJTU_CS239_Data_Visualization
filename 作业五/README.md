# 数据可视化作业五：D3.js可视化库的使用

[D3.js - 快速指南](https://iowiki.com/d3js/d3js_quick_guide.html)

--------

- 注意！在引入本地或动态的d3库时应使用如下语句（type必须要加，且不可以直接是javascript，而应是text/javascript）：

```javascript
<script type="text/javascript" src="../static/JSLib/d3.min.js" charset="utf-8"></script>
```



## 1 可放缩矢量图形SVG (*Scalable Vector Graphics*)

- SVG是一种在网页上呈现图像的方法。 SVG不是直接图像，而只是使用文本创建图像的一种方式。 顾名思义，它是一个**Scalable Vector** 。 它会根据浏览器的大小进行缩放，因此调整浏览器大小不会使图像失真。 除IE 8及更低版本外，所有浏览器均支持SVG。 数据可视化是可视化表示，使用SVG使用D3.js渲染可视化很方便。
- 将SVG视为画布，我们可以在其上绘制不同的形状。 首先，让我们创建一个SVG标记：

```javascript
<svg width = "500" height = "500"></<svg>
```

- svg的默认测量值是像素，因此我们不需要指定单位是否为像素。现在，如果我们想绘制一个矩形，我们可以使用下面的代码绘制它：

```javascript
<svg width = "500" height = "500">
   <rect x = "0" y = "0" width = "300" height = "200"></rect>
</svg>
```

- 我们可以在SVG中绘制其他形状，如直线，圆，椭圆，文本和路径。就像样式化HTML元素一样，样式化SVG元素很简单。 我们将矩形的背景颜色设置为黄色。 为此，我们需要添加一个属性“fill”并将值指定为黄色，如下所示：

```javascript
<svg width = "500" height = "500">
   <rect x = "0" y = "0" width = "300" height = "200" fill = "yellow"></rect>
</svg>
```

------



## 2 Selections in D3.js

- 选择是D3.js的核心概念之一。 它基于CSS选择器。 它允许我们选择网页中的一个或多个元素。 此外，它允许我们修改，追加或删除与预定义数据集相关的元素。 在本章中，我们将了解如何使用选择来创建数据可视化。
- D3.js有助于使用以下两种方法从HTML页面中选择元素：
  - **select()** - 通过匹配给定的CSS选择器，**仅选择一个DOM元素**。 如果给定的CSS选择器有多个元素，则仅选择第一个元素。
  - **selectAll()** - 通过匹配给定的CSS选择器来**选择所有DOM元素**。 如果您熟悉使用jQuery选择元素，则D3.js选择器几乎相同。
- **select()方法**：
  - 可以通过html元素的标记、类名class和ID来访问元素
    - `d3.select("div")`为选择标记
    - `d3.select("#test")`为选择id

