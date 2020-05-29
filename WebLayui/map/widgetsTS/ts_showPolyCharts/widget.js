/* 2017-12-4 15:31:53 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: { 
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 400,
                height: 280,
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
    addLayer: function (geojson, selectData) {
        if (!this.isActivate) return;

        this.featureCollection = geojson;
        this.selectData = selectData;
        this.addLegend();
          
        var $this = this;
        if (this.layerWork == null) {
            this.layerWork = L.geoJson(this.featureCollection, {
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

                            $this.viewWindow.showTip(layer.feature.properties.shortname);
                        },
                        mouseout: function (e) {
                            var layer = e.target;
                            $this.layerWork.resetStyle(layer);

                            $this.viewWindow.hideTip(layer.feature.properties.shortname);
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
            this.layerWork.addData(this.featureCollection);
        }
       
        map.flyToBounds(this.layerWork.getBounds());
    },
    //外部激活，显示区域的tip
    showPolyTip: function (name) { 
        var layers = this.layerWork.getLayers();
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.feature.properties.shortname == name) {
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
            if (layer.feature.properties.shortname == name) {
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
        var colors = this.viewWindow.colors;
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