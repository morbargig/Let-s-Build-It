import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { ZonePoint, PartnerZone, ZoneType } from '../models/partner-zone.model';
import { MapsAPILoader } from '@agm/core';
import { config } from 'rxjs';
import { icon } from '@fortawesome/fontawesome-svg-core';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(mapsAPILoader: MapsAPILoader, private zone: NgZone) {
    mapsAPILoader.load().then(() => {
      this.managerOptions = {
        drawingControl: true,
        drawingControlOptions: {
          drawingModes: [],
        },
        polygonOptions: {
          draggable: true,
          editable: true,
          geodesic: true,
          clickable: true,
        },
        drawingMode: null,
      } as google.maps.drawing.DrawingManagerOptions;
    });
  }

  private drawingManager: google.maps.drawing.DrawingManager = null;
  private managerOptions: google.maps.drawing.DrawingManagerOptions = null;
  private overlays: google.maps.drawing.OverlayCompleteEvent[] = [];

  public overlayCompleted: EventEmitter<ZonePoint[]> = new EventEmitter<ZonePoint[]>();
  public zoneEdited: EventEmitter<PartnerZone> = new EventEmitter<PartnerZone>();

  private _map: google.maps.Map;
  public get map(): google.maps.Map {
    return this._map;
  }
  public set map(v: google.maps.Map) {
    this._map = v;
    this.initDrawingManager();
  }

  initDrawingManager(map: any = null) {
    map = map || this.map;
    this.drawingManager = new google.maps.drawing.DrawingManager(this.managerOptions);
    this.drawingManager.setMap(map);
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
      const typedEvt: google.maps.drawing.OverlayCompleteEvent = event as google.maps.drawing.OverlayCompleteEvent;
      let overlaysCnt = this.overlays?.length || 0;
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        this.overlays.push(typedEvt);
        const overlay = typedEvt.overlay as google.maps.Polygon;
        let points = overlay
          .getPath()
          .getArray()
          .map((p: { lat: () => number; lng: () => number }) => {
            return { lat: p.lat(), long: p.lng() };
          });
        overlaysCnt++;
      }
      if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
        this.overlays.push(typedEvt);
        const overlay = typedEvt.overlay as google.maps.Circle;
        let center = overlay.getCenter() as any;
        center = { lat: center.lat(), long: center.lng() };
        let radius = overlay.getRadius();
        overlaysCnt++;
      }

      let overlayRes = this.overlays.map((x) => {
        if (x.type === google.maps.drawing.OverlayType.POLYGON) {
          this.overlays.push(x);
          this.zoneDraws = [];
          const overlay = x.overlay as google.maps.Polygon;
          this.zoneDraws.push({ zone: null, shape: overlay });
          let points = overlay
            .getPath()
            .getArray()
            .map((p: { lat: () => number; lng: () => number }) => {
              return { lat: p.lat(), long: p.lng() };
            });
          return points.map((p) => {
            return {
              longitude: p.long,
              latitude: p.lat,
            } as ZonePoint;
          });
        }
        if (x.type === google.maps.drawing.OverlayType.CIRCLE) {
          this.overlays.push(x);
          this.zoneDraws = [];
          const overlay = x.overlay as google.maps.Circle;
          this.zoneDraws.push({ zone: null, shape: overlay });
          let center = overlay.getCenter() as any;
          center = { lat: center.lat(), long: center.lng() };
          let radius = overlay.getRadius();

          return [
            {
              longitude: center.long,
              latitude: center.lat,
              radius: radius,
            } as ZonePoint,
          ];
        }
      });

      // let oVals: any[] = [].concat.apply([], overlayRes);
      // this.pointsSetter.next({ type: 'onPatchValue', value: oVals } as FieldEvent)
      this.overlayCompleted.next(...overlayRes);

      this.drawingManager.setDrawingMode(null);
    });
  }

  clearAllOverlays() {
    this.zoneDraws?.forEach((zd) => {
      zd.shape.setMap(null);
    });

    this.zoneDraws = [];
    this.overlays = [];
    this.map.overlayMapTypes.setAt(0, null);
  }

  drawPolygon(polygon: google.maps.Polygon, disableZoom: boolean = false): google.maps.Polygon {
    var bounds = new google.maps.LatLngBounds();

    const changedAction = () => {
      const zoneDraw = this.zoneDraws.find((x) => x.shape === polygon);
      const zone = zoneDraw.zone;
      zone.points = [];
      polygon.getPaths().forEach((path) =>
        path.forEach((latlng) => {
          zone.points.push({ latitude: latlng.lat(), longitude: latlng.lng() });
        })
      );
      this.zoneEdited.next(zone);
    };

    polygon.getPaths().forEach((path) => {
      path.forEach((latlng) => {
        bounds.extend(latlng);
      });

      google.maps.event.addListener(path, 'insert_at', () => {
        console.log('New point');
        changedAction();
      });

      google.maps.event.addListener(path, 'remove_at', () => {
        console.log('Point was removed');
        changedAction();
      });

      google.maps.event.addListener(path, 'set_at', () => {
        console.log('Point was moved');
        changedAction();
      });
    });

    google.maps.event.addListener(polygon, 'dragend', () => {
      console.log('Polygon was dragged');
      changedAction();
    });

    polygon.setMap(this.map);
    if (!disableZoom) {
      setTimeout(() => {
        this.map.fitBounds(bounds);
      });
    }

    return polygon;
  }

  drawPolygonByPoints(
    zone: PartnerZone,
    config?: {
      paths: google.maps.LatLng[];
      strokeColor: string;
      strokeOpacity: number;
      strokeWeight: number;
      fillColor: string;
      fillOpacity: number;
    },
    disableZoom: boolean = false,
    editable: boolean = true
  ): google.maps.Polygon {
    const triangleCoords = zone.points.map((res) => new google.maps.LatLng(res.latitude, res.longitude));

    config = config || {
      paths: triangleCoords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    };

    const polygon = new google.maps.Polygon({
      paths: triangleCoords,
      editable: !!editable,
      draggable: !!editable,
      ...config,
    });

    this.zoneDraws.push({ zone: zone, shape: polygon });

    return this.drawPolygon(polygon, disableZoom);
  }

  public drawCircle(circle: google.maps.Circle, disableZoom: boolean = false): google.maps.Circle {
    circle.setMap(this.map);
    const changedAction = () => {
      const zoneDraw = this.zoneDraws.find((x) => x.shape === circle);
      const zone = zoneDraw.zone;
      zone.points = [];
      let center: google.maps.LatLng = circle.getCenter();
      let radius: number = circle.getRadius();
      zone.points.push({ latitude: center.lat(), longitude: center.lng(), radius: radius });
      this.zoneEdited.next(zone);
    };

    google.maps.event.addListener(circle, 'radius_changed', () => {
      console.log('Radius changed');
      changedAction();
    });

    google.maps.event.addListener(circle, 'center_changed', () => {
      console.log('Circle changed');
      changedAction();
    });

    google.maps.event.addListener(circle, 'dragend', () => {
      console.log('Circle was dragged');
      changedAction();
    });

    if (!disableZoom) {
      setTimeout(() => {
        this.map.fitBounds(circle.getBounds());
      });
    }
    return circle;
  }

  public getPointsCenter(partnerZone: PartnerZone): ZonePoint {
    let zonePoints = partnerZone.points;
    let temp = {
      longitude: 0,
      latitude: 0,
    };
    zonePoints?.forEach((i) => {
      temp.latitude += i.latitude;
      temp.longitude += i.longitude;
    });
    temp.latitude /= zonePoints.length;
    temp.longitude /= zonePoints.length;
    return temp;
  }

  public drawMarkerByPoint(
    zone: PartnerZone,
    config?: {
      iconUrl?: string;
      title?: string;
      subTitle?: string;
    },
    disableZoom: boolean = false,
    editable: boolean = true
  ) {
    let { longitude, latitude } = this.getPointsCenter(zone);
    const myLatLng = { lat: latitude, lng: longitude };

    const marker = new google.maps.Marker({
      position: myLatLng,
      icon: config.iconUrl,
      title: config?.title || zone?.name,
      label: config?.subTitle,
    });
    this.zoneDraws.push({ zone: zone, shape: marker });
    return this.drawMarker(marker, disableZoom);
  }

  public drawMarker(marker: google.maps.Marker, disableZoom: boolean = false): google.maps.Marker {
    marker.setMap(this.map);
    if (!disableZoom) {
      setTimeout(() => {
        let bounds = new google.maps.LatLngBounds();
        bounds.extend(marker.getPosition());
        this.map.fitBounds(bounds);
      });
    }
    return marker;
  }

  public drawCircleByPoint(
    zone: PartnerZone,
    config?: {
      strokeColor: string;
      strokeOpacity: number;
      strokeWeight: number;
      fillColor: string;
      fillOpacity: number;
      radius: number;
    },
    disableZoom: boolean = false,
    editable: boolean = true
  ): google.maps.Circle {
    const triangleCoords = zone.points.map((res) => new google.maps.LatLng(res.latitude, res.longitude));

    config = config || {
      radius: zone.points[0].radius,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    };

    const circle = new google.maps.Circle({
      center: triangleCoords[0],
      editable: !!editable,
      draggable: !!editable,
      ...config,
    });

    this.zoneDraws.push({ zone: zone, shape: circle });

    return this.drawCircle(circle, disableZoom);
  }

  public setDrawingMode(type: ZoneType) {
    switch (type) {
      case ZoneType.Circular:
        this.managerOptions.drawingMode = google.maps.drawing.OverlayType.CIRCLE;
        this.managerOptions.drawingControlOptions = { drawingModes: [google.maps.drawing.OverlayType.CIRCLE] };
        break;
      case ZoneType.Polygon:
        this.managerOptions.drawingMode = google.maps.drawing.OverlayType.POLYGON;
        this.managerOptions.drawingControlOptions = { drawingModes: [google.maps.drawing.OverlayType.POLYGON] };
        break;
      case ZoneType.Polyline:
        this.managerOptions.drawingMode = google.maps.drawing.OverlayType.POLYLINE;
        this.managerOptions.drawingControlOptions = { drawingModes: [google.maps.drawing.OverlayType.POLYLINE] };
        break;
      case ZoneType.Rectangle:
        this.managerOptions.drawingMode = google.maps.drawing.OverlayType.RECTANGLE;
        this.managerOptions.drawingControlOptions = { drawingModes: [google.maps.drawing.OverlayType.RECTANGLE] };
        break;
    }
    this.drawingManager.setOptions(this.managerOptions);
  }

  private overviewBounds: google.maps.LatLngBounds;
  private zoneDraws: { zone: PartnerZone; shape: google.maps.Circle | google.maps.Polygon | google.maps.Marker }[] = [];

  draw(
    zones: PartnerZone[],
    editable: boolean = true,
    config?: {
      iconUrl?: string;
      title?: string;
      subTitle?: string;
    }
  ) {
    var bounds = new google.maps.LatLngBounds();
    this.zoneDraws = [];
    const circles: google.maps.Circle[] = [];
    const polygons: google.maps.Polygon[] = [];
    for (let i = 0; i < zones.length; i++) {
      const zone = zones[i];
      switch (zone.zoneType) {
        case ZoneType.Marker:
          let marker = this.drawMarkerByPoint(zone, config, null, editable);
          bounds.extend(marker.getPosition());
          this.zoneDraws.push({ zone: zone, shape: marker });
          break;
        case ZoneType.Circular:
          let circle = this.drawCircleByPoint(zone, null, true, editable);
          bounds.extend(circle.getBounds().getCenter());
          this.zoneDraws.push({ zone: zone, shape: circle });
          break;
        case ZoneType.Polygon:
          let polygon = this.drawPolygonByPoints(zone, null, true, editable);
          polygon.getPaths().forEach((path) => {
            path.forEach((latlng) => {
              bounds.extend(latlng);
            });
          });
          this.zoneDraws.push({ zone: zone, shape: polygon });
          break;
      }
    }
    setTimeout(() => {
      this.overviewBounds = bounds;
      this.map.fitBounds(this.overviewBounds);
    });
  }

  public zoomTo(zone: PartnerZone) {
    var bounds = new google.maps.LatLngBounds();

    switch (zone.zoneType) {
      case ZoneType.Circular:
        let circle = this.drawCircleByPoint(zone, null, false, false);
        bounds.extend(circle.getBounds().getCenter());
        break;
      case ZoneType.Polygon:
        let polygon = this.drawPolygonByPoints(zone, null, false, false);
        polygon.getPaths().forEach((path) => {
          path.forEach((latlng) => {
            bounds.extend(latlng);
          });
        });
        break;
    }

    // setTimeout(() => {
    //   this.map.fitBounds(bounds);
    // });
  }

  public resetZoom() {
    if (!!this.overviewBounds) {
      setTimeout(() => {
        this.map.fitBounds(this.overviewBounds);
      });
    }
  }
}
