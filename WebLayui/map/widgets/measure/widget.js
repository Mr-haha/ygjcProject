/* 2017-11-25 14:19:42 | 修改 木遥（QQ：346819890） */
//模块： 
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 240,
                height: 160
            }
        }
    },
    measureTool: null,
    //初始化[仅执行1次]
    create: function () {
        this.measureTool = new L.mars.MeasureTool({ map: this.map, isactivate: false });
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //激活插件
    activate: function () {
        this.measureTool.activate();
    },
    //释放插件
    disable: function () {
        this.measureTool.disable();
    },

    clearDraw: function () {
        this.viewWindow.showResult('');
        this.measureTool.clear();
    },
    drawPolyline: function () {
        var $this = this;

        this.measureTool.measureLength({
            unit: function () {
                return $this.viewWindow.getLengtchDanWei();
            },
            showResult: function (text, value) {
                $this.viewWindow.showResult(text);
            }
        });
    },
    drawPolygon: function () {
        var $this = this;

        this.measureTool.measureArea({
            unit: function () {
                return $this.viewWindow.getAreaDanWei();
            },
            showResult: function (text,value) {
                $this.viewWindow.showResult(text);
            }
        });
    },
    updateResultLengthByDw: function () {
        var danwei = this.viewWindow.getLengtchDanWei();
        this.measureTool.updateLengthUnit(danwei);
        return this;
    },
    updateResultAreaByDw: function () {
        var danwei = this.viewWindow.getAreaDanWei();
        this.measureTool.updateAreaUnit(danwei);
        return this;
    },



}));