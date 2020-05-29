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
            url: this.path + 'data/china-point.json',
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

        var data = [];
        for (var i = 0; i < rs[0].length; i++) {
            var geoCoord = rs[0][i].geoCoord;
            data.push({
                geometry: {
                    type: 'Point',
                    coordinates: geoCoord
                },
                time: Math.random() * 10
            });
        }

        var dataSet = new mapv.DataSet(data);
        var options = {
            fillStyle: 'rgba(255, 250, 50, 0.6)',
            //shadowColor: 'rgba(255, 250, 50, 0.5)',
            //shadowBlur: 3,
            updateCallback: function (time) {
                time = time.toFixed(2);
                $('#time').html('时间' + time);
            },
            size: 3,
            draw: 'simple',
            animation: {
                type: 'time',
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