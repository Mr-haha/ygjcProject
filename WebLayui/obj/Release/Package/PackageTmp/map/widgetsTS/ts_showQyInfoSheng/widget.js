/* 2017-12-4 15:31:54 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
    
    },
    //初始化[仅执行1次]
    create: function () {

    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    imageOverlay: null,
    //打开激活
    activate: function () {
        var boouds = [[22.816694126899844, 108.69873046875001], [30.278044377800153, 114.53247070312501]];
        this.imageOverlay = L.imageOverlay(this.path + 'img/sheng.png', boouds, { opacity: 1 }).addTo(map);
        map.fitBounds(boouds);
    },
    //关闭释放
    disable: function () {
        if (this.imageOverlay) {
            map.removeLayer(this.imageOverlay);
            this.imageOverlay = null;
        }
    }




}));

