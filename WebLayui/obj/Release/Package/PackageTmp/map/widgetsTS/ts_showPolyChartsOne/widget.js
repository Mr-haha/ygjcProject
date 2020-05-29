/* 2017-12-4 15:31:54 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 400,
                height: 220,
            }
        }
    },
    layerWork: null,
    //初始化[仅执行1次]
    create: function () {
        var resources = [
            this.path + 'legend.css',
        ];
        Loader.sync(resources);
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {

        var $this = this;
        $.getJSON(this.path + "config.json", function (data) {
            if (!$this.isActivate) return;

            featureCollection = { "type": "FeatureCollection", "features": data.features };

            var arrdata = [
                   { "id": "430100", "value": 4987 },
                   { "id": "430200", "value": 2455 },
                   { "id": "430300", "value": 1235 },
                   { "id": "430400", "value": 4532 },
                   { "id": "430500", "value": 435 },
                   { "id": "430600", "value": 1234 },
                   { "id": "430700", "value": 1543 },
                   { "id": "430800", "value": 2419 },
                   { "id": "430900", "value": 1235 },
                   { "id": "431000", "value": 1123 },
                   { "id": "431100", "value": 214 },
                   { "id": "431200", "value": 421 },
                   { "id": "431300", "value": 200 },
                   { "id": "433100", "value": 3653 }
            ];

            $this.initData(featureCollection, arrdata);
        });

    },

    colors: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'],
    getColor: function (num) {
        var span = this.selectData.span;
        var length = span.length + 1;
        if (length > this.colors.length)
            length = this.colors.length;

        for (var k = 0; k < length; k++) {
            if (num < span[k]) {
                return this.colors[k];
            }
        }
        return this.colors[length - 1];
    },
    selectData: {
        "title": "风险源",
        "unit": "个",
        "span": [251, 1095, 1656, 2417, 2506, 5235]
    },
    initData: function (featureCollection, arrdata) {
        var echarsName = [];
        var echarsValue = [];
        for (var i = 0; i < featureCollection.features.length; i++) {
            var feature = featureCollection.features[i];
            feature.properties.num = 0;
            for (var j = 0; j < arrdata.length; j++) {
                if (feature.properties.id == arrdata[j].id) {
                    //测试数据，用于每年数据动态不一样。
                    var random = +Math.floor(Math.random() * this.selectData.span[0]);

                    feature.properties.num = arrdata[j].value + random;
                    break;
                }
            }
            feature.properties.color = this.getColor(feature.properties.num);

            echarsName.push(feature.properties.name);
            echarsValue.push(feature.properties.num);
        }
        this.viewWindow.updateData(this.selectData, echarsName, echarsValue); 
        this.addLayer(featureCollection); 
    },
    //关闭释放
    disable: function () {
        if (this.layerWork) {
            map.removeLayer(this.layerWork);
            this.layerWork = null;
        }
        if (document.getElementById('legendContainer')) {
            $('#legendContainer').remove();
        }
    },
    addLayer: function (featureCollection) { 
        this.addLegend();

        var $this = this;
        if (this.layerWork == null) {
            this.layerWork = L.geoJson(featureCollection, {
                style: function (feature) {
                    return {
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.7,
                        fillColor: feature.properties.color
                    };
                },
                onEachFeature: function (feature, layer) {
                    var attr = feature.properties;

                    var html = "<div><h5>" + attr.name + "</h5><span>" +
                        $this.selectData.title + "&nbsp;:&nbsp;" + attr.num + $this.selectData.unit + "</span></div>";
                    layer.bindTooltip(html);

                    layer.on({
                        mouseover: function (e) {
                            var layer = e.target;

                            layer.setStyle({
                                weight: 3,
                                color: '#666',
                                fillOpacity: 0.7
                            });

                            if (!L.Browser.ie && !L.Browser.opera) {
                                layer.bringToFront();
                            }

                            $this.viewWindow.showTip(layer.feature.properties.name);
                        },
                        mouseout: function (e) {
                            var layer = e.target;
                            $this.layerWork.resetStyle(layer);

                            $this.viewWindow.hideTip(layer.feature.properties.name);
                        },
                        click: function (e) {
                            map.fitBounds(e.target.getBounds());
                        }
                    });
                }
            });
            map.addLayer(this.layerWork);
        }
        else {
            this.layerWork.clearLayers();
            this.layerWork.addData(featureCollection);
        }

        map.flyToBounds(this.layerWork.getBounds());
    },
    //外部激活，显示区域的tip
    showPolyTip: function (name) {
        var layers = this.layerWork.getLayers();
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.feature.properties.name == name) {
                layer.setStyle({
                    weight: 3,
                    color: '#666',
                    fillOpacity: 0.7
                });
                layer.openTooltip();
                break;
            }
        }
    },
    hidePolyTip: function (name) {
        var layers = this.layerWork.getLayers();
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.feature.properties.name == name) {
                this.layerWork.resetStyle(layer);
                layer.closeTooltip();
                break;
            }
        }
    },
    addLegend: function () {
        var container = null;
        if (document.getElementById('legendContainer')) {
            container = $('#legendContainer');
        } else {
            container = $('<div id="legendContainer" class="legend-container"></div>').appendTo($(document.body));
        }

        var strHtml = "<div class='legend-title'>" + this.selectData.title + "(" + this.selectData.unit + ")</div>";

        var span = this.selectData.span;
        var colors = this.colors;
        var length = span.length;
        if (length > colors.length)
            length = colors.length;

        for (var i = 0; i <= length; i++) {
            var label = span[i];

            if (i == 0) {
                label = "小于" + span[i];
            }
            else if (i == length) {
                label = "大于" + span[i - 1];
            }
            else {
                label = span[i - 1] + "-" + span[i];
            }

            strHtml += "<div class='legend-item'><span class='legend-color' style='background:"
                + colors[i] + "'></span><span class='legend-des'>" + label + "</span></div>";
        }
        $(container).html(strHtml);
    },





}));