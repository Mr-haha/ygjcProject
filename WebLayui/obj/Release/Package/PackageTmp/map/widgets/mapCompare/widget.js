/* 2017-11-16 14:40:45 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        resources: [
            'view.css',
        ],
        //直接添加到index
        view: {
            type: "append",
            url: 'view.html',
            parent: 'body'
        },
    },
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        var $this = this;
        $("#btn_mapCompare_sp").click(function () {
            $("#centerDiv").css({
                height: "100%",
                width: "50%"
            });
            $("#centerDivEx").css({
                top: "0px",
                bottom: "0px",
                right: "0px",
                height: "100%",
                width: "50%"
            });
            $this.invalidateSize();
            $this.mapEx.invalidateSize(false);
        });
        $("#btn_mapCompare_cz").click(function () {
            $("#centerDiv").css({
                height: "50%",
                width: "100%"
            });
            $("#centerDivEx").css({
                top: "50%",
                bottom: "0px",
                right: "0px",
                height: "50%",
                width: "100%"
            });
            $this.invalidateSize();
            $this.mapEx.invalidateSize(false);
        });

        $("#btn_mapCompare_close").click(function () {
            $this.disableBase();
        });
    },
    mapEx: null,
    //激活插件
    activate: function () {
        var inhtml = '<div id="centerDivEx" style="position:absolute;right:0px;top:0px;border:1px solid #ccc;top: 0px;bottom: 0px;width:50%;overflow: hidden;">'
            + '<div id="mapEx" style="height:100%;width:100%;overflow: hidden;"></div>'
            + '</div>';
        $("body").append(inhtml);

        $("#centerDiv").css({
            position: "absolute",
            height: "100%",
            width: "50%"
        });
        this.invalidateSize();

        var configdata = this.map.gisdata.config;

        this.mapEx = L.mars.createMap({
            id: "mapEx",
            data: configdata
        });

        for (var i in this.mapEx.gisdata.baselayers) {
            var item = this.mapEx.gisdata.baselayers[i];

            if (item.config.visible) continue;
            if (item.config.crs == null || item.config.crs == configdata.crs) {
                this.mapEx.addLayer(item);
                break;
            }
        }

        if (!this.mapEx.gisdata.controls.layer) {
            L.control.layers(this.mapEx.gisdata.baselayers, this.mapEx.gisdata.overlayers, { position: "topleft" }).addTo(this.mapEx);
        } if (!this.map.gisdata.controls.layer) {
            L.control.layers(this.map.gisdata.baselayers, this.map.gisdata.overlayers, { position: "topleft" }).addTo(this.map);//增加 map layer control  熊鹏波
        }


        this.map.on("drag", this._map_extentChangeHandler, this);
        this.map.on("zoomend", this._map_extentChangeHandler, this);

        this.mapEx.on("drag", this._mapEx_extentChangeHandler, this);
        this.mapEx.on("zoomend", this._mapEx_extentChangeHandler, this);

        this._map_extentChangeHandler();
    },
    //释放插件
    disable: function () {
        this.map.off("drag", this._map_extentChangeHandler, this);
        this.map.off("zoomend", this.map_extentChangeDTDBHandler, this);

        this.mapEx.off("drag", this._mapEx_extentChangeHandler, this);
        this.mapEx.off("zoomend", this.map1_extentChangeDTDBHandler, this);

        $("#centerDivEx").remove();
        $("#btnMapComType").remove();
        map._controlContainer.getElementsByClassName("leaflet-control-layers leaflet-control")[0].remove();//移除map layer control 熊鹏波


        $("#centerDiv").css({
            position: "",
            height: "100%",
            width: "100%"
        });
        this.invalidateSize();
    },
    invalidateSize: function () {
        var map = this.map;
        setTimeout(function () {
            map.invalidateSize(false);
        }, 100);
    },
    _map_extentChangeHandler: function (e) {
        this.map.stop();
        this.mapEx.stop();
        this.mapEx.setView(this.map.getCenter(), this.map.getZoom());
    },
    _mapEx_extentChangeHandler: function (e) {
        this.map.stop();
        this.mapEx.stop();
        this.map.setView(this.mapEx.getCenter(), this.mapEx.getZoom());
    }



}));