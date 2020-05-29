//模块：//此方式：弹窗非iframe模式
var zfdxSgmnWidget = L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
        resources: [
            '../lib/leafletPlugins/_vector/l.ellipse.js',
            "../lib/jquery/mCustomScrollbar/jquery.mCustomScrollbar.css",
            "../lib/jquery/mCustomScrollbar/jquery.mCustomScrollbar.js",
            'lib/drag.js',
            'style.css'
        ],
        view: [
            { type: "append", url: "view.html" }
        ],
    }, 
    processBar: null,
    //初始化[仅执行1次]
    create: function () {

    },
    //每个窗口创建完成后调用
    winCreateOK: function (viewopt, html) {
        //此处可以绑定页面dom事件

        var $this = this;

        $("#btn_sgmn_close").click(function (e) {
            $this.disableBase();
        });

        $("#sb").click(function (e) {
            //将数据传入后台

            layer.msg('上报成功');
        });

        $(".-l-a-info").mCustomScrollbar({ theme: "minimal-dark" });

        var leftProParams = {
            scale: ['00', 10, 20, 30, 40, 50, 60],   //刻度显示值
            scaleID: "#-process-bottom-scale",      //刻度标尺
            scaleUnit: "",                            //单位
            scaleInit: 0,                             //10分钟
            dragContainerID: "#process-bottom-drag",        //进度条&拖动容器
            containerWidthPX: 453,                           //总长度,
            coefficient: 10,                            //折算系数
        }
        this.processBar = new this._process(leftProParams, function ($process, scaleValue) {

        });


        $("#btn_sgmn_tsxd").click(function () {
            $this.startTsxd();
        });
        $("#btn_sgmn_start").click(function () {
            if ($this.isStart) {
                $this.stopPlay();
            } else {
                $this.startPlay(true);
            }
        });

        //所有tab切换
        //$("#sgmn_resulttab li").click(function () {
        //    $(this).parents(".-tabs-ul").children("li").each(function () {
        //        $(this).removeClass("selected");
        //        $(this.getAttribute("link")).css("display", "none")
        //    })
        //    $(this).addClass("selected");
        //    var $curContainer = $(this.getAttribute("link"));
        //    if ($curContainer[0].nodeName == "DIV") {
        //        $(this.getAttribute("link")).css("display", "block");
        //    } else {
        //        $(this.getAttribute("link")).css("display", "table");
        //    }
        //})
    },

    _process: function (params, callback) {
        var len = params.scale.length;
        var script = {

            scale: function () {
                var html = "",
				    scale = params.scale,
				    itemWidth = (params.containerWidthPX / (len - 1)).toFixed(0);
                for (var i = 0; i < len; i++) {
                    if (i != len - 1) {
                        html += "<li t=" + params.scale[i] + " style=width:" + (itemWidth) + "px>" + scale[i] + params.scaleUnit + "</li>"
                    }
                }
                $(params.scaleID).html(html);
            },
            drag: function () {
                //1m = ?PX
                var scaleToPX = parseFloat(params.containerWidthPX / ((len - 1) * params.coefficient));
                var initWidth = scaleToPX * params.scaleInit;

                var html =
                '<div class=-process-bar style="width:' + (initWidth + 10) + 'px;"></div>' +
                '<div class=-process-drag style="left:' + initWidth + 'px"></div>';

                $(params.dragContainerID).html(html);
                //$(params.scaleValueID).html(params.scaleInit + params.scaleUnit);
                script.changeStyle(params.scaleInit);

                $(params.dragContainerID).children(".-process-drag").dragging({
                    move: 'x',
                    moveHandler: function (X, Y) {
                        var scaleValue = parseInt((X / scaleToPX).toFixed(0));
                        // $(params.scaleValueID).html(scaleValue + params.scaleUnit);
                        var $process = $(this).parents("div");
                        $process.children(".-process-bar").css("width", X + 10);
                        $process.children(".-process-mark").css("left", X);

                        script.changeStyle(scaleValue);

                        if (callback != null) {
                            callback($process, scaleValue);
                        }
                    }
                });
            },
            setValue: function (val) {
                //1m = ?PX
                var scaleToPX = parseFloat(params.containerWidthPX / ((len - 1) * params.coefficient));
                var initWidth = scaleToPX * val;
                $(params.dragContainerID).children(".-process-bar").css("width", initWidth + 10);
                $(params.dragContainerID).children(".-process-mark").css("left", initWidth);

                script.changeStyle(val);
            },
            changeStyle: function (scaleValue) {
                $(params.scaleID).children().each(function (idx) {
                    var _scaleValue = parseInt(this.getAttribute("t"));
                    scaleValue > _scaleValue ? $(this).removeClass("-u-gray") : $(this).addClass("-u-gray");
                });
            }
        }
        script.scale();
        script.drag();

        return script;
    },

    setTimeSliderVal: function (minute) {
        this.processBar.setValue(minute);
    },
    activate: function () {
        //var layer = this.config.target;
        //this.point = layer.getLatLng();

        $("#view_sgmn").show();
        $("#view_sgmn_timebar").show();
    },
    disable: function () {
        this.stopPlay();
        if (this.layerCicles)
            this.layerCicles.clearLayers();

        if (this.layerPoint) {
            map.removeLayer(this.layerPoint);
            this.layerPoint = null;
        }

        $("#view_sgmn").hide();
        $("#view_sgmn_timebar").hide();
    },
    //图上选点
    point: null,
    layerPoint: null,
    startTsxd: function () {
        this.endTsxd();
        map.on('click', this.onMapClick_tsxd, this);
        $('.leaflet-container').css('cursor', 'crosshair');
    },
    endTsxd: function () {
        map.off('click', this.onMapClick_tsxd, this);
        $('.leaflet-container').css('cursor', '');
    },
    onMapClick_tsxd: function (e) {
        this.endTsxd();
        this.point = e.latlng;


        if (this.layerPoint == null) {
            this.layerPoint = L.marker(this.point, {
                icon: L.icon({
                    "iconUrl": "img/marker/men3.png",
                    "iconSize": [32, 44],
                    "iconAnchor": [16, 44],
                    "popupAnchor": [0, -22]
                })
            }).addTo(map);
        }
        else {
            this.layerPoint.setLatLng(this.point);
        }

        var latlng = this.map.convert2wgs(this.point);
        $("#txt_sgmn_wz").val(latlng[0] + "," + latlng[1]);
    },
    //事故模拟
    layerCicles: null,
    interval: -1,
    isStart: false,
    iNow: 0,        //开始时间
    iALLTime: 60,   //总时长时间
    iALL: 6,        //模拟总次数
    startPlay: function (isclear) {
        if (this.point == null) {
            //haoutil.msg('请选择单击图上目标点后或进行图上选点后进行模拟！');
            haoutil.msg('请在图上选择目标点后进行模拟！');
            return
        }

        var _fs = Number($("#txt_sgmn_fs").val()); //风速 m/s
        var _fx = Number($("#txt_sgmn_fx").val()); //风向
        //var _qy = Number($("#txt_sgmn_qy").val()); //气压
        //var _wd = Number($("#txt_sgmn_wd").val()); //温度
        //var _sd = Number($("#txt_sgmn_sd").val()); //温度
        var _sd = Number($('#txt_sgmn_speed').val()) //速度


        if (isNaN(_fs) || _fs == 0) {
            layer.tips('请填写有效风速数据', '#txt_sgmn_fs');
            return
        }
        if (isNaN(_fx) || _fx < 0 || _fx > 360) {
            layer.tips('请填写有效风向数据(0-360)', '#txt_sgmn_fx');
            return
        }
        if (isNaN(_sd) || _sd == 0) {
            layer.tips('请填写有效速度数据', '#txt_sgmn_speed');
            return
        }


        if (this.layerCicles == null) {
            this.layerCicles = L.layerGroup().addTo(map);
        }
        if (isclear) {
            this.iNow = 0;    //开始时间
            this.layerCicles.clearLayers();
            this.setTimeSliderVal(0);
            //if (this.iNow == this.iALL) this.iNow = 0;
        }

        this.isStart = true;
        $("#btn_sgmn_start").html('停止模拟');

        var speed = 15 / _sd;

        var $this = this;
        this.interval = setInterval(function () {
            $this.iNow++;

            if ($this.iNow > $this.iALL || $this.iNow < 0) {
                $this.stopPlay();
                return;
            }
            var time = ($this.iNow / $this.iALL) * $this.iALLTime;
            $this.setTimeSliderVal(time);
            $this._addMnCicles(time, _fs, _fx);
        }, speed * 1000); //轮播的时间
    },
    pausePlay: function () {
        if (!this.isStart) return;

        clearInterval(this.interval);
        this.isStart = false;
    },
    stopPlay: function () {
        if (!this.isStart) return;
        $("#btn_sgmn_start").html('开始模拟');
         
        clearInterval(this.interval);
        this.isStart = false;
    },
    _last_cicle: null,
    _addMnCicles: function (_time, _fs, _fx) { //_time时间（分钟）,_fs 风速（m/s），_fx风向

        //此处加入公式，计算出半径
        var distance = (_time * 60 * _fs) / 1000; //公里 
        var bearing = _fx;
        var point = turf.point([this.point.lng, this.point.lat]);
        var newpoint = turf.destination(point, distance, bearing, { units: 'kilometers' });
        newpoint = [newpoint.geometry.coordinates[1], newpoint.geometry.coordinates[0]]


        var radiusX = distance / 2;
        var radiusY = distance;
        var angle = _fx + 180;

        //椭圆
        this._last_cicle = L.ellipse(newpoint, [radiusX * 1000, radiusY * 1000], angle, {
            color: "#ffffff",
            weight: 1,
            fill: true,
            fillColor: "#ff0000",
            fillOpacity: 0.4
        }).addTo(this.layerCicles);
         
        this.pausePlay();

        var latlngbounds = this._last_cicle.getBounds();
        this.queryALL(latlngbounds);
    },

    //查询
    queryALL: function (latlngbounds) {
        map.fitBounds(latlngbounds);
        var $this = this;

        this.clearResultLayers();
         
        $this.startPlay(); //不查询，直接下一步，有物资和企业服务时，参考下面注释代码
         
        ////查询arcgis图层，物资和企业   
        //var isRunOKFor1 = false;
        //var isRunOKFor2 = false;

        //var query1 = L.esri.query({
        //    url: "http://10.10.10.10:8060/kcgis/services/workmap/featureserver/1"
        //}); 
        //query1.within(latlngbounds).where(" 1=1 ").run(function (error, featureCollection) {
        //    isRunOKFor1 = true;
        //    if (error != null && error.code > 0) {
        //        haoutil.msg(error.message);
        //    }
        //    else {
        //        $this.showResult1(featureCollection.features);
        //    }
        //    if (isRunOKFor1 && isRunOKFor2) {
        //        $this.startPlay();
        //    }
        //});

        //var query2 = L.esri.query({
        //    url: "http://10.10.10.10:8060/kcgis/services/workmap/featureserver/2"
        //});
        //query2.within(latlngbounds).where(" 1=1 ").run(function (error, featureCollection) {
        //    isRunOKFor2 = true;
        //    if (error != null && error.code > 0) {
        //        haoutil.msg(error.message);
        //    }
        //    else {
        //        $this.showResult2(featureCollection.features);
        //    }
        //    if (isRunOKFor1 && isRunOKFor2) {
        //        $this.startPlay();
        //    }
        //});

    },
    layerResult: null,
    getResultLayer: function () {
        if (this.layerResult == null) {
            this.layerResult = L.markerClusterGroup({
                chunkedLoading: true,
                spiderfyOnMaxZoom: true,
                disableClusteringAtZoom: 14
            }).addTo(map);
        }
        return this.layerResult;
    },
    clearResultLayers: function () {
        if (this.layerResult == null) return;
        this.layerResult.clearLayers();
        //this.hideAllResult();
    },
    isInCircle: function (latlng) {
        if (this._last_cicle == null) return false;

        var radius = this._last_cicle.getRadius();
        var circleCenterPoint = this._last_cicle.getLatLng();
        var thislength = Math.abs(circleCenterPoint.distanceTo(latlng));

        return thislength < radius.x || thislength < radius.y;
    },
    centerAt: function (layer) {
        var latlng = layer.getLatLng();
        this.map.centerAt(latlng.lng, latlng.lat);

        layer.openPopup();
    },




}));

