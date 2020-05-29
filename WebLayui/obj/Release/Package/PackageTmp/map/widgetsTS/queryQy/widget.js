/* 2017-12-4 15:31:24 | 修改 木遥（QQ：346819890） */
//模块：
var widgetQY = L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 330,
                height: 400,
            }
        }
    },
    isCluster: false,
    //初始化[仅执行1次]
    create: function () {
        var resources = [
            this.path + 'qypopup.css',
        ];
        Loader.sync(resources);

        if (this.isCluster)
            this.layerWork = L.markerClusterGroup({
                chunkedLoading: true,       //间隔添加数据，以便页面不冻结。
                showCoverageOnHover: false, //是否显示聚合标记的边界。 
                disableClusteringAtZoom: 11 //此级别下不聚合
            });
        else
            //不聚合
            this.layerWork = L.featureGroup();


        this.iconOnline = L.icon({
            iconUrl: this.path + '/img/qy.png',
            iconSize: [64, 64],
            iconAnchor: [32, 64]
        });

        //this.iconOnline = L.divIcon({
        //    className: 'qypopup_marker',
        //    html: '<img src="' + this.path + '/img/qy.png" class="leaflet-marker-icon qy_marker" >'
        //});



    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        map.addLayer(this.layerWork);

        this.layerWork.on("click", this.layerWork_clickHandler, this);
        map.on("click", this.closePopup, this);
        map.on("zoomend", this.map_zoomendHandler, this);

        this.queryData('');
    },
    //关闭释放
    disable: function () {
        this.closePopup();

        this.layerWork.off("click", this.layerWork_clickHandler, this);
        map.removeLayer(this.layerWork);
        map.off("click", this.closePopup, this);
        map.off("zoomend", this.map_zoomendHandler, this);
    },
    map_zoomendHandler: function (e) {


    },
    iconOnline: null,
    layerWork: null,
    objData: {},    //存放marker  
    //首次查询数据，并启动定时
    queryData: function (queryVal) {
        var $this = this;
        //WebService.send("OfficeDAL", "findListBy", {
        //    params: {
        //        Number: queryVal
        //    },
        //    success: function (result) {
        //         var arrData = result.body;
        //        $this.showData(arrData);

        //        $this.viewWindow.showData($this.objData);
        //    }
        //});

        $.getJSON($this.path + "data.json", function (arrData) {
            if (!$this.isActivate) return;

            $this.showData(arrData);
            $this.viewWindow.showData($this.objData);
        });
    },
    showData: function (arrData) {
        this.objData = {};
        this.layerWork.clearLayers();

        if (arrData == null || arrData.length == 0) return;

        for (var index = 0; index < arrData.length; index++) {
            var item = this.addMarker(arrData[index]);
            this.objData[item.ID] = item;
        }
        //map.fitBounds(this.layerWork.getBounds()); 
    },
    addMarker: function (item) {
        var jd = Number(item.LONGITUDE);
        var wd = Number(item.LATITUDE);

        if (!isNaN(jd) && !isNaN(wd)) {
            item.visible = true;

            var latlng;

            var wgsMpt = L.mars.pointconvert.gcj2wgs([jd, wd]);
            jd = wgsMpt[0];
            wd = wgsMpt[1];
            latlng = map.convert2map([wd, jd]);


            var marker = L.marker(latlng, { icon: this.iconOnline });
            marker.attr = item;
            this.layerWork.addLayer(marker);

            //测试
            //L.marker(latlng).addTo(this.layerWork);

            item.feature = marker;
        }
        else {
            item.visible = false;
        }
        return item;
    },

    centerAt: function (id) {
        var item = this.objData[id];
        if (item == null || item.feature == null) {
            layer.msg('该企业无坐标信息！');
            return;
        }
        this.openPopup(item.feature);
        //haogis.layer.centerAt(item.feature);

        var latlng = item.feature.getLatLng();
        map.panTo(latlng, { animate: false, duration: 0 });

        //平移1/4
        var bounds = map.getBounds(),
           southWest = bounds.getSouthWest(),
           northEast = bounds.getNorthEast(),
           lngSpan = northEast.lng - southWest.lng,
           latSpan = northEast.lat - southWest.lat;

        map.panTo([latlng.lat + latSpan / 4, latlng.lng], { animate: false, duration: 0 });
    },
    updateMarkerVisible: function (rows, visible) {
        for (var i = 0; i < rows.length; i++) {
            var id = rows[i].ID;
            var item = this.objData[id];
            if (item == null || item.feature == null) continue;
            if (visible)
                this.layerWork.addLayer(item.feature);
            else
                this.layerWork.removeLayer(item.feature);
        }
    },

    markerPopup: null,
    layerWork_clickHandler: function (e) {
        this.openPopup(e.layer);
    },
    openPopup: function (layer) {
        this.closePopup();

        map.panTo(layer.getLatLng());

        var attr = layer.attr;

        var addr = attr.COUNTRY + attr.REGION + attr.ADDRESS;
        var addrEN = (attr.COUNTRY_ENG || '') + " " + (attr.REGION_ENG || '') + " " + (attr.OFFICE_ENG || '');
        var logo = attr.LOGO_URI;
        if (logo == null || logo.length == 0) {
            logo = this.path + '/img/label.png';
        }

        var inhtml = '<div class="qypopup"><div class="qypopup-content">'
                  + '<div class="qypopup-title">' + attr.OFFICE + '</div>';

        // if (attr && attr.OFFICE_ENG.length > 0)
        // inhtml += '<div class="qypopup-subtext">' + attr.OFFICE_ENG + '&nbsp;</div>';


        inhtml += '<div><div class="qypopup-img"><img src="' + logo + '" width="150" height="140"/></div><div class="qypopup-rightinfo"><div class="qypopup-rightinfo_middle">'

                  + '<div>地址：' + addr + '</div>'
                  + '<div>入驻公司/部门：' + (attr.DEPARTMENT) + '</div>'
                  + '<div>功能：' + attr.FUNCTION + '</div>'
                  + '<div style="color: #666666;">' + addrEN + '</div>'

                 // + ' <table > <tbody> <tr> <td style="width:70px;">地址</td><td>' + addr + '</td>  </tr>  '
                  //+ '<tr> <td>入驻企业</td><td>' + attr.DEPARTMENT + '</td>  </tr>  '
                  //+ '<tr> <td>功能</td><td>' + attr.FUNCTION + '</td>  </tr>  '
                  //+ ' <tr style="color: #666666;"> <td></td><td>' + addrEN + '</td>  </tr> </tbody> </table> '

                  + '</div></div></div></div><div class="qypopup-close"  ></div></div>';

        this.markerPopup = L.marker(layer.getLatLng(), {
            icon: L.divIcon({
                html: inhtml,
                className: 'qypopup_marker',
                iconSize: [500, 325],
                iconAnchor: [105, 390],
            }),
            pane: 'popupPane'
        }).addTo(map);



        $(".qypopup-close").click(this.closePopup);
        $(".qypopup-content").click(function (e) {
            L.DomEvent.stopPropagation(e);
        });
    },
    closePopup: function () {
        if (this.markerPopup != null) {
            map.removeLayer(this.markerPopup);
            this.markerPopup = null;
        }
    }





}));