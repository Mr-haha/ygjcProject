/* 2017-12-4 15:31:24 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
    },
    layerWork: null,
    //初始化[仅执行1次]
    create: function () {
        
  
    },
    //打开激活
    activate: function () {
        //map.setView([33.652, 119.661], 5);
        map.changeBaseMap(1);
         
        this.showData(); 
    }, 
    //关闭释放
    disable: function () { 
        map.removeLayer(this.layerWork);
       map.changeBaseMap(0);
        this.layerWork = null;
    },
 
    showData: function (data) {
        var option = this.getOption(data);
        if (this.layerWork == null) {
            this.layerWork = L.flowEcharts(option).addTo(map);
        }
        else {
            this.layerWork._echartsOption = option;
            this.layerWork.redraw();
        }
    },

    //当前页面业务相关
    getOption: function (data) {


         
        return option;
    }





}));