import { MinimapIcons } from "../assets/images/minimaps";
import mapDat from "../assets/json/maps.json";
import * as MapDatTypes from "../types/MapDatTypes";

function getMinimapData(mapName: string) {
  const data = mapDat.data as MapDatTypes.Data[];
  for (let i = 0; i < data.length; i++) {
    if (data[i].displayName == mapName) {
      const mmd: MapDatTypes.MinimapData = {
        xMultiplier: data[i].xMultiplier,
        xScalar: data[i].xScalarToAdd,
        yMultiplier: data[i].yMultiplier,
        yScalar: data[i].yScalarToAdd,
        icon: MinimapIcons[mapName as keyof typeof MinimapIcons],
      };
      return mmd;
    }
  }
  // default error minimap data
  const mmd: MapDatTypes.MinimapData = {
    xMultiplier: -1,
    xScalar: -1,
    yMultiplier: -1,
    yScalar: -1,
    icon: MinimapIcons[mapName as keyof typeof MinimapIcons],
  };
  return mmd;
}

export { getMinimapData };
