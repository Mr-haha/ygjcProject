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
        this.showMapV();
    }, 
    //关闭释放
    disable: function () {
        map.changeBaseMap(0);
        map.removeLayer(this.layerWork);  
    }, 
    showMapV: function () {
        map.setView([36.64, 108.15], 4);

        var randomCount = 1000;
        var data = [];
        var citys = [
            "北京", "天津", "上海", "重庆", "石家庄", "太原", "呼和浩特",
            "哈尔滨", "长春", "沈阳", "济南", "南京", "合肥", "杭州", "南昌",
            "福州", "郑州", "武汉", "长沙", "广州", "南宁", "西安", "银川",
            "兰州", "西宁", "乌鲁木齐", "成都", "贵阳", "昆明", "拉萨", "海口"
        ];

        //自定义数据
        while (randomCount--) {
            var cityCenter1 = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
            var cityCenter2 = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [cityCenter1.lng - 1 + Math.random() * 1, cityCenter1.lat - 1 + Math.random() * 1],
                        [cityCenter2.lng - 1 + Math.random() * 1, cityCenter2.lat - 1 + Math.random() * 1]
                    ]
                },
                count: 30 * Math.random()
            });
        }

        var dataSet = new mapv.DataSet(data);

        var options = {
            strokeStyle: 'rgba(255, 250, 50, 0.3)',
            shadowColor: 'rgba(255, 250, 50, 1)',
            shadowBlur: 20,
            lineWidth: 0.7,
            draw: 'simple'
        };
        L.mapVLayer(dataSet, options).addTo(this.layerWork);
    }, 





}));