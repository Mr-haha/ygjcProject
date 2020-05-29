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
        var $this = this;

        $.ajax({
            url: this.path + 'data/beijing-village.json',
            type: "GET",
            dataType: 'json',
            success: function (rs) {
                if (!$this.isActivate) return;
                $this.showMapV(rs);
            }
        });
    },
    //关闭释放
    disable: function () {
        map.removeLayer(this.layerWork);
    },
    showMapV: function (geojson) {
        map.setView([39.93, 116.402], 12);


        var dataSet = new mapv.DataSet(geojson);

        var options = {
            fillStyle: 'rgba(255, 80, 53, 0.8)',
            strokeStyle: 'rgba(250, 255, 53, 0.8)',
            size: 3,
            lineWidth: 1,
            draw: 'simple'
        };

        L.mapVLayer(dataSet, options).addTo(this.layerWork);


    },





}));