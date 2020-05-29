/* 2017-12-4 15:31:54 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
           //弹窗
        view: {
            type: "window",
            url: "view4.html",
            windowOptions: {
                width: 500,
                height: 380,
            }
        },
    },
    layerWork: null,
    //初始化[仅执行1次]
    create: function () {
        var item = {
            "name": "区域实际灌溉",
            "opacity": 0.7,
            "type": "arcgis_dynamic",
            "url": "http://182.92.176.178:6080/arcgis/rest/services/MGDT/MGH/MapServer",
            "layers": [43],
            "popup": "all",
            "visible": true
        };
        this.layerWork = L.mars.layer.createLayer(item);
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () { 
        map.addLayer(this.layerWork);
        map.setView([17.014768, 105.314941], 6);
        
    }, 
    //关闭释放
    disable: function () {
        map.removeLayer(this.layerWork);
    },
 
 




}));