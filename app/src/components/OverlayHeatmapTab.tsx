import { MutableRefObject, useEffect, useRef, useState } from "react";
import * as MatchTypes from "../types/MatchTypes";
import HeatMap from "heatmap-ts";
import { getMinimapData } from "../utils/MinimapData";
import { getAgentIconSrc } from "../utils/StringToImage";
import * as MapDatTypes from "../types/MapDatTypes";
import * as HeatmapConstants from "../constants/HeatmapConstants";

interface OverlayHeatmapTabProps {
  matchData: MatchTypes.Match;
  puuid: string;
}

function OverlayHeatmapTab(props: OverlayHeatmapTabProps) {
  const matchData = props.matchData;
  const minimapData = getMinimapData(matchData.metadata.map.name);

  // inital heatmap state will be kills for the searched player
  const init_pts = getKillPoints(matchData, minimapData, props.puuid);

  const heatmapDivRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HeatMap | null>(null);

  // initialize heatmap
  useEffect(() => {
    heatmapRef.current = new HeatMap({
      container: heatmapDivRef.current!,
      radius: 30,
      maxOpacity: 0.5,
    });
    updateHeatmap(init_pts, heatmapRef);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 mt-4">
        <div className="grid grid-rows-2">
          <div className="w-full border">
            FILTERS:::::
            <div className="w-full">
              <button>kills</button>
              <button>deaths</button>
              <button>both</button>
            </div>
            <div className="w-full">
              <button>attack</button>
              <button>defense</button>
              <button>both</button>
            </div>
            <div className="w-full">
              <button>preplant</button>
              <button>postplant</button>
              <button>both</button>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 mt-1">
            <div className="mx-auto">
              {matchData.players
                .slice(0, Math.floor(matchData.players.length / 2))
                .map((player) => (
                  <div
                    className="w-64 mb-1 border"
                    onClick={() =>
                      generateAndSetHeatmap(matchData, minimapData, player.puuid, heatmapRef)
                    }
                  >
                    <img
                      className="w-12 aspect-square inline"
                      src={getAgentIconSrc(player.agent.name)}
                    />
                    <span className="ml-2">{player.name}</span>
                  </div>
                ))}
            </div>
            <div className="mx-auto">
              {matchData.players
                .slice(Math.floor(matchData.players.length / 2), matchData.players.length)
                .map((player) => (
                  <div
                    className="w-64 mb-1 border"
                    onClick={() =>
                      generateAndSetHeatmap(matchData, minimapData, player.puuid, heatmapRef)
                    }
                  >
                    <img
                      className="w-12 aspect-square inline"
                      src={getAgentIconSrc(player.agent.name)}
                    />
                    <span className="ml-2">{player.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="m-auto border">
          <div
            className="w-[512px] h-[512px] bg-cover"
            style={{
              backgroundImage: `url(${minimapData.icon})`,
            }}
            ref={heatmapDivRef}
          ></div>
        </div>
      </div>
    </>
  );
}

function getKillPoints(
  matchData: MatchTypes.Match,
  minimapData: MapDatTypes.MinimapData,
  puuid: string
) {
  let points = [];

  // iterate every kill that occurred in this match
  for (let i = 0; i < matchData.kills.length; i++) {
    const kill = matchData.kills[i];

    // filter by kills for this player
    if (kill.killer.puuid == puuid) {
      const dataPt = {
        // calculations based on following discord message in HenrikDev Systems discord
        // additionally add floor because heatmap library doesnt work with decimals (why?)
        //
        // https://discord.com/channels/704231681309278228/1180628918584213594/1180628918584213594
        /*
            The values needed to translate in game coordinates to the mini-maps are the Riot official data. You can get them right off the maps info at: https://dash.valorant-api.com/endpoints/maps   xMultiplier and xScalarToAdd are the fields (or y versions).

            The way to translate in mostly straightforward however the swapping of game_y and game_x at the very start is likely what screwed people previously:
            IMPORTANT: The swap of game_x and game_y at the start is correct.

            x = game_y * valorant-api_map_x_multiplier + valorant-api_map_x_scalar_add;
            y = game_x * valorant-api_map_y_multiplier + valorant-api_map_y_scalar_add;

            x *= image.Width;
            y *= image.Height;
        */
        x: Math.floor(
          (kill.location.y * minimapData.xMultiplier + minimapData.xScalar) *
            HeatmapConstants.HEATMAP_MINIMAP_X_PX
        ),
        y: Math.floor(
          (kill.location.x * minimapData.yMultiplier + minimapData.yScalar) *
            HeatmapConstants.HEATMAP_MINIMAP_Y_PX
        ),
        value: 1,
      };

      points.push(dataPt);
    }
  }
  return points;
}

function updateHeatmap(points: any[], heatmapRef: MutableRefObject<HeatMap | null>) {
  if (heatmapRef == null) {
    return;
  }
  heatmapRef.current!.setData({
    max: 2,
    min: 0,
    data: points,
  });
}

function generateAndSetHeatmap(
  matchData: MatchTypes.Match,
  minimapData: MapDatTypes.MinimapData,
  puuid: string,
  heatmapRef: MutableRefObject<HeatMap | null>
) {
  const points = getKillPoints(matchData, minimapData, puuid);
  updateHeatmap(points, heatmapRef);
}

export default OverlayHeatmapTab;
