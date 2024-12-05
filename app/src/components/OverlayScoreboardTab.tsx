import OverlayTable from "./OverlayTable";
import * as MatchTypes from "../types/MatchTypes";

interface OverlayScoreboardTabProps {
  matchData: MatchTypes.Match;
  puuid: string;
}

function OverlayScoreboardTab(props: OverlayScoreboardTabProps) {
  const data = props.matchData;

  return (
    <>
      <OverlayTable matchData={data} puuid={props.puuid} teamPlayers={data.players.red} />
      <hr className="my-4" />
      <OverlayTable matchData={data} puuid={props.puuid} teamPlayers={data.players.blue} />
    </>
  );
}

export default OverlayScoreboardTab;
