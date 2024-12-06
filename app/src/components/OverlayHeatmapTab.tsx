import { MutableRefObject, useEffect, useRef, useState } from "react";
import * as MatchTypes from "../types/MatchTypes";
import HeatMap from "heatmap-ts";
import { getMinimapData } from "../utils/MinimapData";
import { getAgentIconSrc } from "../utils/StringToImage";
import * as MapDatTypes from "../types/MapDatTypes";
import * as HeatmapConstants from "../constants/HeatmapConstants";
import Match from "./Match";

interface OverlayHeatmapTabProps {
  matchData: MatchTypes.Match;
  puuid: string;
}

interface Filters {
  KillDeath: FilterKillDeath;
  AttackDefend: FilterAttackDefend;
}

enum FilterKillDeath {
  Kill = 0,
  Death = 1,
  Both = 2,
}

enum FilterAttackDefend {
  Attack = 0,
  Defense = 1,
  Both = 2,
}

function OverlayHeatmapTab(props: OverlayHeatmapTabProps) {
  const matchData = props.matchData;
  const minimapData = getMinimapData(matchData.metadata.map.name);

  const heatmapDivRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HeatMap | null>(null);

  // initialize the heatmap to show the searched player
  const [curPuuid, setCurPuuid] = useState<string>(props.puuid);

  // initial filter states
  const [filters, setFilters] = useState<Filters>({
    KillDeath: FilterKillDeath.Kill,
    AttackDefend: FilterAttackDefend.Attack,
  });

  function updateFilterKillDeath(newVal: FilterKillDeath) {
    setFilters((old) => ({
      ...old,
      KillDeath: newVal,
    }));
  }

  function updateFilterAttackDefend(newVal: FilterAttackDefend) {
    setFilters((old) => ({
      ...old,
      AttackDefend: newVal,
    }));
  }

  // initialize heatmap
  useEffect(() => {
    heatmapRef.current = new HeatMap({
      container: heatmapDivRef.current!,
      radius: HeatmapConstants.RADIUS,
      maxOpacity: HeatmapConstants.MAX_OPACITY,
    });
    const init_pts = getHeatmapPoints(matchData, minimapData, curPuuid, filters);
    updateHeatmap(init_pts, heatmapRef);
  }, []);

  // update heatmap whenever filters or puuid is changed
  useEffect(() => {
    generateAndSetHeatmap(matchData, minimapData, curPuuid, heatmapRef, filters);
  }, [filters, curPuuid]);

  return (
    <>
      <div className="grid grid-cols-2 mt-4">
        <div className="grid grid-rows-2">
          <div className="w-full border">
            FILTERS:::::
            <div className="w-full">
              <button
                className={filters.KillDeath == FilterKillDeath.Kill ? "bg-gray-600" : ""}
                onClick={() => updateFilterKillDeath(FilterKillDeath.Kill)}
              >
                kills
              </button>
              <button
                className={filters.KillDeath == FilterKillDeath.Death ? "bg-gray-600" : ""}
                onClick={() => updateFilterKillDeath(FilterKillDeath.Death)}
              >
                deaths
              </button>
              <button
                className={filters.KillDeath == FilterKillDeath.Both ? "bg-gray-600" : ""}
                onClick={() => updateFilterKillDeath(FilterKillDeath.Both)}
              >
                both
              </button>
              {filters.KillDeath}
            </div>
            <div className="w-full">
              <button
                className={filters.AttackDefend == FilterAttackDefend.Attack ? "bg-gray-600" : ""}
                onClick={() => updateFilterAttackDefend(FilterAttackDefend.Attack)}
              >
                attack
              </button>
              <button
                className={filters.AttackDefend == FilterAttackDefend.Defense ? "bg-gray-600" : ""}
                onClick={() => updateFilterAttackDefend(FilterAttackDefend.Defense)}
              >
                defend
              </button>
              <button
                className={filters.AttackDefend == FilterAttackDefend.Both ? "bg-gray-600" : ""}
                onClick={() => updateFilterAttackDefend(FilterAttackDefend.Both)}
              >
                both
              </button>
              {filters.AttackDefend}
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
                    className={
                      (curPuuid == player.puuid ? "bg-gray-600" : "") +
                      " w-64 mb-1 border cursor-pointer"
                    }
                    onClick={() => {
                      setCurPuuid(player.puuid);
                    }}
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
                    className={
                      (curPuuid == player.puuid ? "bg-gray-600" : "") +
                      " w-64 mb-1 border cursor-pointer"
                    }
                    onClick={() => {
                      setCurPuuid(player.puuid);
                    }}
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

function getHeatmapPoints(
  matchData: MatchTypes.Match,
  minimapData: MapDatTypes.MinimapData,
  puuid: string,
  filters: Filters
) {
  let points = [];

  const startTeam = getPlayerStartTeam(matchData, puuid);

  // iterate every kill that occurred in this match
  for (let i = 0; i < matchData.kills.length; i++) {
    const kill = matchData.kills[i];

    /*************
    the filters below use guard statements to calculate whether
    we pass the filter or not. to explain:

      if (
        !(
          ( ... && ... ) ||   <--- this section checks if we PASS the filter
          ( ... && ... )
        )                     <--- then this flips the above boolean, ie. TRUE if we FAIL the filter
      ) {                     <--- and this boolean gets passed into the if statement
        continue;             <--- thus we continue (ie. don't process this round) if the FAIL the filter
      }

    ***************/

    // filter for kill/death
    if (
      !(
        ((filters.KillDeath == FilterKillDeath.Kill || filters.KillDeath == FilterKillDeath.Both) &&
          kill.killer.puuid == puuid) ||
        ((filters.KillDeath == FilterKillDeath.Death ||
          filters.KillDeath == FilterKillDeath.Both) &&
          kill.victim.puuid == puuid)
      )
    ) {
      continue;
    }

    // filter for attack/defend
    if (
      !(
        ((filters.AttackDefend == FilterAttackDefend.Attack ||
          filters.AttackDefend == FilterAttackDefend.Both) &&
          isAttacking(startTeam, kill.round)) ||
        ((filters.AttackDefend == FilterAttackDefend.Defense ||
          filters.AttackDefend == FilterAttackDefend.Both) &&
          !isAttacking(startTeam, kill.round))
      )
    ) {
      continue;
    }

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
          HeatmapConstants.MINIMAP_X_PX
      ),
      y: Math.floor(
        (kill.location.x * minimapData.yMultiplier + minimapData.yScalar) *
          HeatmapConstants.MINIMAP_Y_PX
      ),
      value: 1,
    };

    points.push(dataPt);
  }
  return points;
}

