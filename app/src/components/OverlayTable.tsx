import * as MatchTypes from "../types/MatchTypes";
import { getAgentIconSrc, getRankIconSrc } from "../utils/StringToImage";

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
    <table className="bg-slate-600 w-full text-center">
      <thead>
        <tr>
          <th className="w-12"></th>
          <th className="w-10"></th>
          <th className="w-72"></th>
          <th className="w-16">ACS</th>
          <th className="w-16">K</th>
          <th className="w-16">D</th>
          <th className="w-16">A</th>
          <th className="w-16">ADR</th>
        </tr>
      </thead>
      <tbody>
        {teamPlayers.map((player: MatchTypes.Player) => (
          <tr>
            <td>
              <img
                src={getAgentIconSrc(player.character)}
                className="aspect-square w-12"
              />
            </td>
            <td>
              <img
                src={getRankIconSrc(player.currenttier)}
                className="aspect-square w-10"
              />
            </td>
            <td className="text-center">
              {player.name}#{player.tag}
            </td>
            <td>{Math.round(player.stats.score / numRounds)}</td>
            <td>{player.stats.kills}</td>
            <td>{player.stats.deaths}</td>
            <td>{player.stats.assists}</td>
            <td>{Math.round(player.damage_made / numRounds)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OverlayTable;
