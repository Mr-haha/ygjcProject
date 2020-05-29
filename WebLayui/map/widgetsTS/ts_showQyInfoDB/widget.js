/* 2017-12-4 15:31:54 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 600,
                height: 300,
            }
        },
    },
    //初始化[仅执行1次]
    create: function () {

    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        var $this = this;
        var url = this.config.data || 'shi.json';
        $.getJSON(this.path + "data/" + url, function (data) {
            if (!$this.isActivate) return;
            $this.showGeoJson(data);
        });

    },
    //关闭释放
    disable: function () {

        if (this.layerWork) {
            map.removeLayer(this.layerWork);
            this.layerWork = null;
        }
    },
    layerWork: null,
    arrSelect: [],
    arrSelectName: [],
    _color_def: '#FED976',
    _color_select: '#BD0026',
    showGeoJson: function (data) {
        if (!this.isActivate) return;

        var $this = this;
        var layerGeoJson = L.geoJson(data, {
            style: function (feature) { 
                var color = feature.properties.color;
                if (color == null) {
                    color = $this._color_def;
                    feature.properties.color = color; 
                }

                return {
                    weight: 1,
                    color: 'white',
                    fillOpacity: 0.6,
                    fillColor: color
                };
            },
            onEachFeature: function (feature, layer) {
                var attr = feature.properties;

                var html = "<div><h5>" + attr.name + "</h5></div>";
                layer.bindTooltip(html);

                layer.on({
                    mouseover: function (e) {
                        var layer = e.target;
                        layer.setStyle({
                            weight: 2,
                            color: '#666',
                            dashArray: '',
                            fillOpacity: 0.5
                        });
                        if (!L.Browser.ie && !L.Browser.opera) {
                            layer.bringToFront();
                        }
                        //$this.viewWindow.showTip(layer.feature.properties);
                    },
                    mouseout: function (e) {
                        layerGeoJson.resetStyle(e.target);
                    },
                    click: function (e) {
                        var layer = e.target;
                        var select = layer.feature.properties.select;
                        var id = layer.feature.properties.id;
                        var name = layer.feature.properties.name;
                        if (select) {
                            layer.feature.properties.select = false;
                            feature.properties.color = $this._color_def;
                            $this.arrSelect.remove(id);
                            $this.arrSelectName.remove(name);
                        }
                        else {
                            layer.feature.properties.select = true;
                            feature.properties.color = $this._color_select;
                            $this.arrSelect.push(id);
                            $this.arrSelectName.push(name);
                        }
                        layerGeoJson.resetStyle(e.target);
                         
                        $this.viewWindow.changeSelect($this.arrSelect, $this.arrSelectName);
                    }
                });
            }
        }).addTo(map);
        map.fitBounds(layerGeoJson.getBounds());

        this.layerWork = layerGeoJson;
    } 




}));

