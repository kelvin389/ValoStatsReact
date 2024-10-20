import * as MatchTypes from "../types/MatchTypes";
import { getAgentIconSrc, getRankIconSrc } from "../utils/StringToImage";
import { getEcoFrags, getRoundLostFrags, getRoundWonFrags } from "../utils/OverlayStatCalculations";
import {
  ECO_OP_MAX_LOADOUT_VAL,
  ECO_MY_MIN_LOADOUT_VAL,
} from "../constants/StatCalculationConstants";
import { Tooltip } from "react-tooltip";

interface OverlayTableProps {
  matchData: MatchTypes.Match;
  teamPlayers: MatchTypes.Player[];
  puuid: string;
}

function OverlayTable(props: OverlayTableProps) {
  const data = props.matchData;
  const teamPlayers = props.teamPlayers;

  const numRounds = data.rounds.length;
  return (
    <>
      <Tooltip id="stat-hint" />
      <table className="bg-slate-600 w-full text-center">
        <thead>
          <tr>
            <th className="w-12"></th>
            <th className="w-10"></th>
            <th className="w-72"></th>
            <th
              className="w-16"
              data-tooltip-id="stat-hint"
              data-tooltip-content={`Average Combat Score`}
            >
              ACS
            </th>
            <th className="w-16" data-tooltip-id="stat-hint" data-tooltip-content={`Kills`}>
              K
            </th>
            <th className="w-16" data-tooltip-id="stat-hint" data-tooltip-content={`Deaths`}>
              D
            </th>
            <th className="w-16" data-tooltip-id="stat-hint" data-tooltip-content={`Assists`}>
              A
            </th>
            <th
              className="w-16"
              data-tooltip-id="stat-hint"
              data-tooltip-content={`Average Damage per Round`}
            >
              ADR
            </th>
            <th
              className="w-16"
              data-tooltip-id="stat-hint"
              data-tooltip-content={`Round Won Frags`}
            >
              RWF
            </th>
            <th
              className="w-16"
              data-tooltip-id="stat-hint"
              data-tooltip-content={`Round Lost Frags`}
            >
              RLF
            </th>
            <th
              className="w-16"
              data-tooltip-id="stat-hint"
              data-tooltip-content={`Kills while team loadout value is greater than ${ECO_MY_MIN_LOADOUT_VAL} and opposing teams loadout value is less than ${ECO_OP_MAX_LOADOUT_VAL}`}
            >
              Ecos
            </th>
          </tr>
        </thead>
        <tbody>
          {teamPlayers.map((player: MatchTypes.Player) => (
            <tr>
              <td>
                <img src={getAgentIconSrc(player.character)} className="aspect-square w-12" />
              </td>
              <td>
                <img src={getRankIconSrc(player.currenttier)} className="aspect-square w-10" />
              </td>
              <td className="text-center">
                {player.name}#{player.tag}
              </td>
              <td>{Math.round(player.stats.score / numRounds)}</td>
              <td>{player.stats.kills}</td>
              <td>{player.stats.deaths}</td>
              <td>{player.stats.assists}</td>
              <td>{Math.round(player.damage_made / numRounds)}</td>
              <td>{getRoundWonFrags(player, data)}</td>
              <td>{getRoundLostFrags(player, data)}</td>
              <td>{getEcoFrags(player, data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default OverlayTable;
