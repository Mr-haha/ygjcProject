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
        map.setView([39.907, 116.377], 10);
        map.changeBaseMap(1);

        var $this = this;
        $.getJSON(this.path + "data/bjgj.json", function (data) {
            if (!$this.isActivate) return;
            $this.showData(data);
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
    getOption: function (data) {
        var hStep = 300 / (data.length - 1);
        var busLines = [].concat.apply([], data.map(function (busLine, idx) {
            var prevPt;
            var points = [];
            for (var i = 0; i < busLine.length; i += 2) {
                var pt = [busLine[i], busLine[i + 1]];
                if (i > 0) {
                    pt = [
                        prevPt[0] + pt[0],
                        prevPt[1] + pt[1]
                    ];
                }
                prevPt = pt;


                var jd = pt[0] / 1e4;
                var wd = pt[1] / 1e4;

                //百度坐标转高德坐标
                var point = L.mars.pointconvert.bd2gcj([jd, wd]);
                jd = point[0];
                wd = point[1];

                points.push([jd, wd]);
            }
            //console.log(idx + ',' + hStep);
            return {
                coords: points,
                lineStyle: {
                    normal: {
                        color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx))
                    }
                }
            };
        }));

        //console.log(JSON.stringify(busLines));

        option = {
            backgroundColor: 'rgba(17, 19, 42, 0.7)',
            animation: true,
            geo: {
                map: '',
                roam: true
            },
            series: [{
                type: 'lines',
                coordinateSystem: 'geo',
                polyline: true,
                data: busLines,
                silent: true,
                lineStyle: {
                    normal: {
                        // color: '#c23531',
                        // color: 'rgb(200, 35, 45)',
                        opacity: 0.2,
                        width: 1
                    }
                },
                progressiveThreshold: 500,
                progressive: 200
            }, {
                type: 'lines',
                coordinateSystem: 'geo',
                polyline: true,
                data: busLines,
                lineStyle: {
                    normal: {
                        width: 0
                    }
                },
                effect: {
                    constantSpeed: 20,
                    show: true,
                    trailLength: 0.1,
                    symbolSize: 1.5
                },
                zlevel: 1
            }]
        }
        return option;
    }





}));