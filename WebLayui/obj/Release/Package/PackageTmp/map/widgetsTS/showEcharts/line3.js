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
         
        var geoCoorddata = {
            '武汉': [114.30539299999998, 30.593099],
            '深圳': [114.05786499999999, 22.543096],
            '北京': [116.40739499999995, 39.904211],
            '阿克苏': [80.26338699999997, 41.167548]
        };

        this.showData(geoCoorddata);
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
    getOption: function (geoCoorddata) {

        var option = {
            backgroundColor: 'rgba(17, 19, 42, 0.4)',
            geo: {
                map: '',
                roam: true,
            },
            series: [{
                type: 'lines',
                coordinateSystem: 'geo',
                zlevel: 1,
                data: [{
                    name: '武汉',
                    toname: '北京',
                    coords: [geoCoorddata['武汉'], geoCoorddata['北京']]
                }, {
                    name: '深圳',
                    toname: '北京',
                    coords: [geoCoorddata['深圳'], geoCoorddata['北京']]
                }, {
                    name: '阿克苏',
                    toname: '北京',
                    coords: [geoCoorddata['阿克苏'], geoCoorddata['北京']]
                }],
                //线上面的动态特效
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#fff',
                    symbolSize: 4
                },
                lineStyle: {
                    normal: {
                        width: '',
                        color: '#a6c84c',
                        curveness: 0.2
                    }
                }
            }, {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 3,
                data: [{
                    name: '北京',
                    value: geoCoorddata['北京'].concat(200)
                }, ],
                rippleEffect: {
                    period: 10,
                    scale: 5,
                    brushType: 'fill'
                },
            }]
        };
        return option;
    }




}));