/* 2017-11-25 14:19:42 | 修改 木遥（QQ：346819890） */
//模块： 
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        //弹窗
        view: {
            type: "window",
            url: "GDBHSLJC.html",
            windowOptions: {
                width: 470,
                height: window.screen.availHeight * 3.8 / 6,
                //height: 641,
                position: 'lt',
                closeBtn: 1
            }
        }
    },
    viewWindow: null,
    FeaturesGroup: null,
    widgetThis: null,
    Windowthis: null,
    layerWork: null,
    GDBHSLUrl: "http://10.32.49.10:6080/arcgis/rest/services/GDSLBHJC/MapServer/0",
    //初始化[仅执行1次]
    create: function (viewopt) {
        var item = {
            "name": "耕地数量变化监测",
            "opacity": 0.7,
            "type": "arcgis_dynamic",
            "url": "http://10.32.49.10:6080/arcgis/rest/services/GDSLBHJC/MapServer",
            "crs": "4326",
            "popup": "all",
            "visible": true
        };
        this.layerWork = L.mars.layer.createLayer(item);

    },
    //激活插件
    activate: function (hhh) {
        map.addLayer(this.layerWork);
        map.setView([31.43, 121.128], 15);

        var query0 = L.esri.query({
            url: this.GDBHSLUrl
        });
        map.on('click', function (e) {
            query0.nearby(e.latlng, 250);

            query0.run(function (error, featureCollection, response) {
                if (error) {
                    return;
                }
                var ssssss = featureCollection;
                if (ssssss.features.length > 0) {
                    var resultJson = L.geoJSON(featureCollection, {
                        style: function (feature) {
                            return {
                                weight: 2.5,
                                color: 'white',
                                dashArray: '3',
                                fillOpacity: 0.6,
                                fillColor: 'gray'
                            };
                        },
                    });
                    var showExtent = resultJson.getBounds();
                    map.fitBounds(showExtent, { maxZoom: 16 });

                    var etarget = new Object();
                    etarget.feature = ssssss.features[0];
                    window.parent.flashFeature = etarget;
                    widgetThis.showHistory();
                }
            });
        })

    },
    //每个窗口创建完成后调用
    winCreateOK: function (viewopt, html) {
        debugger
        this.viewWindow = html;   //Layer里面得内容，即table.html
        widgetThis = this;
        Windowthis = html.parent;
        this.showHistory();
    },

    ///刷新Table页面也运行disable函数
    disable: function () {
        debugger
        var df = this;

        if (Windowthis.FeaturesGroup) {
            map.removeLayer(Windowthis.FeaturesGroup);
        }
        //if (isOpenNew == isOpenNew) {
        //    Windowthis.RemoveStyle();  //调用window页面(即LayerUI的父页面--map下的index.html)中的函数，实现与父界面的交互
        //}   
    },
    showHistory: function () {
        debugger
        if (L.widget.isActivate('widgets/MultiMapCompare/MultiMapCompare.js?TBLX=GDSLBH')) {
            var widget = L.widget.getWidget('widgets/MultiMapCompare/MultiMapCompare.js?TBLX=GDSLBH');
            widget._class.activate();
        } else {
            L.widget.activate({
                uri: 'widgets/MultiMapCompare/MultiMapCompare.js?TBLX=GDSLBH', name: '<i class="fa fa-share-alt" style:"font-size:10px"></i>历史追溯' || '', "autoDisable": true, "disableOhter": false
            });
        }
    },
    showTBinfo: function (feature, TBLX, div1Obj, tableObj) {
        var ddff = this;
        debugger
        var htmltable = "<div class='result1' style='width: 100%; overflow: auto; position: relative;float:right;margin-top:5px;margin-right:0px;margin-buttom:0px;margin-left:0'>" + "<form id='Image' method='post'>" + "<table class='table table-bordered' >" + "<tr><td class='right'>图斑类型</td><td>" + TBLX + "</td></tr>" + "<tr><td class='right'>所在市</td><td>" + feature.SMC + "</td></tr>" + "<tr><td class='right'>区域</td><td id='Td6'>" + feature.XMC + feature.ZMC + "</td></tr>" + "<tr><td class='first right'>面积</td><td id='orbitnumb'>" + (feature.JCMJ / 10000).toFixed(3) + "</td></tr>" + "<tr><td class='first right'>发现时间</td><td id='Td4'>" + feature.JCPC + "</td></tr>";
        tableObj.html(htmltable);
        var finalHtml = div1Obj.html();
        if (this.infoindex != -1) {
            layer.close(this.infoindex);
        }
        this.infoindex = layer.open(
            {
                type: 1,
                zIndex: "88888888888",
                title: "图斑信息",
                fixed: false,
                maxmin: false,
                shade: 0,
                offset: 'rt',
                content: finalHtml,
                cancel: function (layero, index) {
                    infoindex = -1;
                }

            });
        var ddd = $(".right");
        $(".right").css('background-color', '#eff3f6');
        $(".right").css('font-weight', 'bold');
    },
    //查询地图
    queryMapByWhere: function (featurelayerurl, where, isadd, filterdatageojson) {
        debugger
        var lquery = L.esri.query({
            url: featurelayerurl
        });
        lquery.where(where);
        lquery.run(function (error, featureCollection, response) {
            if (featureCollection != null) {
                var resultJson = L.geoJSON(featureCollection, {
                    style: function (feature) {
                        return {
                            weight: 2.5,
                            color: 'white',
                            dashArray: '3',
                            fillOpacity: 0.6,
                            fillColor: 'gray'
                        };
                    },
                });
                var showExtent = resultJson.getBounds();
                map.fitBounds(showExtent, { maxZoom: 16 });
                var etarget = new Object();
                etarget.feature = featureCollection.features[0];
                window.parent.flashFeature = etarget;
                widgetThis.showHistory();
            } else { alert("未查到镇数据！") };

        });
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
                    if (temp > arrswitch[i][index1]) {
                        arrswitch[i][index1] = arrswitch[i][index1];
                        arrswitch[i][index2] = temp;
                    }
                    else {
                        arrswitch[i][index2] = arrswitch[i][index1];
                        arrswitch[i][index1] = temp;
                    }
                    zarrtobject[count] = arrswitch[i];
                    count++;
                }


            }
            catch (error) {

            }
        }
        return zarrtobject;
    },
    addlayer: function () {
        var pdclayer = new L.esri.dynamicMapLayer({
            url: 'http://10.32.49.10:6080/arcgis/rest/services/GDSLBHJC/MapServer',
            opacity: 0.8,
        }).addTo(map);
        map.setView([31.4630556, 121.12444], 12);
    }
}));

