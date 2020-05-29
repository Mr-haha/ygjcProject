/* 2017-12-4 15:31:19 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
        resources: [
           '../lib/leafletPlugins/esri-geocoder/esri-leaflet-geocoder.css',
           '../lib/leafletPlugins/esri-geocoder/esri-leaflet-geocoder.js',
        ],
    },
    layerWork: null,
    searchControl: null,
    //初始化[仅执行1次]
    create: function () {
        this.initGeoCoder();
    },
    //激活插件
    activate: function () {
        if (this.layerWork == null) return;

        map.addLayer(this.layerWork);
        map.addControl(this.searchControl);
    },
    //释放插件
    disable: function () {
        if (this.layerWork == null) return;

        map.removeLayer(this.layerWork);
        map.removeControl(this.searchControl);
    },
    initGeoCoder: function () {
        var poi_url = 'http://182.92.176.178:6080/arcgis/rest/services/YHDB/BaseData/MapServer';
        var poi_name = 'NAME';
        var poi_address = 'ADDRESS';

        this.layerWork = L.layerGroup();
        this.searchControl = L.esri.Geocoding.geosearch({
            providers: [
              L.esri.Geocoding.mapServiceProvider({
                  url: poi_url,
                  layers: [0],
                  searchFields: [poi_name],
                  formatSuggestion: function (graphic) {
                      return graphic.properties[poi_name];
                  }
              })
            ],
            position: "topright",
            placeholder: '输入名称',
            title: 'POI查询'
        });

        map.addLayer(this.layerWork);
        map.addControl(this.searchControl);

        var $this = this;
        this.searchControl.on("results", function (data) {
            $this.layerWork.clearLayers();

            var latlngs = [];
            for (var i = data.results.length - 1; i >= 0; i--) {
                var item = data.results[i];
                latlngs.push(item.latlng);

                var marker = L.marker(item.latlng).bindPopup("<b>" + item.properties[poi_name] + "</b><br>" + item.properties[poi_address])
                $this.layerWork.addLayer(marker);
            }

            setTimeout(function () {
                if (latlngs.length == 1) {
                    map.panTo(latlngs[0]);
                }
                else if (latlngs.length > 1) {
                    map.fitBounds(latlngs);
                }
            }, 500);

        });
    }



}));
