function initSelfCrs() {
    var origin = [-20037508.342787001, 20037508.342787001];
    var resolutions = [];
    var lods = [{ "level": 0, "resolution": 156543.03392800014, "scale": 591657527.591555 },
        { "level": 1, "resolution": 78271.516963999937, "scale": 295828763.79577702 },
        { "level": 2, "resolution": 39135.758482000092, "scale": 147914381.89788899 },
        { "level": 3, "resolution": 19567.879240999919, "scale": 73957190.948944002 },
        { "level": 4, "resolution": 9783.9396204999593, "scale": 36978595.474472001 },
        { "level": 5, "resolution": 4891.9698102499797, "scale": 18489297.737236001 }
        , { "level": 6, "resolution": 2445.9849051249898, "scale": 9244648.8686180003 }
        , { "level": 7, "resolution": 1222.9924525624949, "scale": 4622324.4343090001 }
        , { "level": 8, "resolution": 611.49622628137968, "scale": 2311162.2171550002 }
        , { "level": 9, "resolution": 305.74811314055756, "scale": 1155581.108577 }
        , { "level": 10, "resolution": 152.87405657041106, "scale": 577790.55428899999 }
        , { "level": 11, "resolution": 76.437028285073239, "scale": 288895.27714399999 }
        , { "level": 12, "resolution": 38.21851414253662, "scale": 144447.638572 }
        , { "level": 13, "resolution": 19.10925707126831, "scale": 72223.819285999998 }
        , { "level": 14, "resolution": 9.5546285356341549, "scale": 36111.909642999999 }
        , { "level": 15, "resolution": 4.7773142679493699, "scale": 18055.954822 }
        , { "level": 16, "resolution": 2.3886571339746849, "scale": 9027.9774109999998 }
        , { "level": 17, "resolution": 1.1943285668550503, "scale": 4513.9887049999998 }
        , { "level": 18, "resolution": 0.59716428355981721, "scale": 2256.994353 }
        , { "level": 19, "resolution": 0.29858214164761665, "scale": 1128.4971760000001 }
        , { "level": 20, "resolution": 0.14912465871856517, "scale": 563.61963011999137}];

    for (var i in lods) {

        resolutions.push(lods[i].resolution);
    }
    //+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs
    L.CRS.CommonCRS = new L.Proj.CRS('EPSG:4537', '+proj=longlat +lat_0=0 +lon_0=84 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', {
        origin: origin,
        resolutions: resolutions,
        bounds: L.bounds([-20037508.342787001, -20037508.342787001], [20037508.342787001, 20037508.342787001])
    });
}
initSelfCrs();