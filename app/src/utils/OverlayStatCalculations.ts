import * as MatchTypes from "../types/MatchTypes";
import {
  ECO_MY_MIN_LOADOUT_VAL,
  ECO_OP_MAX_LOADOUT_VAL,
} from "../constants/StatCalculationConstants";

function getRoundWonFrags(
  player: MatchTypes.Player,
  data: MatchTypes.Match
): number {
  const rounds = data.rounds;

  let rlf = 0;
  for (let i = 0; i < rounds.length; i++) {
    const pStats = rounds[i].player_stats;

    for (let j = 0; j < pStats.length; j++) {
      if (
        player.puuid == pStats[j].player_puuid && // match player
        player.team == rounds[i].winning_team // if won round
      ) {
        rlf += pStats[j].kills;
      }
    }
  }
  return rlf;
}

function getRoundLostFrags(
  player: MatchTypes.Player,
  data: MatchTypes.Match
): number {
  const rounds = data.rounds;

  let rlf = 0;
  for (let i = 0; i < rounds.length; i++) {
    const pStats = rounds[i].player_stats;

    for (let j = 0; j < pStats.length; j++) {
      if (
        player.puuid == pStats[j].player_puuid && // match player
        player.team != rounds[i].winning_team // if won round
      ) {
        rlf += pStats[j].kills;
      }
    }
  }
  return rlf;
}

function getEcoFrags(
  player: MatchTypes.Player,
  data: MatchTypes.Match
): number {
  const rounds = data.rounds;

  let ecos = 0;
  for (let i = 0; i < rounds.length; i++) {
    const pStats = rounds[i].player_stats;

    // measure team loadout value for my team and opponents team for round i
    let myTeamEco = 0;
    let opTeamEco = 0;

    for (let j = 0; j < pStats.length; j++) {
      if (player.team == pStats[j].player_team) {
        myTeamEco += pStats[j].economy.loadout_value;
      } else {
        opTeamEco += pStats[j].economy.loadout_value;
      }
    }

    for (let j = 0; j < pStats.length; j++) {
      if (
        player.puuid == pStats[j].player_puuid && // match player
        myTeamEco > ECO_MY_MIN_LOADOUT_VAL && // player team has at least min val
        opTeamEco < ECO_OP_MAX_LOADOUT_VAL // opponent team has at most max val
      ) {
        ecos += pStats[j].kills;
      }
    }
  }
  return ecos;
}

export { getRoundWonFrags, getRoundLostFrags, getEcoFrags };