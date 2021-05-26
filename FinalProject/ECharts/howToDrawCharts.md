动态折线图：

选取一个城市，分各种污染物，展示其一段时期的污染物变化趋势，最好指出时间缩放功能。

需要将数据组织成这样的json文件形式：

```json
[['pollution1', 'pollution2', 'pollution3', 'date'],
[data, data, data, date],
[data, data, data, date]]
```

对每一个城市都要如此处理。

或者处理成实例的形式？这样就不用太多修改源码，如下：

```json
['pollution_type', 'date','relative_value'],
['pollution1', 'date',value],
['pollution2', 'date',value]
```

取前六个维度就好，表示六种污染物。

- 对date要做好处理，比如年，月，还是简单一点，就日好了。
- 对pollution要做归一化，这样才好展示在一张图上。
- 转换为json格式。

雷达图：

选取一个城市，雷达图的各维度为各种污染物，可以选择具体的时间，甚至可以把一段时期的污染物雷达图重叠在一张图上。