function updateHeatmap(points: any[], heatmapRef: MutableRefObject<HeatMap | null>) {
  if (heatmapRef == null) {
    return;
  }
  heatmapRef.current!.setData({
    max: HeatmapConstants.MAX,
    min: 0,
    data: points,
  });
}

function generateAndSetHeatmap(
  matchData: MatchTypes.Match,
  minimapData: MapDatTypes.MinimapData,
  puuid: string,
  heatmapRef: MutableRefObject<HeatMap | null>,
  filters: Filters
) {
  const points = getHeatmapPoints(matchData, minimapData, puuid, filters);
  updateHeatmap(points, heatmapRef);
}

function getPlayerStartTeam(matchData: MatchTypes.Match, puuid: string) {
  for (let i = 0; i < matchData.players.length; i++) {
    const player = matchData.players[i];
    if (player.puuid == puuid) {
      return player.team_id;
    }
  }
  return MatchTypes.TeamID.Red;
}

function isAttacking(startTeam: MatchTypes.TeamID, roundNumber: number) {
  // if the players starting team was red, then they start attack for first half (12 rounds)
  // in overtime (rounds >= 25) red attacks, then defends next round, continuing by alternating
  // thus the modulo statement. eg. 25 % 2 == 1, 25 % 2 == 0
  // then the opposite is done for blue team.
  if (
    (startTeam == MatchTypes.TeamID.Red && roundNumber <= 12) ||
    (startTeam == MatchTypes.TeamID.Red && roundNumber > 24 && roundNumber % 2 == 1) ||
    (startTeam == MatchTypes.TeamID.Blue && roundNumber > 12 && roundNumber <= 24) ||
    (startTeam == MatchTypes.TeamID.Blue && roundNumber > 24 && roundNumber % 2 == 0)
  )
    return true;
}

export default OverlayHeatmapTab;
