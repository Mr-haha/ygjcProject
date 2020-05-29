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
        map.setView([18.979026, 101.030273], 5);
        map.changeBaseMap(1);

        this.queryServer();
    },
    //关闭释放
    disable: function () {
       map.changeBaseMap(0);

        if (this.layerWork!=null)
            map.removeLayer(this.layerWork);
        this.layerWork = null;
    },
    queryServer: function () {
        var url = 'http://182.92.176.178:6080/arcgis/rest/services/MGDT/MGH/MapServer/14'
        var query = L.esri.query({
            url: url
        });
   
        //query.where('Maj_Area >500000');
        var $this = this;
        query.run(function (error, featureCollection, response) {

            if (error != null && error.code > 0) {
                haoutil.alert(error.message, '服务访问出错');
                return;
            }
            if (featureCollection == undefined || featureCollection == null || featureCollection.features.length == 0) {
                haoutil.msg("未找到符合查询条件的要素！")
                return;
            }
            else {
                $this.showQueryResult(featureCollection);
            }
        });
    },
    showQueryResult: function (featureCollection) {

        var busLines = []; 
        for (i = 0; i < featureCollection.features.length; i++) {
            var feature = featureCollection.features[i];
            if (feature == null || feature.geometry == null
                || feature.geometry.coordinates == null || feature.geometry.coordinates.length == 0)
                continue;
       
            var hStep = 1 / (feature.geometry.coordinates.length); 
            //console.log(i + ',' + hStep);
            busLines.push({
                coords: feature.geometry.coordinates,
                lineStyle: {
                    normal: {
                        color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * i))
                    }
                }
            });
        }

        this.showData(busLines);
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
    getOption: function (busLines) {
        var option = {
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