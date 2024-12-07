import { MutableRefObject, useEffect, useRef, useState } from "react";
import * as MatchTypes from "../types/MatchTypes";
import HeatMap from "heatmap-ts";
import { getMinimapData } from "../utils/MinimapData";
import { getAgentIconSrc } from "../utils/StringToImage";
import * as MapDatTypes from "../types/MapDatTypes";
import * as HeatmapConstants from "../constants/HeatmapConstants";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // css that must be imported to correctly draw slider

interface OverlayHeatmapTabProps {
  matchData: MatchTypes.Match;
  puuid: string;
}

interface Filters {
  KillDeath: FilterKillDeath;
  AttackDefend: FilterAttackDefend;
  PrePostPlant: FilterPrePostPlant;
  TimeRange: [number, number];
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

enum FilterPrePostPlant {
  Preplant = 0,
  Postplant = 1,
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
    KillDeath: FilterKillDeath.Both,
    AttackDefend: FilterAttackDefend.Both,
    PrePostPlant: FilterPrePostPlant.Both,
    TimeRange: [HeatmapConstants.TIME_MIN, HeatmapConstants.TIME_MAX],
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
  function updateFilterPrePostPlant(newVal: FilterPrePostPlant) {
    setFilters((old) => ({
      ...old,
      PrePostPlant: newVal,
    }));
  }
  function updateTimeRange(newVal: [number, number]) {
    setFilters((old) => ({
      ...old,
      TimeRange: newVal,
    }));
  }

  // initialize heatmap
  useEffect(() => {
    // this if statement prevents initialization of
    // 2 heatmaps when strict mode is enabled
    if (heatmapRef.current == null) {
      heatmapRef.current = new HeatMap({
        container: heatmapDivRef.current!,
        radius: HeatmapConstants.RADIUS,
        maxOpacity: HeatmapConstants.MAX_OPACITY,
      });
    }
    const init_pts = getHeatmapPoints(matchData, minimapData, curPuuid, filters);
    updateHeatmap(init_pts, heatmapRef);
  }, []);

  // update heatmap whenever filters or puuid is changed
  useEffect(() => {
    generateAndSetHeatmap(matchData, minimapData, curPuuid, heatmapRef, filters);
  }, [filters, curPuuid]);

  const [redPlayers, bluePlayers] = splitPlayersByTeam(matchData.players);

  const highlightStyle = " bg-gray-500";
  const leftButtonStyle = " rounded-l-lg";
  const rightButtonStyle = " rounded-r-lg";
  const allButtonStyle = " px-2";

