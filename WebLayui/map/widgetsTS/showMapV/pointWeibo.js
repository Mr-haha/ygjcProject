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
            url: this.path + 'data/weibo.json',
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
        map.changeBaseMap(0);
        map.removeLayer(this.layerWork);
    },
    showMapV: function (rs) {
        map.setView([38.028658, 105.403119], 4);

        var data1 = [];
        var data2 = [];
        var data3 = [];
        var data4 = [];
        for (var i = 0; i < rs[0].length; i++) {
            var geoCoord = rs[0][i].geoCoord;
            data1.push({
                geometry: {
                    type: 'Point',
                    coordinates: geoCoord
                }
            });
        }

        for (var i = 0; i < rs[1].length; i++) {
            var geoCoord = rs[1][i].geoCoord;
            data2.push({
                geometry: {
                    type: 'Point',
                    coordinates: geoCoord
                },
                time: Math.random() * 10
            });
        }

        for (var i = 0; i < rs[2].length; i++) {
            var geoCoord = rs[2][i].geoCoord;
            data3.push({
                geometry: {
                    type: 'Point',
                    coordinates: geoCoord
                },
            });
        }

        var dataSet = new mapv.DataSet(data1);
        var options = {
            fillStyle: 'rgba(200, 200, 0, 0.8)',
            bigData: 'Point',
            size: 0.7,
            draw: 'simple',
        }
        L.mapVLayer(dataSet, options).addTo(this.layerWork);

        var dataSet = new mapv.DataSet(data2);
        var options = {
            fillStyle: 'rgba(255, 250, 0, 0.8)',
            size: 0.7,
            bigData: 'Point',
            draw: 'simple',
        }
        L.mapVLayer(dataSet, options).addTo(this.layerWork);

        var dataSet = new mapv.DataSet(data3);
        var options = {
            fillStyle: 'rgba(255, 250, 250, 0.6)',
            size: 0.7,
            bigData: 'Point',
            draw: 'simple',
        }
        L.mapVLayer(dataSet, options).addTo(this.layerWork);

        var dataSet = new mapv.DataSet(data2);
        var options = {
            fillStyle: 'rgba(255, 250, 250, 0.9)',
            size: 1.1,
            draw: 'simple',
            bigData: 'Point',
            animation: {
                stepsRange: {
                    start: 0,
                    end: 10
                },
                trails: 1,
                duration: 6,
            }
        }

        L.mapVLayer(dataSet, options).addTo(this.layerWork);

    },





}));