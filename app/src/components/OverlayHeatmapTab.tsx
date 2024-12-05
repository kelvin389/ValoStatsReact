import OverlayTable from "./OverlayTable";
import * as MatchTypes from "../types/MatchTypes";

interface OverlayHeatmapTabProps {
  matchData: MatchTypes.Match;
  puuid: string;
}

function OverlayHeatmapTab(props: OverlayHeatmapTabProps) {
  const matchData = props.matchData;
  let killLocs = [];

  // iterate every kill that occurred in this match
  for (let i = 0; i < matchData.kills.length; i++) {
    const kill = matchData.kills[i];

    // filter by kills for this player
    if (kill.killer.puuid == props.puuid) {
      // push location to list
      killLocs.push(kill.location);
    }
  }

  return <h1>a</h1>;
}

export default OverlayHeatmapTab;
