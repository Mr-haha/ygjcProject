/* 2017-12-4 15:31:24 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {

    },
    layerWork: null,
    _arr_charts: [],
    configEchars: {
        DeepUsedLength: { name: '深水已利用', color: '#ff8da3' },
        DeepUnUsedLength: { name: '深水未利用', color: '#524db9' },
        UnDeepUsedLength: { name: '非深水已利用', color: '#ffc2c2' },
        UnDeepUnUsedLength: { name: '非深水未利用', color: '#c7c7f9' },
    },
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

        var minval = 60;   //最小值
        var maxval = 200;   //最大值

        var size = Math.log(item.TotalLength) * 9;
        if (size > maxval) size = maxval;
        if (size < minval) size = minval;

        //背景白色
        L.marker([item.Y, item.X], {
            icon: L.divIcon({
                className: '',
                iconSize: [size * 0.6, size * 0.6],
                html: '<div  style="width: ' + size * 0.6 + 'px; height: ' + size * 0.6 + 'px; position: relative; background-color: #ffffff;border-radius: 50%;">1</div>'
            })
        }).addTo(this.layerWork);


        var pictures = L.marker([item.Y, item.X], {
            icon: L.divIcon({
                className: 'leaflet-echart-icon',
                iconSize: [size, size],
                html: '<div id="' + divid + '" style="width: ' + size + 'px; height: ' + size + 'px; position: relative; background-color: transparent;"></div>'
            })
        }).addTo(this.layerWork);

        var fontsize = (size * 0.7 / (String(item.TotalLength).length)) - 1;

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(divid));

        this._arr_charts.push(myChart);

        // 指定图表的配置项和数据
        option = {
            tooltip: {
                trigger: 'item',
                formatter: function (param) {//"{a} <br/>{b}: {c}km ({d}%)"

                    return param.seriesName
                        + "<br/>" + param.name
                        + "<br/>长度" + param.value
                        + "km<br/>占比" + param.percent.toFixed(0) + "%";
                },
            },
            series: [{
                name: item.PortName,
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        formatter: function (param) {
                            return item.TotalLength + "\nkm";
                        },
                        textStyle: {
                            fontSize: fontsize,
                            color: '#000000'
                        }
                    },
                    emphasis: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    { value: item.DeepUsedLength, name: this.configEchars.DeepUsedLength.name, itemStyle: { normal: { color: this.configEchars.DeepUsedLength.color } } },
                    { value: item.DeepUnUsedLength, name: this.configEchars.DeepUnUsedLength.name, itemStyle: { normal: { color: this.configEchars.DeepUnUsedLength.color } } },
                    { value: item.UnDeepUsedLength, name: this.configEchars.UnDeepUsedLength.name, itemStyle: { normal: { color: this.configEchars.UnDeepUsedLength.color } } },
                    { value: item.UnDeepUnUsedLength, name: this.configEchars.UnDeepUnUsedLength.name, itemStyle: { normal: { color: this.configEchars.UnDeepUnUsedLength.color } } }
                ]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    },
    updateStyle: function (_style) {
        for (var i = 0; i < this._arr_charts.length; i++) {
            var myChart = this._arr_charts[i];

            var option;

            if (_style == 1) {
                option = {
                    series: [{
                        radius: ['50%', '70%'],
                    }]
                };
            }
            else {
                option = {
                    series: [{
                        radius: ['0', '70%'],
                    }]
                };
            }
            myChart.setOption(option);
        }
    },
    clearLayers: function () {
        for (var i = 0; i < this._arr_charts.length; i++) {
            var myChart = this._arr_charts[i];
            myChart.dispose();
        }
        this._arr_charts = [];
        this.layerWork.clearLayers();
    },
    //addLegend: function () {
    //    var strHtml = "<div class='legend-title'>港口岸线(km)</div>";

    //    for (var i in this.configEchars) {
    //        var item = this.configEchars[i];

    //        strHtml += "<div class='legend-item'><span class='legend-color' style='background:"
    //            + item.color + "'></span><span class='legend-des'>" + item.name + "</span></div>";
    //    }
    //    $('#legendContainer').html(strHtml);
    //},







}));
