import OverlayTable from "./OverlayTable";
import * as MatchTypes from "../types/MatchTypes";

interface OverlayScoreboardTabProps {
  matchData: MatchTypes.Match;
  puuid: string;
}

function OverlayScoreboardTab(props: OverlayScoreboardTabProps) {
  const data = props.matchData;

  let redPlayers = [];
  let bluePlayers = [];

  for (let i = 0; i < data.players.length; i++) {
    const player = data.players[i];

    if (player.team_id == MatchTypes.TeamID.Red) {
      redPlayers.push(player);
    } else if (player.team_id == MatchTypes.TeamID.Blue) {
      bluePlayers.push(player);
    }
  }

  return (
    <>
      <OverlayTable matchData={data} puuid={props.puuid} teamPlayers={redPlayers} />
      <hr className="my-4" />
      <OverlayTable matchData={data} puuid={props.puuid} teamPlayers={bluePlayers} />
    </>
  );
}

export default OverlayScoreboardTab;
