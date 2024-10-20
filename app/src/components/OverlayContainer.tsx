import * as MatchTypes from "../types/MatchTypes";
import OverlayTable from "./OverlayTable";

interface OverlayMatchProps {
  matchData: MatchTypes.Match | null;
  puuid: string;
}

function OverlayMatch(props: OverlayMatchProps) {
  const data = props.matchData;

  if (!data) return;

  return (
    <div className="container max-w-6xl">
      <OverlayTable matchData={data} puuid={props.puuid} teamPlayers={data.players.red} />
      <hr />
      <OverlayTable matchData={data} puuid={props.puuid} teamPlayers={data.players.blue} />
    </div>
  );
}

export default OverlayMatch;
