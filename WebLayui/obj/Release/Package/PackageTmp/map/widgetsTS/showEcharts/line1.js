/* 2017-12-4 15:31:24 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
       
    },
    layerWork: null,
    //初始化[仅执行1次]
    create: function () {
        
  
    },
    //打开激活
    activate: function () {
        map.setView([33.652, 107.661], 4);

        map.changeBaseMap(1);
         
        this.showData(); 
    }, 
    //关闭释放
    disable: function () {
        map.changeBaseMap(0);

        map.removeLayer(this.layerWork); 
        this.layerWork = null;
    },
 
    showData: function (data) {
        var option = this.getOption(data);
        if (this.layerWork == null) {
            this.layerWork = L.flowEcharts(option).addTo(map);
        }
        else {
            this.layerWork._echartsOption = option;
            this.layerWork.redraw();
        }
    },

    //当前页面业务相关
    getOption: function (data) {

        var allData = {
            "citys": [{
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u8087\u5e86",
                "value": [112.47, 23.05, 2],
                "symbolSize": 1
            }, {
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u5fb7\u9633",
                "value": [104.38, 31.13, 2],
                "symbolSize": 1
            }, {
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u8861\u9633",
                "value": [112.57, 26.9, 2],
                "symbolSize": 1
            }, {
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u6069\u65bd",
                "value": [109.47, 30.3, 2],
                "symbolSize": 1
            }, {
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u54b8\u9633",
                "value": [108.7, 34.33, 2],
                "symbolSize": 1.0
            }, {
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u8302\u540d",
                "value": [110.92, 21.67, 2],
                "symbolSize": 1
            }, {
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u91cd\u5e86",
                "value": [106.55, 29.57, 2],
                "symbolSize": 8.0
            }, {
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u6b66\u6c49",
                "value": [114.3, 30.6, 2],
                "symbolSize": 11.0
            }, {
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u6c88\u9633",
                "value": [123.43, 41.8, 2],
                "symbolSize": 1
            }, {
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u6d77\u53e3",
                "value": [110.32, 20.03, 2],
                "symbolSize": 1
            }, {
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u4e0a\u6d77",
                "value": [121.47, 31.23, 2],
                "symbolSize": 5.0
            }, {
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u5e7f\u5dde",
                "value": [113.5107, 23.2196, 2],
                "symbolSize": 5.0
            }, {
                "itemStyle": {
                    "normal": {
                        "color": "#58B3CC"
                    }
                },
                "name": "\u8346\u95e8",
                "value": [112.2, 31.03, 2],
                "symbolSize": 1
            }],
            "movelines": [{
                "toName": "\u91cd\u5e86",
                "fromName": "\u54b8\u9633",
                "coords": [
                    [108.7, 34.33],
                    [106.55, 29.57]
                ]
            }, {
                "toName": "\u4e0a\u6d77",
                "fromName": "\u91cd\u5e86",
                "coords": [
                    [106.55, 29.57],
                    [121.47, 31.23]
                ]
            }, {
                "toName": "\u91cd\u5e86",
                "fromName": "\u6b66\u6c49",
                "coords": [
                    [114.3, 30.6],
                    [106.55, 29.57]
                ]
            }, {
                "toName": "\u5fb7\u9633",
                "fromName": "\u6b66\u6c49",
                "coords": [
                    [114.3, 30.6],
                    [104.38, 31.13]
                ]
            }, {
                "toName": "\u4e0a\u6d77",
                "fromName": "\u6b66\u6c49",
                "coords": [
                    [114.3, 30.6],
                    [121.47, 31.23]
                ]
            }, {
                "toName": "\u8087\u5e86",
                "fromName": "\u4e0a\u6d77",
                "coords": [
                    [121.47, 31.23],
                    [112.47, 23.05]
                ]
            }, {
                "toName": "\u8861\u9633",
                "fromName": "\u4e0a\u6d77",
                "coords": [
                    [121.47, 31.23],
                    [112.57, 26.9]
                ]
            }, {
                "toName": "\u6069\u65bd",
                "fromName": "\u4e0a\u6d77",
                "coords": [
                    [121.47, 31.23],
                    [109.47, 30.3]
                ]
            }, {
                "toName": "\u8302\u540d",
                "fromName": "\u4e0a\u6d77",
                "coords": [
                    [121.47, 31.23],
                    [110.92, 21.67]
                ]
            }, {
                "toName": "\u6b66\u6c49",
                "fromName": "\u4e0a\u6d77",
                "coords": [
                    [121.47, 31.23],
                    [114.3, 30.6]
                ]
            }, {
                "toName": "\u6d77\u53e3",
                "fromName": "\u4e0a\u6d77",
                "coords": [
                    [121.47, 31.23],
                    [110.32, 20.03]
                ]
            }, {
                "toName": "\u5e7f\u5dde",
                "fromName": "\u4e0a\u6d77",
                "coords": [
                    [121.47, 31.23],
                    [113.5107, 23.2196]
                ]
            }, {
                "toName": "\u8346\u95e8",
                "fromName": "\u4e0a\u6d77",
                "coords": [
                    [121.47, 31.23],
                    [112.2, 31.03]
                ]
            }, {
                "toName": "\u4e0a\u6d77",
                "fromName": "\u5e7f\u5dde",
                "coords": [
                    [113.5107, 23.2196],
                    [121.47, 31.23]
                ]
            }, {
                "toName": "\u6c88\u9633",
                "fromName": "\u5e7f\u5dde",
                "coords": [
                    [113.5107, 23.2196],
                    [123.43, 41.8]
                ]
            }]
        }
        option = {
            backgroundColor: 'rgba(17, 19, 42, 0.4)',
            title: {
                text: '安吉物流运输图',
                left: 'center',
                textStyle: {
                    color: '#fff'
                }
            },
            legend: {
                show: false,
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data: ['地点', '线路'],
                textStyle: {
                    color: '#fff'
                }
            },
            geo: {
                map: '',
                roam: true
            },
            series: [{
                name: '地点',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    emphasis: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: 2,
                showEffectOn: 'render',
                itemStyle: {
                    normal: {
                        color: '#46bee9'
                    }
                },
                data: allData.citys
            }, {
                name: '线路',
                type: 'lines',
                coordinateSystem: 'geo',
                zlevel: 2,
                large: true,
                effect: {
                    show: true,
                    constantSpeed: 30,
                    symbol: 'pin',
                    symbolSize: 4,
                    trailLength: 0,
                },
                lineStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#58B3CC'
                        }, {
                            offset: 1,
                            color: '#F58158'
                        }], false),
                        width: 1.5,
                        opacity: 0.4,
                        curveness: 0.1
                    }
                },
                data: allData.movelines
            }]
        };
        return option;
    }




}));