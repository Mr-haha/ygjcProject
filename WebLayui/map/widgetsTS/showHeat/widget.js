/* 2017-12-4 15:31:25 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
        resources: [],
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 400,
                height: 280,
            }
        }
    },
    layerWork: null,
    //初始化[仅执行1次]
    create: function () {
        var $this = this;
        $.getJSON($this.path + "heat.json", function (data) {
            if (!$this.isActivate) return;

            if (data.Code != 0) {
                haoutil.msg(data.Msg);
                return;
            }
            var arrdata = data.Data;
            var mpts = [];
            for (var i = 0; i < arrdata.length; i++) {
                var item = arrdata[i];
                mpts.push([item.Y, item.X, item.Count]);
            }
            $this.addHeatLayer(mpts);
        });
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        if (this.layerWork) {
            map.addLayer(this.layerWork);
            map.fitBounds(this._mpts);
        }
    },
    //关闭释放
    disable: function () {
        if (this.layerWork)
            map.removeLayer(this.layerWork);
    },
    _mpts: null,
    addHeatLayer: function (mpts) {
        this._mpts = mpts;
        this.layerWork = L.heatLayer(mpts, {
            //radius: 20,
            //blur: 10,
            minOpacity: 0.3,
            gradient: { 0.4: "blue", 0.6: "cyan", 0.7: "lime", 0.8: "yellow", 1: "red" }
        }).addTo(map);
        map.fitBounds(mpts);
    }




}));

