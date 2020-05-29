/* 2017-12-5 14:28:44 | 修改 木遥（QQ：346819890） */
//此方式：弹窗非iframe模式
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        resources: ['view.css'],
        view: [
            { type: "append", url: "view.html" }
        ],
    },
    //初始化[仅执行1次]
    create: function () {
        
    },
    activate: function (hhh) {
        debugger
    },
    //每个窗口创建完成后调用
    winCreateOK: function (viewopt, html) {
        if (viewopt.type != "append") return;
        debugger
        var windowthis = window;
        var ppath = "JCPC.json";
        /////$.getJSON()也是异步的，所以把绑定.widget-btn按钮事件放在$.getJSON()里面执行
        $.getJSON(ppath, function (data) {
            debugger
            var obj = data.TimeMaps;
            var htmls = "<option value='' selected>全部批次</option>";
            for (var i = 0; i < obj.length; i++) {
                htmls += "<option value='"+ obj[i].PC+"'>"+obj[i].time+"</option>";
            }                      
            $("#pcSelect").html(htmls);

            $("#pcSelect").change(function () {
                var val = $(this).context.value
                windowthis.JCPC = val;
                layer.closeAll();
                windowthis.RemoveStyle();
            });

            $(".toolBar .widget-btn").each(function () {
                $(this).click(function (e) {
                    var uri = $(this).attr('data-widget');
                    if (haoutil.isutil.isNull(uri)) {
                        return;
                    }
                    if (L.widget.isActivate(uri)) {
                        L.widget.disable(uri);
                    }
                    else {
                        var name1 = $(this).attr('data-name');
                        var name2 = $(this).html().replace('<a href="javascript:void(0)">', '').replace('</a>', ''); //会覆盖config中配置的名称

                        L.widget.activate({ uri: uri, name: name1 || name2 });
                    }
                });
            });

        });
    },
    //激活插件
    activate: function () {


    },
    //释放插件
    disable: function () {

    },


}));
