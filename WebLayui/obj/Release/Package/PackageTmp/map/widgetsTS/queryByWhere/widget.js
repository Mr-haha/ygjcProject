/* 2017-12-4 15:31:23 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 470,
                height: 460
            }
        }
    },

    workDraw: null,
    layerDraw: null,
    layerWork: null,
    layerPoly: null,
    //初始化[仅执行1次]
    create: function () {
        this.layerWork = L.markerClusterGroup({
            chunkedLoading: true,
            polygonOptions: { weight: 1, color: '#03f', opacity: 0.5, fillOpacity: 0.1 },
            disableClusteringAtZoom: 16  //此级别下不聚合
        });
        this.layerPoly = L.featureGroup([]);


        this.workDraw = new L.mars.Draw({
            map: map,
            isOnly: true,
            style: { color: '#ff0000', weight: 2 },
            onEvnet: false,
        });
        this.layerDraw = this.workDraw.getLayer();

    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //激活插件
    activate: function () {
        this.workDraw.onEvnet();

        map.addLayer(this.layerWork);
        map.addLayer(this.layerPoly);
        map.addLayer(this.layerDraw);
    },
    //释放插件
    disable: function () {
        this.clearShowFeature();
        this.clearDraw();

        map.removeLayer(this.layerWork);
        map.removeLayer(this.layerPoly);
        map.removeLayer(this.layerDraw);

        this.workDraw.destroy();
    },
    clearDraw: function () {
        this.workDraw.clearDraw();
        this.workDraw.stopDraw();
    },
    drawPolygon: function () {
        this.workDraw.startDraw('polygon');
    },
    hasDraw: function () {
        return this.workDraw.hasDraw();
    },
    //查询后全部显示处理
    clearShowFeature: function () {
        this.layerWork.clearLayers();
        this.layerPoly.clearLayers();
    },

    query: function (param) {
        var query = L.esri.query({
            url: param.url
        });

        if ((param.where != null && param.where.length > 0)) {
            query.where(param.where);
        }

        var polygon;
        if (param.extenttype == "1") {
            //当前视域内
            var polygon = this.workDraw.getDrawLayers();
            query.intersects(map.getBounds());
        }
        else if (param.extenttype == "2") {
            this.workDraw.stopDraw();

            polygon = this.workDraw.getDrawLayers();
            query.intersects(polygon.toGeoJSON());
        }

        var $this = this;

        query.run(function (error, featureCollection, response) {
            param.end();//回调

            if (error != null && error.code > 0) {
                haoutil.alert(error.message, '服务访问出错');
                return;
            }
            if (featureCollection == undefined || featureCollection == null || featureCollection.features.length == 0) {
                haoutil.msg("未找到符合查询条件的要素！")
                return;
            }
            else {
                if (polygon != null)
                    polygon.setStyle({ fill: false });


                //剔除有问题数据 
                var featuresOK = [];
                for (i = 0; i < featureCollection.features.length; i++) {
                    var feature = featureCollection.features[i];
                    if (feature == null || feature.geometry == null
                        || feature.geometry.coordinates == null || feature.geometry.coordinates.length == 0)
                        continue;

                    featuresOK.push(feature);
                }
                featureCollection.features = featuresOK;

                $this.showQueryResult(featureCollection);
            }
        });



    },
    objResultFeature: {},
    showQueryResult: function (featureCollection) {
        this.clearShowFeature();

        var layerResult = L.geoJSON(featureCollection);
        var layers = layerResult.getLayers();

        var arrResultData = [];
        for (var index = 0; index < layers.length; index++) {
            var layer = layers[index];
            var atrr = layer.feature.properties;

            var inhtml = "";
            for (var col in atrr) {
                var showval = $.trim(atrr[col]);
                if (showval == null || showval == '' || showval == '0' || showval.length == 0) continue;

                var item = this.viewWindow.getColumnCfgItem(col);
                if (item == null) continue;

                inhtml += item.name + ":" + showval + "<br/>";
            }
            layer.bindPopup(inhtml);


            atrr.rowID = (index + 1).toString();
            atrr.geotype = layer.feature.geometry.type;
            //atrr.feature = layer;

            //查询后图上显示
            if (layer.feature.geometry.type == "Point") {
                this.layerWork.addLayer(layer);
            } else {
                this.layerPoly.addLayer(layer);
            }
            arrResultData.push(atrr);

            this.objResultFeature[atrr.rowID] = layer;
        };

        this.viewWindow.showResult(arrResultData);
    },
    centerAt: function (rowID) {
        var layer = this.objResultFeature[rowID];
        map.centerAtLayer(layer);

        layer.openPopup();
    }





}));