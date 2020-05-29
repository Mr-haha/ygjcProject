/* 2017-12-4 15:31:25 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {

    },
    layerWork: null,
    _arr_charts: [], 
    //初始化[仅执行1次]
    create: function () {
        this.layerWork = L.featureGroup();
    },
    //打开激活
    activate: function () {
        this.map.addLayer(this.layerWork);

        var $this = this;
        $.getJSON(this.path + 'data/marker.json', function (data) {
            if (!$this.isActivate) return;
            $this.showData(data);
        });
    },
    //关闭释放
    disable: function () {
        this.clearLayers();
        this.map.removeLayer(this.layerWork);
    },
    showData: function (arrdata) {
        this.clearLayers();

        for (var i = 0; i < arrdata.length; i++) {
            var item = arrdata[i];
            item._index = i;
            if (item.TotalLength == 0) continue;

            this.addmarker(item);
        }

        this.map.stop();
        this.map.fitBounds(this.layerWork.getBounds());
    },
    addmarker: function (item) {
        var divid = "port_" + item._index;

        var pictures = L.marker([item.Y, item.X], {
            icon: L.divIcon({
                className: 'leaflet-echart-icon',
                iconSize: [220, 220],
                html: '<div id="' + divid + '" style="width: 220px; height: 220px; position: relative; background-color: transparent;"></div>'
            })
        }).addTo(this.layerWork);
         
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(divid));

        this._arr_charts.push(myChart);

        // 指定图表的配置项和数据
        option = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [{

                type: 'category',
                data: ['1月', '2月', '3月', '4月']
            }],
            yAxis: [{
                type: 'value',
                name: '水量',
                min: 0,
                max: 50,
                interval: 50,
                axisLabel: {
                    formatter: '{value} ml'
                }
            }, {
                type: 'value',
                name: '温度',
                min: 0,
                max: 10,
                interval: 5,
                axisLabel: {
                    formatter: '{value} °C'
                }
            }],
            series: [{
                name: '蒸发量',
                type: 'bar',
                data: [2.0, 4.9, 7.0, 23.2]
            }, {
                name: '降水量',
                type: 'bar',
                data: [2.6, 5.9, 9.0, 26.4]
            }, {
                name: '平均温度',
                type: 'line',
                yAxisIndex: 1,
                data: [2.0, 2.2, 3.3, 4.5]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    },
    clearLayers: function () {
        for (var i = 0; i < this._arr_charts.length; i++) {
            var myChart = this._arr_charts[i];
            myChart.dispose();
        }
        this._arr_charts = [];
        this.layerWork.clearLayers();
    },




}));
