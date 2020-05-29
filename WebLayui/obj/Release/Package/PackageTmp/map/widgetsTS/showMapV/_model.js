/* 2017-12-4 15:31:25 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
       
    },
    layerWork: null,
    //初始化[仅执行1次]
    create: function () {
        this.layerWork = L.featureGroup(); 
    },
    //打开激活
    activate: function () {  
        map.addLayer(this.layerWork);
        this.showMapV();
    }, 
    //关闭释放
    disable: function () { 
        map.removeLayer(this.layerWork);  
    }, 
    showMapV: function () {

       
        //创建MapV图层
        L.mapVLayer(dataSet, options).addTo(this.layerWork);  
    }, 





}));