/* 2017-12-7 11:57:13 | 修改 木遥（QQ：346819890） */
//第三方类库加载管理js，方便切换lib
(function () {
    var r = new RegExp("(^|(.*?\\/))(include-lib\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'), targetScript;
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                targetScript = s[i];
                break;
            }
        }
    }

    //当前版本号,用于清理浏览器缓存
    var cacheVersion = "20180320";

    // cssExpr 用于判断资源是否是css
    var cssExpr = new RegExp('\\.css');

    function inputLibs(list) {
        if (list == null || list.length == 0) return;

        for (var i = 0, len = list.length; i < len; i++) {
            var url = list[i];
            if (cssExpr.test(url)) {
                var css = '<link rel="stylesheet" href="' + url + '?time=' + cacheVersion + '">';
                document.writeln(css);
            } else {
                var script = '<script type="text/javascript" src="' + url + '?time=' + cacheVersion + '"><' + '/script>';
                document.writeln(script);
            }
        }
    }

    //加载类库资源文件
    function load() {
        var arrInclude = (targetScript.getAttribute('include') || "").split(",");
        var libpath = (targetScript.getAttribute('libpath') || "");

        if (libpath.lastIndexOf('/')!=libpath.length-1)
            libpath += "/";

        var libsConfig = {
            'jquery': [
                libpath + "jquery/jquery-2.1.4.min.js",
            ],
            'jquery.scrollTo': [
               libpath + "jquery/scrollTo/jquery.scrollTo.min.js",
            ],
            'jquery.minicolors': [
              libpath + "jquery/minicolors/jquery.minicolors.css",
              libpath + "jquery/minicolors/jquery.minicolors.min.js",
            ],
            'jquery.range': [
               libpath + "jquery/range/range.css",
               libpath + "jquery/range/range.js",
            ],
            'ztree': [
               libpath + "jquery/ztree/css/zTreeStyle/zTreeStyle.css",
               libpath + "jquery/ztree/js/jquery.ztree.all.min.js",
            ],
            'jquery.mCustomScrollbar': [
                 libpath + "jquery/mCustomScrollbar/jquery.mCustomScrollbar.css",
                 libpath + "jquery/mCustomScrollbar/jquery.mCustomScrollbar.js",
            ],
            'font-awesome': [
                libpath + "font-awesome/css/font-awesome.min.css",
            ],
            'animate': [
                libpath + "animate/animate.css",
            ],
            'bootstrap': [
                libpath + "bootstrap/css/bootstrap.css",
                libpath + "bootstrap/js/bootstrap.min.js",
            ],
            'bootstrap-table': [
                libpath + "bootstrap/plugins/table/bootstrap-table.min.css",
                libpath + "bootstrap/plugins/table/bootstrap-table.min.js",
                libpath + "bootstrap/plugins/table/locale/bootstrap-table-zh-CN.js"
            ],
            'admin-lte': [
               libpath + "font-awesome/css/font-awesome.min.css",
               libpath + "admin-lte/css/AdminLTE.min.css",
               libpath + "admin-lte/css/skins/skin-blue.min.css",
               libpath + "admin-lte/js/adminlte.min.js"
            ],
            'ace': [
               libpath + "ace/ace.js"
            ],
            'layer': [
              libpath + "layer/theme/default/layer.css",
              libpath + "layer/layer.js",
            ],
            'haoutil': [
              libpath + "hao/haoutil.js",
              libpath + "hao/loading/loading.css",
              libpath + "hao/loading/loading.js",
            ],
            'echarts': [
               libpath + "echarts/echarts.min.js",
               libpath + "echarts/dark.js"
            ],
            'echarts-gl': [
                libpath + "echarts/echarts-gl.min.js"
            ],
            'echarts-forleaflet': [
              libpath + "echarts/forleaflet/echarts-3.4.min.js",
            ],
            'mapV': [
              libpath + "mapV/mapv.min.js",
            ],
            'highlight': [
               libpath + "highlight/styles/foundation.css",
               libpath + "highlight/highlight.pack.js"
            ],
            'turf': [
              libpath + "turf/turf.min.js"
            ],
            'leaflet-mars': [
              libpath + "leaflet-mars/leaflet.css",
              libpath + "leaflet-mars/leaflet.js",
            ],
            'esri-leaflet': [
              libpath + "leafletPlugins/esri/esri-leaflet-debug.js"
            ],
            'cesium-mars': [
              libpath + "Cesium/Widgets/widgets.css",
              libpath + "Cesium/Cesium.js",
              libpath + "cesium-mars/mars3d.css",
              libpath + "cesium-mars/mars3d.js"
            ]
        };

         
        for (var i in arrInclude) {
            var key = arrInclude[i];
            inputLibs(libsConfig[key]);
        }

    }

    load();
})();