  return (
    <>
      <div className="grid grid-cols-2 mt-4">
        <div className="flex flex-col">
          <div className="border flex flex-col pt-2 pb-4">
            <div className="text-center text-2xl">Filters</div>
            <div className="grid grid-cols-2 grid-rows-2 mt-1">
              <div className="flex items-center justify-center">
                {/* yeah these should probably be components but whatever */}
                <button
                  className={
                    (filters.KillDeath == FilterKillDeath.Kill ? highlightStyle : "") +
                    allButtonStyle +
                    leftButtonStyle
                  }
                  onClick={() => updateFilterKillDeath(FilterKillDeath.Kill)}
                >
                  Kills
                </button>
                <button
                  className={
                    (filters.KillDeath == FilterKillDeath.Both ? highlightStyle : "") +
                    allButtonStyle
                  }
                  onClick={() => updateFilterKillDeath(FilterKillDeath.Both)}
                >
                  Both
                </button>
                <button
                  className={
                    (filters.KillDeath == FilterKillDeath.Death ? highlightStyle : "") +
                    allButtonStyle +
                    rightButtonStyle
                  }
                  onClick={() => updateFilterKillDeath(FilterKillDeath.Death)}
                >
                  Deaths
                </button>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className={
                    (filters.AttackDefend == FilterAttackDefend.Attack ? highlightStyle : "") +
                    allButtonStyle +
                    leftButtonStyle
                  }
                  onClick={() => updateFilterAttackDefend(FilterAttackDefend.Attack)}
                >
                  Attack
                </button>
                <button
                  className={
                    (filters.AttackDefend == FilterAttackDefend.Both ? highlightStyle : "") +
                    allButtonStyle
                  }
                  onClick={() => updateFilterAttackDefend(FilterAttackDefend.Both)}
                >
                  Both
                </button>
                <button
                  className={
                    (filters.AttackDefend == FilterAttackDefend.Defense ? highlightStyle : "") +
                    allButtonStyle +
                    rightButtonStyle
                  }
                  onClick={() => updateFilterAttackDefend(FilterAttackDefend.Defense)}
                >
                  Defense
                </button>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className={
                    (filters.PrePostPlant == FilterPrePostPlant.Preplant ? highlightStyle : "") +
                    allButtonStyle +
                    leftButtonStyle
                  }
                  onClick={() => updateFilterPrePostPlant(FilterPrePostPlant.Preplant)}
                >
                  Pre-Plant
                </button>
                <button
                  className={
                    (filters.PrePostPlant == FilterPrePostPlant.Both ? highlightStyle : "") +
                    allButtonStyle
                  }
                  onClick={() => updateFilterPrePostPlant(FilterPrePostPlant.Both)}
                >
                  Both
                </button>
                <button
                  className={
                    (filters.PrePostPlant == FilterPrePostPlant.Postplant ? highlightStyle : "") +
                    allButtonStyle +
                    rightButtonStyle
                  }
                  onClick={() => updateFilterPrePostPlant(FilterPrePostPlant.Postplant)}
                >
                  Post-Plant
                </button>
              </div>
              <div className="flex items-center justify-center text-center">
                <div className="w-48">
                  Round Time
                  <Slider
                    range
                    min={HeatmapConstants.TIME_MIN}
                    max={HeatmapConstants.TIME_MAX}
                    step={5}
                    pushable
                    value={filters.TimeRange}
                    onChange={(newTimeRange) => updateTimeRange(newTimeRange as [number, number])}
                  />
                  {formatTime(filters.TimeRange[0]) + " - " + formatTime(filters.TimeRange[1])}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 my-auto">
            <div className="mx-auto">
              {redPlayers.map((player) => (
                <div
                  className={
                    (curPuuid == player.puuid ? "bg-gray-600" : "") +
                    " w-64 mb-1 border cursor-pointer"
                  }
                  onClick={() => {
                    setCurPuuid(player.puuid);
                  }}
                  key={player.puuid}
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
              {bluePlayers.map((player) => (
                <div
                  className={
                    (curPuuid == player.puuid ? "bg-gray-600" : "") +
                    " w-64 mb-1 border cursor-pointer"
                  }
                  onClick={() => {
                    setCurPuuid(player.puuid);
                  }}
                  key={player.puuid}
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
    // filter for pre/post plant
    if (
      !(
        ((filters.PrePostPlant == FilterPrePostPlant.Preplant ||
          filters.PrePostPlant == FilterPrePostPlant.Both) &&
          !isPostPlantKill(matchData, kill)) ||
        ((filters.PrePostPlant == FilterPrePostPlant.Postplant ||
          filters.PrePostPlant == FilterPrePostPlant.Both) &&
          isPostPlantKill(matchData, kill))
      )
    ) {
      continue;
    }
    // filter for time range
    const killTimeSec = kill.time_in_round_in_ms / 1000; // convert ms to sec
    if (!(filters.TimeRange[0] <= killTimeSec && killTimeSec <= filters.TimeRange[1])) {
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

function isAttacking(startTeam: MatchTypes.TeamID, roundNumber: number): boolean {
  // if the players starting team was red, then they start attack for first half (12 rounds)
  // in overtime (rounds >= 25) red attacks, then defends next round, continuing by alternating
  // thus the modulo statement. eg. 25 % 2 == 1, 25 % 2 == 0
  // then the opposite is done for blue team.
  if (
    (startTeam == MatchTypes.TeamID.Red && roundNumber <= 12) ||
    (startTeam == MatchTypes.TeamID.Red && roundNumber > 24 && roundNumber % 2 == 1) ||
    (startTeam == MatchTypes.TeamID.Blue && roundNumber > 12 && roundNumber <= 24) ||
    (startTeam == MatchTypes.TeamID.Blue && roundNumber > 24 && roundNumber % 2 == 0)
  ) {
    return true;
  }
  return false;
}

function isPostPlantKill(matchData: MatchTypes.Match, kill: MatchTypes.Kill): boolean {
  // if bomb was never planted then every kill is preplant
  if (matchData.rounds[kill.round].plant == null) {
    return false;
  }
  // if plant was after this kill event then it is a preplant kill
  if (matchData.rounds[kill.round].plant!.round_time_in_ms > kill.time_in_round_in_ms) {
    return false;
  }
  return true;
}

function splitPlayersByTeam(
  players: MatchTypes.Player[]
): [MatchTypes.Player[], MatchTypes.Player[]] {
  let redPlayers = [];
  let bluePlayers = [];

  for (let i = 0; i < players.length; i++) {
    const player = players[i];

    if (player.team_id == MatchTypes.TeamID.Red) {
      redPlayers.push(players[i]);
    } else if (player.team_id == MatchTypes.TeamID.Blue) {
      bluePlayers.push(players[i]);
    }
  }

  return [redPlayers, bluePlayers];
}

// format from seconds to "minutes:seconds"
function formatTime(sec: number): string {
  const minutes = Math.floor(sec / 60);
  const remainingSeconds = sec % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default OverlayHeatmapTab;
