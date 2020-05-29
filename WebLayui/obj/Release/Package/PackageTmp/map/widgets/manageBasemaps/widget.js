/* 2017-10-26 11:30:57 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 190,
                height: 160
            }
        }
    },

    //初始化[仅执行1次]
    create: function () {
        var index = 0;
        var basemapsCfg = this.getBasemaps();
        for (var i = 0; i < basemapsCfg.length; i++) {
            var item = basemapsCfg[i];

            if (item.name == null || item.name == '' || item._layer == null)
                continue;
            index++;
        }

        if (index < 7) {
            this.options.view.windowOptions = {
                width: 190,
                height: Math.ceil(index / 2) * 100 + 60
            }
        }
        else {
            this.options.view.windowOptions = {
                width: 360,
                height: Math.ceil(index / 4) * 105 + 60
            }
        }
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        //地图图层添加移除监听，自动勾选
        //map.on("layeradd", this._map_layeraddremoveHnadler, this);
        //map.on("layerremove", this._map_layeraddremoveHnadler, this);

    },
    //关闭释放
    disable: function () {
        //map.off("layeradd", this._map_layeraddremoveHnadler, this);
        //map.off("layerremove", this._map_layeraddremoveHnadler, this);
    },
    //_map_layeraddremoveHnadler: function (e) {
    //    var layer = e.layer;
    //    if (layer.config && layer.config.name) {
    //        this.viewWindow.updateCheckd(layer.config.name, (e.type == 'layeradd'));
    //    }
    //},
    getBasemaps: function () {
        return this.map.gisdata.config.basemaps;
    },
    getLayerVisible: function (layer) {
        return this.map.hasLayer(layer);
    },
    //树节点变化后调用
    updateLayerVisible: function (layer, visible) {
        if (layer.config.crs != null && this.map.gisdata.config.crs != layer.config.crs) {
            var center = this.map.convert2wgs(this.map.getCenter());
            var bounds = center[0] + "," + center[1] + "," + this.map.getZoom();

            var lasturl = window.location.href;
            if (lasturl.lastIndexOf('#') != -1) {
                lasturl = lasturl.replace(window.location.hash, "").replace("#", "");
            }
            var idx = lasturl.lastIndexOf('?');
            if (idx != -1) {
                lasturl = lasturl.substring(0, idx);
            }
            this.map.remove();

            var url = lasturl + "?center=" + bounds + "&baselayer=" + layer.config.name;
            var req = haoutil.system.getRequest();
            for (var key in req) {
                if (key == "center" || key == "baselayer") continue;
                url += "&" + key + "=" + req[key];
            }

            window.location.href = url;
            return;
        }


        if (visible) {
            this.map.addLayer(layer);
            this.map.fire("baselayerchange", { layer: layer });
        }
        else
            this.map.removeLayer(layer);
    }






}));

