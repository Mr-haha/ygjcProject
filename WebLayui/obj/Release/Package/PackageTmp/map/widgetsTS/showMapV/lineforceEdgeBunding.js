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
        map.setView([36.64, 108.15], 5);
         
        var randomCount = 500;

        var node_data = {
            "0": { "x": 108.154518, "y": 36.643346 },
            "1": { "x": 121.485124, "y": 31.235317 },
        };

        var edge_data = [
            { "source": "1", "target": "0" }
        ];

        var citys = ["北京", "天津", "上海", "重庆", "石家庄", "太原", "呼和浩特",
            "哈尔滨", "长春", "沈阳", "济南", "南京", "合肥", "杭州", "南昌", "福州",
            "郑州", "武汉", "长沙", "广州", "南宁", "西安", "银川", "兰州", "西宁",
            "乌鲁木齐", "成都", "贵阳", "昆明", "拉萨", "海口"
        ];

        //自定义数据
        for (var i = 1; i < randomCount; i++) {
            var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
            node_data[i] = {
                x: cityCenter.lng - 5 + Math.random() * 10,
                y: cityCenter.lat - 5 + Math.random() * 10,
            }
            edge_data.push(
                { "source": ~~(i * Math.random()), "target": '0' }
            );
        }

        var fbundling = mapv.utilForceEdgeBundling().nodes(node_data).edges(edge_data);

        var results = fbundling();

        var data = [];
        var timeData = [];

        for (var i = 0; i < results.length; i++) {
            var line = results[i];
            var coordinates = [];
            for (var j = 0; j < line.length; j++) {
                coordinates.push([line[j].x, line[j].y]);
                timeData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [line[j].x, line[j].y]
                    },
                    count: 1,
                    time: j
                });
            }
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            });
        }
        //创建MapV图层
        var dataSet1 = new mapv.DataSet(data);
        var options1 = {
            strokeStyle: 'rgba(55, 50, 250, 0.3)',
            globalCompositeOperation: 'lighter',
            shadowColor: 'rgba(55, 50, 250, 0.5)',
            shadowBlur: 10,
            methods: {
                click: function (item) {
                }
            },
            lineWidth: 1.0,
            draw: 'simple'
        };
        L.mapVLayer(dataSet1, options1).addTo(this.layerWork);

        //创建MapV图层
        var dataSet2 = new mapv.DataSet(timeData);
        var options2 = {
            fillStyle: 'rgba(255, 250, 250, 0.9)',
            globalCompositeOperation: 'lighter',
            size: 1.5,
            animation: {
                type: 'time',
                stepsRange: {
                    start: 0,
                    end: 100
                },
                trails: 1,
                duration: 5,
            },
            draw: 'simple'
        };

        L.mapVLayer(dataSet2, options2).addTo(this.layerWork); 
    }, 





}));