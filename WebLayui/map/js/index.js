/* 2017-12-7 17:29:10 | 修改 木遥（QQ：346819890） */
var map;
var Widgetname;
$(document).ready(function () {
    initMap();
    var Topurl = window.top.document.URL;
    var urlList = Topurl.split("=");
    Widgetname = urlList[urlList.length - 1];
});

function initMap() {
    var configfile = haoutil.system.getRequestByName("config", "../map/config.json");

    haoutil.loading.show();
    L.mars.createMap({
        id: "map",
        url: configfile + "?time=20180320",
        success: function (_map, gisdata, jsondata) {
            haoutil.loading.hide();

            map = _map;

            //初始化widget管理器
            L.widget.init(_map, jsondata.widget);

            var request = haoutil.system.getRequest();

            //如果url传参，激活对应widget 
            if (haoutil.isutil.isNotNull(request.widget))
                L.widget.activate(request.widget);

            //如果有xyz传参，进行定位 
            if (haoutil.isutil.isNotNull(request.x)
                && haoutil.isutil.isNotNull(request.y)
                && haoutil.isutil.isNotNull(request.z)) {
                var x = Number(request.x);
                var y = Number(request.y);
                var z = Number(request.z);
                map.setView([y, x], z);
            }

            initWork();
        }
    });
}

//当前页面业务相关
function initWork() {
    if (Widgetname == "gdlyqk")
    { L.widget.activate({ uri: "widgets/GDLYQk/GDLYQk.js", name: "耕地利用情况" }); }
    if (Widgetname == "gdbhjc")
    { L.widget.activate({ uri: "widgets/GDBHJC/GDBHJC.js", name: "耕地保护监测" }); }
    if (Widgetname == "gdslbh")
    { L.widget.activate({ uri: "widgets/widgetsGDBH/GDBHSLJC.js", name: "耕地数量变化监测" }); }

}

//绑定图层管理
function bindToLayerControl(name, layer) {
    if (map.gisdata.controls && map.gisdata.controls.layers) {
        map.gisdata.controls.layers.addOverlay(layer, name);
    }
     
    var childitem = {
        name: name,
        _layer: layer
    };
    layer.config = childitem;

    var manageLayersWidget = L.widget.getClass('widgets/manageLayers/widget.js');
    if (manageLayersWidget) {
        manageLayersWidget.addOverlay(childitem);
    }
    else {
        map.gisdata.config.operationallayers.push(childitem);
    }  
}
function unbindLayerControl(name) {
    if (map.gisdata.controls && map.gisdata.controls.layers) {
   

        var operationallayersCfg = map.gisdata.config.operationallayers;
        for (var i = 0; i < operationallayersCfg.length; i++) {
            var item = operationallayersCfg[i];
            if (item.name == name) {
                map.gisdata.controls.layers.removeLayer(item._layer);
                break;
            }
        }
    }
     
    var manageLayersWidget = L.widget.getClass('widgets/manageLayers/widget.js');
    if (manageLayersWidget) {
        manageLayersWidget.removeLayer(name);
    } else {
        var operationallayersCfg = map.gisdata.config.operationallayers;
        for (var i = 0; i < operationallayersCfg.length; i++) {
            var item = operationallayersCfg[i];
            if (item.name == name) {
                operationallayersCfg.splice(i, 1);
                break;
            }
        }
    }
}


//外部页面调用
function activateWidget(item) {
    L.widget.activate(item);
}
function activateFunByMenu(fun) {
    eval(fun);
}