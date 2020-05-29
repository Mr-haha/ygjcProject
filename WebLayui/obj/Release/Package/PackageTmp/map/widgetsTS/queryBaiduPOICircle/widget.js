/* 2017-12-4 15:31:19 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 300,
                height: 500,
            }
        }
    },
    workDraw: null,
    layerDraw: null,
    configBaidu: null,
    //初始化[仅执行1次]
    create: function () {
        var $this = this;
        this.workDraw = new L.mars.Draw({
            map: map,
            isOnly: true,
            style: { color: '#ff0000', weight: 2 },
            onEvnet: false,
            onCreate: function (event) {
                var layer = event.layer;
                if (layer instanceof L.Marker) {
                    $this.updateSelectMpt(layer);
                }
            },
            onChange: function (event) {
                var layer = $this.workDraw.currEditFeature;
                if (layer instanceof L.Marker) {
                    $this.updateSelectMpt(layer);
                }
            }
        });
        this.layerDraw = this.workDraw.getLayer();

        $.getJSON(this.path + "config.json", function (data) {
            $this.configBaidu = data;
        });
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        this.workDraw.onEvnet();
        map.addLayer(this.layerDraw);
        if (this.layerWork) {
            map.addLayer(this.layerWork);
        }
    },
    //关闭释放
    disable: function () {
        map.removeLayer(this.layerDraw);
        this.workDraw.destroy();

        if (this.centerCircle) {
            this.centerCircle.remove();
            this.centerCircle = null;
        }
        if (this.layerWork) {
            map.removeLayer(this.layerWork);
        }
    },
    //图上选点
    _lastRadius: 1,
    centerCircle: null,
    startSelectMpt: function (radius) {
        this._lastRadius = radius;
        this.workDraw.startDraw('marker');
    },
    updateSelectMpt: function (layer) {
        latlng = layer.getLatLng();
        if (this.centerCircle == null) {
            this.centerCircle = L.circle(latlng, {
                "radius": this._lastRadius,
                "color": "#ff0000",
                "dashArray": "5, 10",
                "stroke": true,
                "fill": false
            }).addTo(map);
        } else {
            this.centerCircle.setLatLng(latlng);
        }
        map.centerAtLayer(this.centerCircle);

        var location;

        latlng = map.convert2wgs(latlng);
        latlng = L.mars.pointconvert.wgs2bd([latlng[1], latlng[0]]);
        location = latlng[1] + "," + latlng[0];

        this.viewWindow.selectMptEnd(location);
    },
    updateRadius: function (radius) {
        if (this.centerCircle == null) return;

        this._lastRadius = radius;
        this.centerCircle.setRadius(radius);
    },

    //百度poi查询
    _key_index: 0,
    getKey: function () {
        var thisidx = (this._key_index++) % (this.configBaidu.key.length);
        return this.configBaidu.key[thisidx];
    },
    queryParam: {},
    strartQueryPOI: function (param) {
        this.queryParam = param;
        this.thispage = 1;
        this.queryPOI();
    },
    queryPOI: function () {
        var $this = this;
        var key = this.getKey();

        $.ajax({
            url: this.configBaidu.url,
            type: "GET",
            dataType: "jsonp",
            async: false,
            timeout: "5000",
            contentType: "application/json;utf-8",
            data: {
                "output": "json",
                "ak": key,
                "scope": 2,
                "page_size": this.pageSize,
                "page_num": (this.thispage - 1),
                "query": this.queryParam.text,
                "tag": this.queryParam.type,
                "location": this.queryParam.location,       //周边检索中心点, lat<纬度>,lng<经度>
                "radius": this.queryParam.radius            //周边检索半径，单位为米
            },
            success: function (data) {
                if (!$this.isActivate) return;
                if (data.status !== 0) {
                    haoutil.msg("请求失败(" + data.status + ")：" + data.message);
                    return;
                }
                $this.showPOIPage(data.results, data.total);
            },
            error: function (data) {
                haoutil.msg("请求出错(" + data.status + ")：" + data.statusText);
            }
        });
    },
    pageSize: 20,
    arrdata: [],
    counts: 0,
    allpage: 0,
    thispage: 0,
    showPOIPage: function (data, counts) {
        this.arrdata = data;
        this.counts = counts;
        if (this.counts < data.length) this.counts = data.length;
        this.allpage = Math.ceil(this.counts / this.pageSize);

        if (this.counts == 0) {
            haoutil.msg('当前查询条件下没有找到相关结果！');
        }
        else {
            for (var index = 0; index < this.arrdata.length; index++) {
                var item = this.arrdata[index];
                var startIdx = (this.thispage - 1) * this.pageSize;
                item.index = startIdx + (index + 1);

                this.objResultData[index] = item;
            };
        }


        this.showPOIArr(this.arrdata);
        this.viewWindow.showPOIResult({
            pageSize: this.pageSize,
            allpage: this.allpage,
            thispage: this.thispage,
            counts: this.counts,
            arrdata: this.arrdata
        });

        if (this.counts == 1) {
            this.showDetail('0');
        }
    },
    showFirstPage: function () {
        this.thispage = 1;
        this.queryPOI();
    },
    showNextPage: function () {
        this.thispage = this.thispage + 1;
        if (this.thispage > this.allpage) {
            this.thispage = this.allpage;
            haoutil.msg('当前已是最后一页了');
            return;
        }
        this.queryPOI();
    },

    showPretPage: function () {
        this.thispage = this.thispage - 1;
        if (this.thispage < 1) {
            this.thispage = 1;
            haoutil.msg('当前已是第一页了');
            return;
        }
        this.queryPOI();
    },

    objResultData: {},
    showDetail: function (id) {
        var item = this.objResultData[id];

        if (item.layer)
            this.centerAt(item.layer);
        else
            haoutil.msg('"' + name + '"无地理坐标信息！');
    },
    layerWork: null,
    getWorkLayer: function () {
        if (this.layerWork == null)
            this.layerWork = L.markerClusterGroup({
                chunkedLoading: true,
                spiderfyOnMaxZoom: true,
                disableClusteringAtZoom: 14
            }).addTo(map);
        return this.layerWork;
    },
    clearLayers: function () {
        if (this.layerWork == null) return;
        this.layerWork.clearLayers();
    },
    showPOIArr: function (arr) {
        var layer = this.getWorkLayer();
        layer.clearLayers();

        $.each(arr, function (index, item) {
            var jd = item.location.lng;
            var wd = item.location.lat;

            if (jd > 0 && wd > 0) {
                var latlng;

                var wgsMpt = L.mars.pointconvert.bd2wgs([jd, wd]);
                jd = wgsMpt[0];
                wd = wgsMpt[1];
                latlng = map.convert2map([wd, jd]);


                var marker = L.marker(latlng, {
                    //icon: L.ExtraMarkers.icon({
                    //    icon: 'fa-number',
                    //    shape: 'circle',
                    //    prefix: 'fa',
                    //    markerColor: 'orange-dark',
                    //    number: item.index
                    //})
                });
                marker.attributes = item;



                //popup
                //==================构建图上目标单击后显示div=================  
                var name;
                if (item.detail_info && item.detail_info.detail_url) {
                    name = '<a href="' + item.detail_info.detail_url + '"  target="_black" style="color: #ffffff; ">' + item.name + '</a>';
                }
                else {
                    name = item.name;
                }

                var inHtml = '<div class="mars-popup-titile">' + name + '</div><div class="mars-popup-content" >';

                var phone = $.trim(item.telephone);
                if (phone != '') inHtml += '<div><label>电话</label>' + phone + '</div>';

                var dz = $.trim(item.address);
                if (dz != '') inHtml += '<div><label>地址</label>' + dz + '</div>';

                if (item.detail_info) {
                    var fl = $.trim(item.detail_info.tag);
                    if (fl != '') inHtml += '<div><label>类别</label>' + fl + '</div>';

                }
                inHtml += '</div>';
                //==============================================================


                marker.bindPopup(inHtml);

                layer.addLayer(marker);

                item.layer = marker;
            }
        });
        if (layer.getLayers().length > 0)
            map.fitBounds(layer.getBounds());
    },
    centerAt: function (layer) {
        var latlng = layer.getLatLng();
       map.centerAt(latlng);

        layer.openPopup();
    },




}));

