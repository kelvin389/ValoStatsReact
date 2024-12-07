import { MutableRefObject, useEffect, useRef, useState } from "react";
import * as MatchTypes from "../types/MatchTypes";
import HeatMap from "heatmap-ts";
import * as MapDatTypes from "../types/MapDatTypes";
import * as HeatmapConstants from "../constants/HeatmapConstants";
import "rc-slider/assets/index.css"; // css that must be imported to correctly draw slider
import * as HeatmapTypes from "../types/HeatmapTypes";

function getHeatmapPoints(
  matchData: MatchTypes.Match,
  minimapData: MapDatTypes.MinimapData,
  puuid: string,
  filters: HeatmapTypes.Filters
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
        ((filters.KillDeath == HeatmapTypes.FilterKillDeath.Kill ||
          filters.KillDeath == HeatmapTypes.FilterKillDeath.Both) &&
          kill.killer.puuid == puuid) ||
        ((filters.KillDeath == HeatmapTypes.FilterKillDeath.Death ||
          filters.KillDeath == HeatmapTypes.FilterKillDeath.Both) &&
          kill.victim.puuid == puuid)
      )
    ) {
      continue;
    }
    // filter for attack/defend
    if (
      !(
        ((filters.AttackDefend == HeatmapTypes.FilterAttackDefend.Attack ||
          filters.AttackDefend == HeatmapTypes.FilterAttackDefend.Both) &&
          isAttacking(startTeam, kill.round)) ||
        ((filters.AttackDefend == HeatmapTypes.FilterAttackDefend.Defense ||
          filters.AttackDefend == HeatmapTypes.FilterAttackDefend.Both) &&
          !isAttacking(startTeam, kill.round))
      )
    ) {
      continue;
    }
    // filter for pre/post plant
    if (
      !(
        ((filters.PrePostPlant == HeatmapTypes.FilterPrePostPlant.Preplant ||
          filters.PrePostPlant == HeatmapTypes.FilterPrePostPlant.Both) &&
          !isPostPlantKill(matchData, kill)) ||
        ((filters.PrePostPlant == HeatmapTypes.FilterPrePostPlant.Postplant ||
          filters.PrePostPlant == HeatmapTypes.FilterPrePostPlant.Both) &&
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
  filters: HeatmapTypes.Filters
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

export { splitPlayersByTeam, formatTime, getHeatmapPoints, generateAndSetHeatmap, updateHeatmap };
