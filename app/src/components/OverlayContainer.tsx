import * as MatchTypes from "../types/MatchTypes";
import OverlayTable from "./OverlayTable";

interface OverlayContainerProps {
  matchData: MatchTypes.Match | null;
  puuid: string;
  hideOverlayCallback: () => void;
}

function OverlayContainer(props: OverlayContainerProps) {
  const data = props.matchData;

  if (!data) return;

  return (
    <div className="container max-w-6xl min-w-max bg-slate-600 px-4 py-2 m-auto">
      <button className="sticky top-3 left-3" onClick={props.hideOverlayCallback}>
        X
      </button>
      <OverlayTable matchData={data} puuid={props.puuid} teamPlayers={data.players.red} />
      <hr className="my-4" />
      <OverlayTable matchData={data} puuid={props.puuid} teamPlayers={data.players.blue} />
    </div>
  );
}

export default OverlayContainer;
