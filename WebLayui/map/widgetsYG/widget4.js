/* 2017-12-4 15:31:54 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
           //弹窗
        view: {
            type: "window",
            url: "view4.html",
            windowOptions: {
                width: 700,
                height: 480,
            }
        },
    },
    layerWork: null,
    //初始化[仅执行1次]
    create: function () {
        var item = {
            "name": "遥感监测图斑",
            "opacity": 0.7,
            "type": "arcgis_dynamic",
            "url": "http://218.2.226.195:6080/arcgis/rest/services/JC/MapServer",
            "layers": [0],
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
    doquery: function () {
        var lquery = L.esri.query({
            url: 'http://218.2.226.195:6080/arcgis/rest/services/JC/MapServer'
        });
        lquery.where("1=1");
        var layuijson = [];
        var layuitablestatus = { msg: 'success', code: '0' };
        var json = [];
        layuijson.push(layuitablestatus);
        lquery.run(function (error, featureCollection, response) {
            var len = featureCollection.features.length;
            var 
            for (i = 0; i < len; i++) {
                var id = i;
                var shi = featureCollection.features[i].properties.SMC;
                var qu = featureCollection.features[i].properties.XMC;
                var qsx = featureCollection.features[i].properties.QSX;
                var hsx = featureCollection.features[i].properties.HSX;
                var type = featureCollection.features[i].properties.TBLX;
                var area = featureCollection.features[i].properties.Shape_Area;
                var ygjc = { Id: id, Shi: shi, Qu: qu, Qsx: qsx, Hsx: hsx, Type: type, Area: area };
                json.push(ygjc);
            }
        })
        layuijson.push({ data: json });
        return layuijson;
    }
 




}));