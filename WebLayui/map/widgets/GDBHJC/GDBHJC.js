/* 2017-11-25 14:19:42 | 修改 木遥（QQ：346819890） */
//模块： 
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        //弹窗
        view: {
            type: "window",
            url: "GDBHJC.html",
            windowOptions: {
                //width: 470,
                height: window.screen.availHeight * 5 / 6,
                 width: 627,
                position:'lt',
                closeBtn:1
            }
        }
    },
    viewWindow: null,
    FeaturesGroup: null,
    widgetThis: null,
    Windowthis: null,
    //初始化[仅执行1次]
    layerWork: null,
    create: function (viewopt) {
        var item = {
            "name": "耕地沉降",
            "opacity": 0.7,
            "type": "arcgis_dynamic",
            "url": "http://10.32.49.10:6080/arcgis/rest/services/GDCJJC/MapServer",
            "crs": "4326",
            "popup": "all",
            "visible": true
        };
        this.layerWork = L.mars.layer.createLayer(item);

    },
    //激活插件
    activate: function (hhh) {
        map.addLayer(this.layerWork);
        map.setView([31.85, 120.20], 12);
        //map.flyTo([31.85, 120.20], 11);
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
        if (Windowthis.ZhenLayer) {
            map.removeLayer(Windowthis.ZhenLayer);
        }
        //if (isOpenNew == isOpenNew) {
        //    Windowthis.RemoveStyle();  //调用window页面(即LayerUI的父页面--map下的index.html)中的函数，实现与父界面的交互
        //}   
    },
    showHistory: function () {
        debugger
        if (L.widget.isActivate('widgets/MultiMapCompare/MultiMapCompare.js?TBLX=GDBHJC')) {
            var widget = L.widget.getWidget('widgets/MultiMapCompare/MultiMapCompare.js?TBLX=other');
            widget._class.activate();
        } else {
            L.widget.activate({
                uri: 'widgets/MultiMapCompare/MultiMapCompare.js?TBLX=GDBHJC', name: '<i class="fa fa-share-alt" style:"font-size:10px"></i>历史追溯' || '', "autoDisable": true, "disableOhter": false
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
                    }
                });
                if (Windowthis.ZhenLayer) {
                    Windowthis.ZhenLayer.clearLayers();
                }
                resultJson.addTo(map);
                var showExtent = resultJson.getBounds();
                map.fitBounds(showExtent, { maxZoom: 16 });

                if (Windowthis.FeaturesGroup)
                { Windowthis.FeaturesGroup.bringToFront(); }  //很关键。将featureGroup提到最前面

                Windowthis.ZhenLayer = resultJson;
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
    addLayer: function (mpts) {
        var dd = L.esri.dynamicMapLayer({
            //radius: 20,
            //blur: 10,
            opacity: 0.8,
            crs:'4326',
            url: "http://10.32.49.10:6080/arcgis/rest/services/GDCJJC/MapServer"
        }).addTo(map);
        map.flyTo([31.85, 120.20], 11);
        dd.bindPopup(function (error, featureCollection) {
            if (error || featureCollection.features.length == 0) {
                return false;
            } else {
                return "类型：" + featureCollection.features[0].properties.类型 + "<br>" + featureCollection.features[0].properties.SMC + featureCollection.features[0].properties.XMC + featureCollection.features[0].properties.ZMC;
            }
        })
    }
    //addToLayer: function () {
    //    var dd = L.esri.featureLayer({
    //        //radius: 20,
    //        //blur: 10,
    //        url: "http://10.32.49.10:6080/arcgis/rest/services/GDCJJC/MapServer/0"
    //    }).addTo(map);
    //    dd.query().bounds(function (error, latlngbounds) {
    //        if (error) { return; }
    //        map.fitBounds(latlngbounds);
    //    })

    //}
}));

