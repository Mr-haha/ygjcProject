/* 2017-12-4 15:31:26 | 修改 木遥（QQ：346819890） */
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

        // 构造数据
        var latlngs = [];
        var data = [];
        var randomCount = 699;
        while (randomCount--) {
            var point = L.mars.util.randomLatLng();
            latlngs.push(point);

            data.push({
                geometry: { type: 'Point', coordinates: [point.lng, point.lat] },
                count: 30 * Math.random()
            });
        }
        map.fitBounds(latlngs);

        var dataSet = new mapv.DataSet(data); 
        var options = {
            fillStyle: 'rgba(55, 50, 250, 0.8)',
            shadowColor: 'rgba(255, 250, 50, 1)',
            shadowBlur: 20,
            max: 100,
            size: 50,
            label: {
                show: true,
                fillStyle: 'white',
            },
            globalAlpha: 0.5,
            gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
            draw: 'honeycomb'
        };

        //创建MapV图层
        L.mapVLayer(dataSet, options).addTo(this.layerWork); 

    }, 





}));