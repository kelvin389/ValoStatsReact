export interface MinimapData {
  xMultiplier: number;
  xScalar: number;
  yMultiplier: number;
  yScalar: number;
  icon: string;
}

export interface MapDat {
  status: number;
  data: Data[];
}

export interface Data {
  uuid: string;
  displayName: string;
  narrativeDescription: null;
  tacticalDescription: TacticalDescription | null;
  coordinates: null | string;
  displayIcon: null | string;
  listViewIcon: string;
  listViewIconTall: null | string;
  splash: string;
  stylizedBackgroundImage: null | string;
  premierBackgroundImage: null | string;
  assetPath: string;
  mapUrl: string;
  xMultiplier: number;
  yMultiplier: number;
  xScalarToAdd: number;
  yScalarToAdd: number;
  callouts: Callout[] | null;
}

export interface Callout {
  regionName: string;
  superRegionName: SuperRegionName;
  location: Location;
}

export interface Location {
  x: number;
  y: number;
}

export enum SuperRegionName {
  A = "A",
  AttackerSide = "Attacker Side",
  B = "B",
  C = "C",
  DefenderSide = "Defender Side",
  Mid = "Mid",
}

export enum TacticalDescription {
  ABCSites = "A/B/C Sites",
  ABSites = "A/B Sites",
}
