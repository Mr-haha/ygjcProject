/* 2017-12-4 15:31:54 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 300,
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
        var url = this.config.data || 'sheng.json';
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
    showGeoJson: function (data) {
        var $this = this;
        var layerGeoJson = L.geoJson(data, {
            style: function (feature) {
                //return {
                //    weight: 0, 
                //    fillOpacity: 0.01,
                //    fillColor: '#000000'
                //};

                var color = feature.properties.color;
                if (color == null) { 
                    color = "#FEB24C";// haoutil.color.random();
                    feature.properties.color = color;
                }
     
                return {
                    weight: 1, 
                    color: 'white',
                    fillOpacity: 0.4,
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
                        $this.viewWindow.showTip(layer.feature.properties);
                    },
                    mouseout: function (e) {
                        layerGeoJson.resetStyle(e.target);
                    },
                    click: function (e) {
                        var layer = e.target; 
                        //showClickItem(layer.feature.properties);
                        map.fitBounds(e.target.getBounds());
                    }
                });
            }
        }).addTo(map);
        map.fitBounds(layerGeoJson.getBounds());

        this.layerWork = layerGeoJson;
    }




}));

