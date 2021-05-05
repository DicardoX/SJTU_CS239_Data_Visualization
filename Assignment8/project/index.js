let Event = require('bcore/event');
let $ = require('jquery');
let _ = require('lodash');
let { Scatter } = require('datav-g2plot-adaptor');

/**
 * 马良基础类
 */
module.exports = Event.extend(function Base(container, config) {
    this.config = {
        theme: {}
    }
    this.container = $(container);           //容器
    this.apis = config.apis;                 //hook一定要有
    this._data = null;                       //数据
    this.chart = null;                       //图表
    this.init(config);
}, {
  /**
   * 公有初始化
   */
    init: function (config) {
        // 1.初始化,合并配置
        this.mergeConfig(config);
        // 2.刷新布局,针对有子组件的组件 可有可无
        this.updateLayout();
        // 3.子组件实例化
        this.chart = new Scatter(this.container[0], {
            appendPadding: 10,
            data: [],
            xField: 'x',
            yField: 'y',
            shape: 'circle',
            colorField: 'colorField',
            size: 4,
            yAxis: {
                title: {
                text: 'Comments',
                },
                nice: true,
                line: {
                    style: {
                        stroke: '#aaa',
                    },
                },
            },
            xAxis: {
                title: {
                    text: 'Views',
                },
                min: -100,
                grid: {
                    line: {
                        style: {
                            stroke: '#eee',
                        },
                    },
                },
                line: {
                    style: {
                        stroke: '#aaa',
                    },
                },
            },
        });
        //4.如果有需要, 更新样式
        this.updateStyle();
        this.chart.render();
    },
    /**
    * 绘制
    * @param data
    * @param options 不一定有
    * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
    */
    render: function (data, config) {
        data = this.data(data);
        // var cfg = this.mergeConfig(config);
        //更新图表
        this.chart.changeData(data);
        // this.container.html(data[0].value)
        //如果有需要的话,更新样式
        this.updateStyle();
    },
    /**
     *
     * @param width
     * @param height
     */
    resize: function (width, height) {
        this.updateLayout(width, height);
        //更新图表
        //this.chart.render({
        //  width: width,
        //  height: height
        //})
    },

    /**
     * 每个组件根据自身需要,从主题中获取颜色 覆盖到自身配置的颜色中.
     * 暂时可以不填内容
     */
    setColors: function () {
        //比如
        // var cfg = this.config;
        // cfg.color = "#000";
    },
    /**
     * 数据,设置和获取数据
     * @param data
     * @returns {*|number}
     */
    data: function (data) {
        if (data) {
            this._data = data;
        }
        return this._data;
    },
    /**
     * 更新配置
     * 优先级: config.colors > config.theme > this.config.theme > this.config.colors
     * [注] 有数组的配置一定要替换
     * @param config
     * @private
     */
    mergeConfig: function (config) {
        if (!config) {
            return this.config
        }
        this.config.theme = _.defaultsDeep(config.theme || {}, this.config.theme);
        this.setColors();
        this.config = _.defaultsDeep(config || {}, this.config);
        return this.config;
    },
    /**
     * 更新布局
     * 可有可无
     */
    updateLayout: function () {},
    /**
     * 更新样式
     * 有些子组件控制不到的,但是需要控制改变的,在这里实现
     */
    updateStyle: function () {
        var cfg = this.config;
        this.container.css({
            'font-size': cfg.size + 'px',
            'color': cfg.color || '#fff'
        });
    },
    /**
     * 更新配置
     * !!注意:如果render支持第二个参数options, 那updateOptions不是必须的
     */
    updateOptions: function (config) {
      this.chart.update(
        {
          pointStyle: {
            stroke: config.options.graph.stroke.lineColor,
            lineWidth: config.options.graph.stroke.lineWidth,
            lineDash: config.options.graph.stroke.lineDash
          },
          size: config.options.graph.size,
          color: config.options.graph.color
          
          
        }
      );
      
    },
    /**
     * 更新某些配置
     * 给可以增量更新配置的组件用
     */
    //updateXXX: function () {},
    /**
     * 销毁组件
     */
     destroy: function() {
         console.log('请实现 destroy 方法')
     }
});