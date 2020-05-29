//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null, //框架会自动对map赋值
    options: {
        resources: [
            'view.css',
        ],
        //直接添加到index
        view: {
            type: "window",
            url: 'MultiMapCompare.html',
            windowOptions: {
                width: document.body.clientWidth*5/6,  
                //height: window.screen.availHeight * 2.15 / 6,
                height: 300,
                overflow: 'scroll',
                position:'rb'
            }
        }
    },
    EventIsOK: false,
    windowthis:null,
    //初始化[仅执行1次]
    create: function (viewopt) {

    },
    winCreateOK: function (opt, result) {
        debugger
        var dds = this;
        windowthis = result;
    },
   
    //激活插件
    activate: function () {
        debugger
        var that = this;
        if (windowthis.winCreateIsOK) {
            setTimeout(function () {
                that.able();
            }, 200);
        }
    },
    able: function () {
        debugger
        for (var l = 0; l < windowthis.multimaps.length; l++) {
            windowthis.multimaps[l].on("drag", this._mapEx_extentChangeHandler, this);
            windowthis.multimaps[l].on("zoomend", this._mapEx_extentChangeHandler, this);
            var geoLayer = windowthis.multimaps[l]["geoLayer"];
            if (window.parent.flashFeature)
            {
                var cords = window.parent.flashFeature.feature.geometry.coordinates;
                var polygon = L.polygon(this.switchArray(cords, 0, 1));
                debugger
                polygon.setStyle({
                    weight: 1.5,
                    color: 'red',
                    fillOpacity: 0.05,
                    dashArray: '',
                    fillColor: 'gray'
                });
                geoLayer.clearLayers();
                geoLayer.addLayer(polygon);;
            }
        }
        this.EventIsOK = true;
        this._map_extentChangeHandler();
    },
    //释放插件
    disable: function () {
        debugger
        for (var l = 0; l < windowthis.multimaps.length; l++) {
            windowthis.multimaps[l].off("drag", this._mapEx_extentChangeHandler, this);
            windowthis.multimaps[l].off("zoomend", this._mapEx_extentChangeHandler, this);
        }
        debugger
        this.map.off("mousemove", this._map_extentMoveHandler, this);  //清除主地图事件(YHC-20200410，很重要)
        this.map.off("drag", this._map_extentChangeHandler, this);
        this.map.off("zoomend", this._map_extentChangeHandler, this);
        this.EventIsOK = false;
    },
    ///////主地图缩放与拖拽//////
    _map_extentChangeHandler: function (e) {
        if (this.EventIsOK) {
            this.map.stop();
            for (var l = 0; l < windowthis.multimaps.length; l++) {
                windowthis.multimaps[l].stop();
                windowthis.multimaps[l].setView(this.map.getCenter(), this.map.getZoom());
            }
        }
    },
    //////主地图鼠标移动（不点击地图）//////
    _map_extentMoveHandler: function (e) {
        if (this.EventIsOK && e.latlng) {
            for (var l = 0; l < windowthis.multimaps.length; l++) {               
                var _defaultlyr = windowthis.multimaps[l]["defaultlyr"];   //["defaultlyr"]
                var marker = L.marker([e.latlng.lat, e.latlng.lng]);
               
                _defaultlyr.clearLayers();
                _defaultlyr.addLayer(marker);

                //var circle = L.circleMarker([e.latlng.lat, e.latlng.lng], { color: 'red', fillColor: 'gray' }).addTo(windowthis.multimaps[l]);
            }
        }
    },
    ///////小地图缩放与拖拽///////
    _mapEx_extentChangeHandler: function (e) {
        var center = e.target.getCenter();
        var zoom = e.target.getZoom();
        e.target.stop();
        for (var l = 0; l < windowthis.multimaps.length; l++) {
            if (windowthis.multimaps[l] != e.target) {
                windowthis.multimaps[l].stop();
                windowthis.multimaps[l].setView(center, zoom);
            }
        }
        this.map.stop();
        this.map.setView(center, zoom);
    },
        addgeometry: function (geometry, kname, r, g, b, defaultlyr) {
            var geo = "";
            if (geometry["paths"])
                geo = thisfun.Getpolyline_fromarcgis(geometry);
            else if (geometry["rings"])
                geo = thisfun.Getpolygon_fromarcgis(geometry);
            else if (geometry)
                geo = thisfun.Getpoint_fromarcgis(geometry);
            var gp = thisfun.setgeo(geo, kname, "", r, g, b, true, defaultlyr);
            if (geometry["rings"]) {
                gp.setStyle({
                    fillOpacity: 0,
                    dashArray: 3,
                    weight: 3
                });
            } else if (geometry["paths"]) {
                gp.setStyle({
                    dashArray: 3,
                    weight: 3
                });
            }
            return gp;
        },
        switchArray: function (arr, index1, index2) {
            var $this = this;
            var arrswitch = new Object();
            arrswitch = arr;
            var count = 0;
            var zarrtobject = [];
            for (i = 0; i < arrswitch.length; i++) {
                try {
                    var temp = arrswitch[i][index2];
                    if (temp instanceof Array) {

                        var rtemp = arrswitch[i];
                        for (j = 0; j < rtemp.length; j++) {
                            zarrtobject[count] = [];
                            var dptemp = rtemp[j][0];
                            if (dptemp > rtemp[j][1]) {
                                zarrtobject[count][index1] = rtemp[j][1];
                                zarrtobject[count][index2] = dptemp;
                            }
                            else {
                                zarrtobject[count][index1] = dptemp;
                                zarrtobject[count][index2] = rtemp[j][1];
                            }
                            count++;
                        }



                    }
                    else {
                        var rtemp = arrswitch[i];
                        for (j = 0; j < rtemp.length; j++) {
                            zarrtobject[count] = [];
                            var dptemp = rtemp[j][0];
                            if (dptemp > rtemp[j][1]) {
                                zarrtobject[count][index1] = rtemp[j][1];
                                zarrtobject[count][index2] = dptemp;
                            }
                            else {
                                zarrtobject[count][index1] = dptemp;
                                zarrtobject[count][index2] = rtemp[j][1];
                            }
                            count++;
                        }
                    }
                    //else {
                    //    if (temp > arrswitch[i][index1]) {
                    //        arrswitch[i][index1] = arrswitch[i][index1];
                    //        arrswitch[i][index2] = temp;
                    //    }
                    //    else {
                    //        arrswitch[i][index2] = arrswitch[i][index1];
                    //        arrswitch[i][index1] = temp;
                    //    }
                    //    zarrtobject[count] = arrswitch[i];
                    //    count++;
                    //}


                }
                catch (error) {

                }
            }
            return zarrtobject;
        }
}));