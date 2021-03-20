export interface PartnerZone {
  id?: number;
  partnerId: number;
  name: string;
  zoneType: ZoneType;
  pointsCount?: number;
  points?: ZonePoint[];
  created?: Date;
  updated?: Date;
}

export interface ZonePoint {
  id?: string;
  longitude: number;
  latitude: number;
  radius?: number;
  created?: Date;
  updated?: Date;
}

export enum ZoneType {
  Circular,
  Polygon,
  Polyline,
  Rectangle,
  Marker,
}
