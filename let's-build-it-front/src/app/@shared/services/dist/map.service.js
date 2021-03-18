"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MapService = void 0;
var core_1 = require("@angular/core");
var partner_zone_model_1 = require("../models/partner-zone.model");
var MapService = /** @class */ (function () {
    function MapService(mapsAPILoader, zone) {
        var _this = this;
        this.zone = zone;
        this.drawingManager = null;
        this.managerOptions = null;
        this.overlays = [];
        this.overlayCompleted = new core_1.EventEmitter();
        this.zoneEdited = new core_1.EventEmitter();
        this.zoneDraws = [];
        mapsAPILoader.load().then(function () {
            _this.managerOptions = {
                drawingControl: true,
                drawingControlOptions: {
                    drawingModes: []
                },
                polygonOptions: {
                    draggable: true,
                    editable: true,
                    geodesic: true,
                    clickable: true
                },
                drawingMode: null
            };
        });
    }
    Object.defineProperty(MapService.prototype, "map", {
        get: function () {
            return this._map;
        },
        set: function (v) {
            this._map = v;
            this.initDrawingManager();
        },
        enumerable: false,
        configurable: true
    });
    MapService.prototype.initDrawingManager = function (map) {
        var _this = this;
        if (map === void 0) { map = null; }
        map = map || this.map;
        this.drawingManager = new google.maps.drawing.DrawingManager(this.managerOptions);
        this.drawingManager.setMap(map);
        google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function (event) {
            var _a;
            var _b;
            var typedEvt = event;
            var overlaysCnt = ((_b = _this.overlays) === null || _b === void 0 ? void 0 : _b.length) || 0;
            if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                _this.overlays.push(typedEvt);
                var overlay = typedEvt.overlay;
                var points = overlay.getPath().getArray().map(function (p) { return { lat: p.lat(), long: p.lng() }; });
                overlaysCnt++;
            }
            if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
                _this.overlays.push(typedEvt);
                var overlay = typedEvt.overlay;
                var center = overlay.getCenter();
                center = { lat: center.lat(), long: center.lng() };
                var radius = overlay.getRadius();
                overlaysCnt++;
            }
            var overlayRes = _this.overlays.map(function (x) {
                if (x.type === google.maps.drawing.OverlayType.POLYGON) {
                    _this.overlays.push(x);
                    _this.zoneDraws = [];
                    var overlay = x.overlay;
                    _this.zoneDraws.push({ zone: null, shape: overlay });
                    var points = overlay.getPath().getArray().map(function (p) { return { lat: p.lat(), long: p.lng() }; });
                    return points.map(function (p) {
                        return {
                            longitude: p.long,
                            latitude: p.lat
                        };
                    });
                }
                if (x.type === google.maps.drawing.OverlayType.CIRCLE) {
                    _this.overlays.push(x);
                    _this.zoneDraws = [];
                    var overlay = x.overlay;
                    _this.zoneDraws.push({ zone: null, shape: overlay });
                    var center = overlay.getCenter();
                    center = { lat: center.lat(), long: center.lng() };
                    var radius = overlay.getRadius();
                    return [{
                            longitude: center.long,
                            latitude: center.lat,
                            radius: radius
                        }];
                }
            });
            // let oVals: any[] = [].concat.apply([], overlayRes);
            // this.pointsSetter.next({ type: 'onPatchValue', value: oVals } as FieldEvent)
            (_a = _this.overlayCompleted).next.apply(_a, overlayRes);
            _this.drawingManager.setDrawingMode(null);
        });
    };
    MapService.prototype.clearAllOverlays = function () {
        var _a;
        (_a = this.zoneDraws) === null || _a === void 0 ? void 0 : _a.forEach(function (zd) {
            zd.shape.setMap(null);
        });
        this.zoneDraws = [];
        this.overlays = [];
        this.map.overlayMapTypes.setAt(0, null);
    };
    MapService.prototype.drawPolygon = function (polygon, disableZoom) {
        var _this = this;
        if (disableZoom === void 0) { disableZoom = false; }
        var bounds = new google.maps.LatLngBounds();
        var changedAction = function () {
            var zoneDraw = _this.zoneDraws.find(function (x) { return x.shape === polygon; });
            var zone = zoneDraw.zone;
            zone.points = [];
            polygon.getPaths().forEach(function (path) {
                return path.forEach(function (latlng) {
                    zone.points.push({ latitude: latlng.lat(), longitude: latlng.lng() });
                });
            });
            _this.zoneEdited.next(zone);
        };
        polygon.getPaths().forEach(function (path) {
            path.forEach(function (latlng) {
                bounds.extend(latlng);
            });
            google.maps.event.addListener(path, 'insert_at', function () {
                console.log('New point');
                changedAction();
            });
            google.maps.event.addListener(path, 'remove_at', function () {
                console.log('Point was removed');
                changedAction();
            });
            google.maps.event.addListener(path, 'set_at', function () {
                console.log('Point was moved');
                changedAction();
            });
        });
        google.maps.event.addListener(polygon, 'dragend', function () {
            console.log('Polygon was dragged');
            changedAction();
        });
        polygon.setMap(this.map);
        if (!disableZoom) {
            setTimeout(function () {
                _this.map.fitBounds(bounds);
            });
        }
        return polygon;
    };
    MapService.prototype.drawPolygonByPoints = function (zone, config, disableZoom, editable) {
        if (disableZoom === void 0) { disableZoom = false; }
        if (editable === void 0) { editable = true; }
        var triangleCoords = zone.points.map(function (res) { return new google.maps.LatLng(res.latitude, res.longitude); });
        config = config || {
            paths: triangleCoords,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35
        };
        var polygon = new google.maps.Polygon(__assign({ paths: triangleCoords, editable: !!editable, draggable: !!editable }, config));
        this.zoneDraws.push({ zone: zone, shape: polygon });
        return this.drawPolygon(polygon, disableZoom);
    };
    MapService.prototype.drawCircle = function (circle, disableZoom) {
        var _this = this;
        if (disableZoom === void 0) { disableZoom = false; }
        circle.setMap(this.map);
        var changedAction = function () {
            var zoneDraw = _this.zoneDraws.find(function (x) { return x.shape === circle; });
            var zone = zoneDraw.zone;
            zone.points = [];
            var center = circle.getCenter();
            var radius = circle.getRadius();
            zone.points.push({ latitude: center.lat(), longitude: center.lng(), radius: radius });
            _this.zoneEdited.next(zone);
        };
        google.maps.event.addListener(circle, 'radius_changed', function () {
            console.log('Radius changed');
            changedAction();
        });
        google.maps.event.addListener(circle, 'center_changed', function () {
            console.log('Circle changed');
            changedAction();
        });
        google.maps.event.addListener(circle, 'dragend', function () {
            console.log('Circle was dragged');
            changedAction();
        });
        if (!disableZoom) {
            setTimeout(function () {
                _this.map.fitBounds(circle.getBounds());
            });
        }
        return circle;
    };
    MapService.prototype.drawCircleByPoint = function (zone, config, disableZoom, editable) {
        if (disableZoom === void 0) { disableZoom = false; }
        if (editable === void 0) { editable = true; }
        var triangleCoords = zone.points.map(function (res) { return new google.maps.LatLng(res.latitude, res.longitude); });
        config = config || {
            radius: zone.points[0].radius,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35
        };
        var circle = new google.maps.Circle(__assign({ center: triangleCoords[0], editable: !!editable, draggable: !!editable }, config));
        this.zoneDraws.push({ zone: zone, shape: circle });
        return this.drawCircle(circle, disableZoom);
    };
    MapService.prototype.setDrawingMode = function (type) {
        switch (type) {
            case partner_zone_model_1.ZoneType.Circular:
                this.managerOptions.drawingMode = google.maps.drawing.OverlayType.CIRCLE;
                this.managerOptions.drawingControlOptions = { drawingModes: [google.maps.drawing.OverlayType.CIRCLE] };
                break;
            case partner_zone_model_1.ZoneType.Polygon:
                this.managerOptions.drawingMode = google.maps.drawing.OverlayType.POLYGON;
                this.managerOptions.drawingControlOptions = { drawingModes: [google.maps.drawing.OverlayType.POLYGON] };
                break;
            case partner_zone_model_1.ZoneType.Polyline:
                this.managerOptions.drawingMode = google.maps.drawing.OverlayType.POLYLINE;
                this.managerOptions.drawingControlOptions = { drawingModes: [google.maps.drawing.OverlayType.POLYLINE] };
                break;
            case partner_zone_model_1.ZoneType.Rectangle:
                this.managerOptions.drawingMode = google.maps.drawing.OverlayType.RECTANGLE;
                this.managerOptions.drawingControlOptions = { drawingModes: [google.maps.drawing.OverlayType.RECTANGLE] };
                break;
        }
        this.drawingManager.setOptions(this.managerOptions);
    };
    MapService.prototype.draw = function (zones, editable) {
        var _this = this;
        if (editable === void 0) { editable = true; }
        var bounds = new google.maps.LatLngBounds();
        this.zoneDraws = [];
        var circles = [];
        var polygons = [];
        for (var i = 0; i < zones.length; i++) {
            var zone = zones[i];
            switch (zone.zoneType) {
                case partner_zone_model_1.ZoneType.Circular:
                    var circle = this.drawCircleByPoint(zone, null, true, editable);
                    bounds.extend(circle.getBounds().getCenter());
                    this.zoneDraws.push({ zone: zone, shape: circle });
                    break;
                case partner_zone_model_1.ZoneType.Polygon:
                    var polygon = this.drawPolygonByPoints(zone, null, true, editable);
                    polygon.getPaths().forEach(function (path) {
                        path.forEach(function (latlng) {
                            bounds.extend(latlng);
                        });
                    });
                    this.zoneDraws.push({ zone: zone, shape: polygon });
                    break;
            }
        }
        setTimeout(function () {
            _this.overviewBounds = bounds;
            _this.map.fitBounds(_this.overviewBounds);
        });
    };
    MapService.prototype.zoomTo = function (zone) {
        var bounds = new google.maps.LatLngBounds();
        debugger;
        switch (zone.zoneType) {
            case partner_zone_model_1.ZoneType.Circular:
                debugger;
                var circle = this.drawCircleByPoint(zone, null, false, false);
                bounds.extend(circle.getBounds().getCenter());
                break;
            case partner_zone_model_1.ZoneType.Polygon:
                debugger;
                var polygon = this.drawPolygonByPoints(zone, null, false, false);
                polygon.getPaths().forEach(function (path) {
                    path.forEach(function (latlng) {
                        bounds.extend(latlng);
                    });
                });
                break;
        }
        // setTimeout(() => {
        //   this.map.fitBounds(bounds);
        // });
    };
    MapService.prototype.resetZoom = function () {
        var _this = this;
        if (!!this.overviewBounds) {
            setTimeout(function () {
                _this.map.fitBounds(_this.overviewBounds);
            });
        }
    };
    MapService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], MapService);
    return MapService;
}());
exports.MapService = MapService;
