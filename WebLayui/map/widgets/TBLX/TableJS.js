/* 2017-11-25 14:19:42 | 修改 木遥（QQ：346819890） */
//模块： 
L.widget.bindClass(L.widget.BaseWidget.extend({
	map: null, //框架会自动对map赋值
	options: {
		//弹窗
		view: {
			type: "window",
			url: "table.html",
			windowOptions: {
				width: 470,
				height: window.screen.availHeight * 3.7 / 6,
				position: {
					left: document.body.clientWidth / 6,
					top: 0
				},
				closeBtn: 1
			}
		}
	},
	infoindex: -1,
	viewWindow: null,
	FeaturesGroup: null,
	singleFeatureGroup: null,
	ZhenLayer: null,
	widgetThis: null,
	Windowthis: null,
	ThisIndex: null,
	classObject: null,
	QuhuaURL: "http://10.32.49.10:6080/arcgis/rest/services/QUHUA/MapServer/3",
	JCTBTurl: "http://10.32.49.10:6080/arcgis/rest/services/JCPOLYGON/MapServer/0",

	//初始化[仅执行1次]
	create: function (viewopt) {

	},
	//激活插件
	activate: function (hhh) { },
	//每个窗口创建完成后调用
	winCreateOK: function (viewopt, html) {
		this.viewWindow = html; //Layer里面得内容，即table.html
		widgetThis = this;
		Windowthis = html.parent;

		classObject = document.getElementsByClassName("layui-layer-close");
		if (classObject != null) {
			debugger
			classObject[0].addEventListener('click', Windowthis.RemoveStyle, false);
		} //关键，解决了点击Layer的关闭按钮，触发事件，去除按钮的clickStyle!!
	},

	///刷新Table页面也运行disable函数
	disable: function () {
		if (Windowthis.FeaturesGroup) {
			map.removeLayer(Windowthis.FeaturesGroup);
		}
		if (Windowthis.ZhenLayer) {
			map.removeLayer(Windowthis.ZhenLayer);
		}
		if (Windowthis.singleFeatureGroup) {
			Windowthis.singleFeatureGroup.clearLayers();
		}
	},
	doqueryAll: function (index, LXname, div1Obj, tableObj) {
		debugger
		var lquery = L.esri.query({
			url: widgetThis.JCTBTurl
		});
		if (LXname === 'all') {
			lquery.where("1=1" + this.viewWindow.jcpcwhere);
		} else {
			ThisIndex = index;
			lquery.where("TBLX='" + index + "'" + this.viewWindow.jcpcwhere);
		}
		lquery.run(function (error, results, response) {
			if (error) {
				return;
			} else {
				var coloruse;
				var oldTarget = null;
				var resultJson = L.geoJSON(results, {
					style: function (feature) {
						coloruse = widgetThis.getcolor(feature.properties.TBLX);
						return {
							weight: 3.0,
							color: 'red',
							dashArray: '',
							fillOpacity: 0,
							fillColor: coloruse
						};
					},

					onEachFeature: function (feature, layer) {
						debugger
						var attr = feature.properties;
						var TBLX;
						var TBLXbh = attr.TBLX;
						if (LXname === 'all') {
							if (TBLXbh < 17) {
								TBLX = widgetThis.viewWindow.TBLXList[TBLXbh - 1][TBLXbh];
							} else {
								TBLX = "未知";
							}

						} else {
							TBLX = LXname;
						}
						var html = "<div><h5>【图斑类型】：" + TBLX + "</h5>" + "<h5>【所在市】：" + attr.SMC + "</h5>" + "<h5>【区域】：" + attr.XMC + attr.ZMC + "</h5>" + "<h5>【面积】：" + (attr.JCMJ / 666.666).toFixed(3) + "亩</h5>" + "<h5>【发现时间】：" + attr.JCPC + "</h5>" + "</div>";
						layer.bindTooltip(html);
						//layer.bindPopup(html);
						if (!L.Browser.ie && !L.Browser.opera) {
							layer.bringToFront();
						}
						layer.on({
							mouseover: function (e) {
								//this.viewWindow.showTip(layer.feature.properties);
							},
							mouseout: function (e) {
								//resultJson.resetStyle(e.target);
							},
							click: function (e) {
								debugger
								if (oldTarget != null) {
									resultJson.resetStyle(oldTarget);
								}
								if (Windowthis.singleFeatureGroup) {
									Windowthis.singleFeatureGroup.clearLayers();
								}
								//map.fitBounds(e.target.getBounds());
								var center = e.target.getCenter(); //getLatLng()
								map.flyTo([center.lat, center.lng], 14.5);
								var newTarget = e.target;
								newTarget.setStyle({
									weight: 2,
									color: 'black',
									dashArray: '',
									fillOpacity: 0.4
								});
								oldTarget = newTarget;
								window.parent.flashFeature = newTarget;

								widgetThis.showTBinfo(e.target.feature.properties, TBLX, div1Obj, tableObj);
								widgetThis.showHistory();
							}
						});
					}
				});
				if (Windowthis.FeaturesGroup) {
					Windowthis.FeaturesGroup.clearLayers();
				}
				if (Windowthis.singleFeatureGroup) {
					Windowthis.singleFeatureGroup.clearLayers();
				}
				if (Windowthis.ZhenLayer) {
					Windowthis.ZhenLayer.clearLayers();
				}
				resultJson.addTo(map);
				map.fitBounds(resultJson.getBounds());
				debugger
				Windowthis.FeaturesGroup = resultJson;
			}
		});
	},
	showTBinfo: function (feature, TBLX, div1Obj, tableObj) {
		debugger
		var htmltable = "<div class='result1' style='width: 100%; overflow: auto; position: relative;float:right;margin-top:5px;margin-right:0px;margin-buttom:0px;margin-left:0'>" + "<table class='table table-bordered' style='text-align:center' >" + "<tr><td class='right'>图斑类型</td><td>" + TBLX + "</td></tr>" + "<tr><td class='right'>所在市</td><td>" + feature.SMC + "</td></tr>" + "<tr><td class='right'>区域</td><td id='Td6'>" + feature.XMC + feature.ZMC + "</td></tr>" + "<tr><td class='first right'>面积</td><td id='orbitnumb'>" + (feature.JCMJ / 666.666).toFixed(3) + "亩</td></tr>" + "<tr><td class='first right'>发现时间</td><td id='Td4'>" + feature.JCPC + "</td></tr>";
		tableObj.html(htmltable);
		var finalHtml = div1Obj.html();
		if (this.infoindex != -1) {
			layer.close(this.infoindex);
		}
		this.infoindex = layer.open({
			type: 1,
			zIndex: "88888888888",
			title: "图斑信息",
			fixed: false,
			maxmin: false,
			shade: 0,
			offset: 'rt',
			content: finalHtml,
			cancel: function (layero, index) {
				infoindex = -1;
			}
		});
		//      $(".right").css('background-color', '#1B548D ');   #eff3f6
		$(".right").css('font-weight', 'bold');
	},
	showHistory: function () {
		debugger
		if (L.widget.isActivate('widgets/MultiMapCompare/MultiMapCompare.js?TBLX=other')) {
			var widget = L.widget.getWidget('widgets/MultiMapCompare/MultiMapCompare.js?TBLX=other');
			widget._class.activate();
		} else {
			L.widget.activate({
				uri: 'widgets/MultiMapCompare/MultiMapCompare.js?TBLX=other',
				name: '<i class="fa fa-share-alt" style:"font-size:10px"></i>历史追溯' || '',
				"autoDisable": true,
				"disableOhter": false
			});
		}
	},

	//查询地图
	queryMapByWhere: function (featurelayerurl, where) {
		var lquery = L.esri.query({
			url: featurelayerurl
		});
		debugger
		lquery.where(where);
		lquery.run(function (error, featureCollection, response) {
			if (featureCollection != null) {
				var resultJson = L.geoJSON(featureCollection, {
					style: function (feature) {
						return {
							weight: 2.5,
							color: 'white',
							dashArray: '3',
							fillOpacity: 0.2,
							fillColor: 'gray'
						};
					}
				});
				if (Windowthis.ZhenLayer) {
					Windowthis.ZhenLayer.clearLayers();
				}
				resultJson.addTo(map);
				var showExtent = resultJson.getBounds();
				map.fitBounds(showExtent, {
					maxZoom: 16
				});

				if (Windowthis.FeaturesGroup) {
					Windowthis.FeaturesGroup.bringToFront();
				} //很关键。将featureGroup提到最前面

				Windowthis.ZhenLayer = resultJson;
			} else {
				alert("未查到镇数据！")
			};
		});
	},
	queryMapByFeature: function (obj_id) {
		var lquery = L.esri.query({
			url: widgetThis.JCTBTurl
		});
		lquery.where("OBJECTID='" + obj_id + "'");

		lquery.run(function (error, results, response) {
			if (error) {
				return;
			} else {
				var resultJson = L.geoJSON(results, {
					style: function (feature) {
						return {
							weight: 1.5,
							color: 'black',
							dashArray: '',
							fillOpacity: 0.3
						};
					}
				});
			}
			if (Windowthis.singleFeatureGroup) {
				Windowthis.singleFeatureGroup.clearLayers();
			}
			resultJson.addTo(map);
			widgetThis.ZoomToGeometry(resultJson);   //缩放
			if (Windowthis.FeaturesGroup) {
				Windowthis.FeaturesGroup.bringToFront();
			} //很关键。将featureGroup提到最前面
			Windowthis.singleFeatureGroup = resultJson;
		})
	},
	getcolor: function (TBLX_index) {
		var color;
		switch (TBLX_index) {
			case "1":
				color = 'black';
				break;
			case "2":
				color = 'red';
				break;
			case "3":
				color = 'purple';
				break;
			case "4":
				color = 'yellow';
				break;
			case "5":
				color = 'black';
				break;
			case "6":
				color = 'black';
				break;
			case "7":
				color = 'black';
				break;
			case "8":
				color = 'black';
				break;
			case "9":
				color = 'black';
				break;
			default:
				color = 'green';

		}
		return color;
	},
	switchArray: function (arr, index1, index2) {
		var $this = this;
		var arrswitch = new Object();
		arrswitch = arr;
		var count = 0;
		var zarrtobject = [];
		for (i = 0; i < arrswitch.length; i++) {
			try {
				var temp = arrswitch[i][index2];
				if (temp instanceof Array) {

					var rtemp = arrswitch[i];
					for (j = 0; j < rtemp.length; j++) {
						zarrtobject[count] = [];
						var dptemp = rtemp[j][0];
						if (dptemp > rtemp[j][1]) {
							zarrtobject[count][index1] = rtemp[j][1];
							zarrtobject[count][index2] = dptemp;
						} else {
							zarrtobject[count][index1] = dptemp;
							zarrtobject[count][index2] = rtemp[j][1];
						}
						count++;
					}

				} else {
					if (temp > arrswitch[i][index1]) {
						arrswitch[i][index1] = arrswitch[i][index1];
						arrswitch[i][index2] = temp;
					} else {
						arrswitch[i][index2] = arrswitch[i][index1];
						arrswitch[i][index1] = temp;
					}
					zarrtobject[count] = arrswitch[i];
					count++;
				}

			} catch (error) {

			}
		}
		return zarrtobject;
	},
	ZoomToGeometry: function (geometry) {
		if (geometry instanceof L.marker || geometry instanceof L.circle || geometry instanceof L.circleMarker) {
			map.setView(geometry.getLatLng(), map.getZoom());
		} else {
			var showExtent = geometry.getBounds().extend(2);
			map.fitBounds(showExtent, {
				maxZoom: 15
			});
		}
	}
}));