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
            url: this.path + 'data/qianxi-time.txt',
            type: "GET",
            dataType: "text",
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
        map.setView([36.64, 108.15], 4);

        var data = [];
        var timeData = [];

        function curive(fromPoint, endPoint, n) {
            var delLng = (endPoint.lng - fromPoint.lng) / n;
            var delLat = (endPoint.lat - fromPoint.lat) / n;

            for (var i = 0; i < n; i++) {
                var pointNLng = fromPoint.lng + delLng * i;
                var pointNLat = fromPoint.lat + delLat * i;
                timeData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [pointNLng, pointNLat]
                    },
                    count: 1,
                    time: i
                });
            }
        }


        var items = rs.split('|');
        for (var i = 0; i < items.length; i++) {
            var itemArr = items[i].split(/\n/);
            for (var k = 0; k < itemArr.length; k++) {
                if (!!itemArr[k]) {
                    var item = itemArr[k].split(/\t/);
                    if (item[0] === '起点城市' || item[0] === '迁出城市') {
                        var cityBegin = item[1];
                    }
                    if (item[0] !== '起点城市' || item[0] !== '迁出城市' && item.length > 1) {
                        var cityCenter1 = mapv.utilCityCenter.getCenterByCityName(item[0].replace(/市|省/, ""));
                        var cityCenter2 = mapv.utilCityCenter.getCenterByCityName(cityBegin.replace(/市|省/, "").trim());
                        if (cityCenter1) {
                            if (Math.random() > 0.7) {
                                curive(cityCenter2, cityCenter1, 50);
                            }
                            data.push({
                                geometry: {
                                    type: 'LineString',
                                    coordinates: [[cityCenter1.lng, cityCenter1.lat], [cityCenter2.lng, cityCenter2.lat]]
                                },
                                count: 100 * Math.random()
                            });
                        }
                    }
                }
            }
        }

        var dataSet1 = new mapv.DataSet(data);
        var options1 = {
            strokeStyle: 'rgba(55, 50, 250, 0.3)',
            globalCompositeOperation: 'lighter',
            shadowColor: 'rgba(55, 50, 250, 0.5)',
            methods: {
                click: function (item) {
                }
            },
            gradient: { 0: 'rgba(55, 50, 250, 0)', 1: 'rgba(55, 50, 250, 1)' },
            lineWidth: .2,
            draw: 'intensity'
        };
        //线图层 
        L.mapVLayer(dataSet1, options1).addTo(this.layerWork);

        var dataSet2 = new mapv.DataSet(timeData);
        var options2 = {
            fillStyle: 'rgba(255, 250, 250, 0.9)',
            size: .5,
            animation: {
                type: 'time',
                stepsRange: {
                    start: 0,
                    end: 50
                },
                trails: 1,
                duration: 5,
            },
            draw: 'simple'
        };
        //动画图层
        L.mapVLayer(dataSet2, options2).addTo(this.layerWork);




    },





}));