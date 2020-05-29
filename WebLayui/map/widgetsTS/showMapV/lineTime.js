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
        map.changeBaseMap(1);

        map.addLayer(this.layerWork);
        var $this = this;
   
        $.ajax({
            url: this.path + 'data/wuhan-car.txt',
            type: "GET",
            dataType: 'text',
            success: function (rs) {
                if (!$this.isActivate) return;
                $this.showMapV(rs);
            }
        });
    },
    //关闭释放
    disable: function () {
        map.changeBaseMap(0);
        map.removeLayer(this.layerWork);
    },
    showMapV: function (rs) {
        map.setView([30.41, 114.32], 11);

        var data = [];
        var timeData = [];

        rs = rs.split("\n");
        var maxLength = 0;
        //leaflet只识别经纬度坐标，需要将数据中的米坐标转成经纬度坐标
        var projection = L.CRS.EPSG3857.projection;

        var ggPoints;
        for (var i = 0; i < rs.length; i++) {
            var item = rs[i].split(',');
            var coordinates = [];
            if (item.length > maxLength) {
                maxLength = item.length;
            }
            if (item.length < 2) {
                continue;
            }
            for (j = 0; j < item.length; j += 2) {
                //需要将数据中的米坐标转成经纬度坐标
                var latLng = projection.unproject(L.point([item[j], item[j + 1]]));
                coordinates.push([latLng.lng, latLng.lat]);
                timeData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [latLng.lng, latLng.lat]
                    },
                    count: 1,
                    time: j
                });
            }
            ggPoints = coordinates;
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            });

        }
        //console.log(JSON.stringify(data));

        var dataSet1 = new mapv.DataSet(data);

        var options1 = {
            strokeStyle: 'rgba(53,57,255,0.5)',
            shadowColor: 'rgba(53,57,255,0.2)',
            shadowBlur: 3,
            lineWidth: 3.0,
            draw: 'simple'
        };
        //线图层
        L.mapVLayer(dataSet1, options1).addTo(this.layerWork);

        var dataSet2 = new mapv.DataSet(timeData);
        var options2 = {
            fillStyle: 'rgba(255, 250, 250, 0.2)',
            globalCompositeOperation: "lighter",
            size: 1.5,
            animation: {
                stepsRange: {
                    start: 0,
                    end: 100
                },
                trails: 3,
                duration: 5,
            },
            draw: 'simple'
        };
        //动态轨迹图层
        L.mapVLayer(dataSet2, options2).addTo(this.layerWork);

    },





}));