/* 2017-12-4 15:31:25 | 修改 木遥（QQ：346819890） */
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
        map.setView([30.652, 107.661], 5);
        map.changeBaseMap(1);

        var $this = this;
        $.ajax({
            url: this.path + 'data/weibo.json',
            type: "GET",
            dataType: 'json',
            success: function (weiboData) {
                if (!$this.isActivate) return;

                weiboData = weiboData.map(function (serieData, idx) {
                    var px = serieData[0] / 1000;
                    var py = serieData[1] / 1000;
                    var res = [[px, py]];

                    for (var i = 2; i < serieData.length; i += 2) {
                        var dx = serieData[i] / 1000;
                        var dy = serieData[i + 1] / 1000;
                        var x = px + dx;
                        var y = py + dy;
                        res.push([x.toFixed(2), y.toFixed(2), 1]);

                        px = x;
                        py = y;
                    }
                    return res;
                });

                $this.showData(weiboData);
            }
        });
    },
    //关闭释放
    disable: function () {
        map.removeLayer(this.layerWork);
        map.changeBaseMap(0);
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
    getOption: function (weiboData) {

        option = {
            backgroundColor: 'rgba(17, 19, 42, 0.4)',
            title: {
                text: '人口数据',
                left: 'center',
                top: 'top',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {},
            legend: {
                left: 'right',
                data: ['强', '弱'],
                textStyle: {
                    color: '#ccc'
                }
            },
            geo: {
                map: '',
                roam: true
            },
            series: [{
                name: '弱',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbolSize: 1,
                large: true,
                itemStyle: {
                    normal: {
                        shadowBlur: 2,
                        shadowColor: 'rgba(14, 241, 242, 0.8)',
                        color: 'rgba(14, 241, 242, 0.8)'
                    }
                },
                data: weiboData[0]
            }, {
                name: '强',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbolSize: 1,
                large: true,
                itemStyle: {
                    normal: {
                        shadowBlur: 2,
                        shadowColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                data: weiboData[1]
            }]
        }
        return option;
    }






}));