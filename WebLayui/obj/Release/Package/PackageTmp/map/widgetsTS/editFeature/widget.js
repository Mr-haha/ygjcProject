/* 2017-12-4 15:31:19 | 修改 木遥（QQ：346819890） */
//模块：
var widget_editFeature = L.widget.bindClass(L.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 300,
                height: 500
            }
        }
    },
    layerEdit: null,
    layerFeature: null,
    workDraw: null,
    //初始化[仅执行1次]
    create: function () {
        var $this = this;

        this.workDraw = new L.mars.Draw({
            map: map,
            isOnly: true,
            style: { color: '#ff0000', weight: 2 },
            onEvnet: false,
            onCreate: function (e) {
                $this.viewWindow.startEnd();

                var layer = e.layer;
                $this.showTipInfo(layer);
                $this.addFeature(layer);
            },
            onChange: function (e) {
                var layer = e.layer;
                $this.showTipInfo(layer);
                $this.updateFeature(layer);
            }
        });
        this.layerEdit = this.workDraw.getLayer();
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //激活插件
    activate: function () {
        this.workDraw.onEvnet();
        map.addLayer(this.layerEdit);

        map.on("draw:drawing", this._map_draw_drawing, this);
        map.on("draw:editing", this._map_draw_editing, this); 
    },

    //释放插件
    disable: function () {
        map.off("draw:drawing", this._map_draw_drawing, this);
        map.off("draw:editing", this._map_draw_editing, this);
        this.workDraw.destroy();
        this.removeFeatureLayer();

        this.layerEdit.clearLayers();
        map.removeLayer(this.layerEdit);
    },
    removeFeatureLayer: function () {
        if (this.layerFeature == null) return;

        this.layerFeature.off('loading', this._layerFeature_loadingHndler, this);
        this.layerFeature.off('load', this._layerFeature_loadHndler, this);

        map.removeLayer(this.layerFeature);
        this.layerFeature = null;
    },
    objResultFeature: {},
    thisLayerCfg: null,
    showLayer: function (item) {
        this.thisLayerCfg = item;

        this.removeFeatureLayer();
        this.layerEdit.clearLayers();

        item.type = 'arcgis_feature';
        this.layerFeature = L.mars.layer.createLayer(item);
        this.layerFeature.unbindPopup();
        this.layerFeature.bindPopup(function (evt) {
            var attr = evt.feature.properties;
            var inhtml = '<div style="width:310px;margin-top: 30px;" ><form class="form-horizontal">';

            for (var i = 0; i < item.columns.length; i++) {
                var thisfield = item.columns[i];
                var _label = thisfield.name;
                var _col = thisfield.field;
                var _val = attr[_col] || '';
                var _inputid = 'feature_' + _col;

                var editable = true;
                if (thisfield.hasOwnProperty("editable"))
                    editable = thisfield.editable;

                var _input;
                switch (thisfield.type) {
                    default://string
                        _input = '<input type="text" id="' + _inputid + '" class="form-control" value="' + _val + '"  ' + (editable ? '' : 'readonly') + ' />';
                        break;
                    case "number":
                        _input = '<input type="number"   id="' + _inputid + '" class="form-control" value="' + _val + '"  ' + (editable ? '' : 'readonly') + ' />';
                        break;
                    case "select":
                        if (thisfield.option == null && thisfield.option.length == 0) {
                            haouitl.alert('' + item.name + '图层的' + _label + '字段是多项选择，请配置其option参数！');
                        }
                        _input = '<select id="' + _inputid + '" class="form-control"    ' + (editable ? '' : 'disabled') + '  > <option value ="" ></option>';
                        for (var jj = 0; jj < thisfield.option.length; jj++) {
                            var op = thisfield.option[jj];
                            _input += ' <option value ="' + op.value + '"  ' + (op.value == _val ? 'selected="selected"' : '') + ' >' + op.name + '</option>';
                        }
                        _input += '</select>';
                        break;
                }

                inhtml += ' <div class="form-group">  <label for="' + _inputid + '" class="col-sm-3 control-label">' + _label + '</label><div class="col-sm-9"> ' + _input + '</div> </div>';

            }

            var _objectid = attr['OBJECTID'];
            inhtml += '<div class="form-group"><div class="col-sm-offset-3 col-sm-9"><input type="button" class="btn btn-primary  btn-sm" value="保存" onclick="widget_editFeature.saveEditFeature(' + _objectid + ')" />'
                + '&nbsp;&nbsp;<input type="button" class="btn btn-danger  btn-sm" value="删除" onclick="widget_editFeature.deleteEditFeature(' + _objectid + ')" /> </div></div>';

            inhtml += '</form></div>';
            return inhtml;
        });
        map.addLayer(this.layerFeature);

        this.layerFeature.on('loading', this._layerFeature_loadingHndler, this);
        this.layerFeature.on('load', this._layerFeature_loadHndler, this);
    },
    //========================   
    saveEditFeature: function (objectid) {
        var layer = this.objResultFeature[objectid];
        var attr = layer.feature.properties;

        for (var i = 0; i < this.thisLayerCfg.columns.length; i++) {
            var thisfield = this.thisLayerCfg.columns[i];
            var _label = thisfield.name;
            var _col = thisfield.field;
            var _inputid = 'feature_' + _col;
            var _val = $("#" + _inputid).val();

            switch (thisfield.type) {
                case "number":
                    if (_val == '') _val = null;
                    _val = Number(_val);
                    break;
                case "select":

                    break;
            }

            attr[_col] = _val;
        }
        this.updateFeature(layer);
    },
    deleteEditFeature: function (objectid) {
        var layer = this.objResultFeature[objectid];

        this.deleteFeatures([objectid]);
    },
    addFeature: function (layer) {
        layer.feature = layer.feature || {};
        layer.feature.properties = layer.feature.properties || { OBJECTID: 0 };

        var $this = this;
        this.layerFeature.addFeature({
            type: 'Feature',
            id: 0,
            geometry: layer.toGeoJSON().geometry,
            properties: layer.feature.properties
        }, function (error, response) {
            if (error != null && error.code > 0) {
                haoutil.alert('错误代码' + error.code + ':' + error.description, 'FeatureServer新增错误');
                return;
            }
            if (response && response.success) {
                var objectid = response.objectId;
                layer.feature.properties['OBJECTID'] = objectid;
                $this.objResultFeature[objectid] = layer;
                haoutil.msg('添加成功!');
                $this.viewWindow.refData($this.objResultFeature);
            }
        });
    },
    updateFeature: function (layer) {
        var $this = this;
        this.layerFeature.updateFeature({
            type: 'Feature',
            id: layer.feature.properties['OBJECTID'],
            geometry: layer.toGeoJSON().geometry,
            properties: layer.feature.properties
        }, function (error, response) {
            if (error != null && error.code > 0) {
                haoutil.alert('错误代码' + error.code + ':' + error.description, 'FeatureServer修改错误');
                return;
            }

            if (response && response.success) {
                haoutil.msg('修改成功!');
                $this.viewWindow.refData($this.objResultFeature);
                //关闭popup
                $this.layerFeature.closePopup();
            }
        });
    },
    deleteFeatures: function (delArray) {
        this.workDraw.stopDraw();
        var $this = this;

        this.layerFeature.closePopup();
        this.layerFeature.deleteFeatures(delArray, function (error, response) {
            if (error != null && error.code > 0) {
                haoutil.alert('错误代码' + error.code + ':' + error.description, 'FeatureServer删除错误');
                return;
            }
            if (response && response.length > 0) {
                haoutil.msg('删除成功!');
                $this.viewWindow.refData($this.objResultFeature);
            }
        });
    },
    //========================   
    _layerFeature_loadingHndler: function (e) {

    },
    _layerFeature_loadHndler: function (e) {
        var $this = this;

        $this.layerEdit.clearLayers();
        $this.layerFeature.eachFeature(function (layer) {
            $this.layerEdit.addLayer(layer);
            $this.bindDeleteContextmenu(layer);

            var atrr = layer.feature.properties;
            $this.objResultFeature[atrr.OBJECTID] = layer;
        });
        //map.fitBounds($this.layerEdit.getBounds());

        $this.viewWindow.showAllFrature($this.layerEdit.getLayers());
    },
    bindDeleteContextmenu: function (layer) {
        var $this = this;

        layer.bindContextMenu({
            contextmenu: true,
            contextmenuInheritItems: false,
            contextmenuItems: [{
                text: '删除',
                iconCls: 'fa fa-trash',
                context: layer,
                callback: function (e) {
                    var marker = this;//e.relatedTarget;
                    var id = marker.feature.id
                    $this.deleteFeatures([id]);
                }
            }]
        });
    },
    startAdd: function (type, symbol) {

        var symbolOptions;
        switch (type) {
            case "marker":
                symbolOptions = symbol.iconOptions;
                break;
            case "polyline":
            case "polygon":
                symbolOptions = symbol.styleOptions;
                break;
        }

        this.workDraw.startDraw(type, { style: symbolOptions });
    },
    cacheAdd: function () {
        this.workDraw.stopDraw();
    },
    centerAt: function (objectid) {
        var layer = this.objResultFeature[objectid];
        map.centerAtLayer(layer);
    },
    //
    _map_draw_drawing: function (e) {
        var layer = e.layer;
        var latlng = e.latlng;

        if (layer instanceof L.Polyline) {
            var latlngs = layer.getLatLngs().concat([latlng]);
            if (latlngs.length < 2) return;
            this.showTipInfo(L.polyline(latlngs));
        }
    },
    _map_draw_editing: function (e) {
        var layer = e.layer;
        this.showTipInfo(layer);
    },
    showTipInfo: function (layer) {
        var msg;
        if (layer instanceof L.Marker) {
            var latlng = layer.getLatLng();

            msg = "纬度：" + latlng.lat.toFixed(6) + "  经度：" + latlng.lng.toFixed(6);
        }
        else if (layer instanceof L.Polygon) {
            var latlngs = layer.getLatLngs();
            var area = L.mars.measure.areastr(latlngs);

            msg = "总面积：" + area;
        }
        else if (layer instanceof L.Polyline) {
            var latlngs = layer.getLatLngs();

            var length = L.mars.measure.lengthstr(latlngs);
            var length2 = L.mars.measure.lengthstr([latlngs[latlngs.length - 2], latlngs[latlngs.length - 1]]);

            var pt1 = map.latLngToContainerPoint(latlngs[latlngs.length - 2]);
            var pt2 = map.latLngToContainerPoint(latlngs[latlngs.length - 1]);
        
            var angle = L.mars.measure.getAngle(pt1, pt2);

            msg = "当前角度：" + angle + ",长度：" + length2;//+ ",总长：" + length;
        }

        if (msg)
            this.viewWindow.showMsg(msg);
    }



}));

