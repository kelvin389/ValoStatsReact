import { useState } from "react";
import * as MatchTypes from "../types/MatchTypes";
import OverlayScoreboardTab from "./OverlayScoreboardTab";
import OverlayHeatmapTab from "./OverlayHeatmapTab";

interface OverlayContainerProps {
  matchData: MatchTypes.Match | null;
  puuid: string;
  hideOverlayCallback: () => void;
}

enum Tab {
  Scoreboard = 0,
  Heatmaps = 1,
}

function renderTab(tab: Tab, props: OverlayContainerProps) {
  switch (tab) {
    // props.matchData is checked to not be null before this function is called
    // so can be asserted matchData is not null here
    case Tab.Scoreboard:
      return <OverlayScoreboardTab matchData={props.matchData!} puuid={props.puuid} />;
    case Tab.Heatmaps:
      return <OverlayHeatmapTab matchData={props.matchData!} puuid={props.puuid} />;

    default:
      return <h1>attempted to open non-existent tab</h1>;
  }
}

function OverlayContainer(props: OverlayContainerProps) {
  const [tab, setTab] = useState<Tab>(Tab.Scoreboard); // initial tab is scoreboard

  if (!props.matchData) return;

  return (
    <>
      <div className="container max-w-6xl min-w-max bg-neutral-800 px-4 py-2 m-auto">
        <button className="sticky top-3 left-4" onClick={props.hideOverlayCallback}>
          ✖
        </button>
        <button className="top-3 left-4 ml-4" onClick={() => setTab(Tab.Scoreboard)}>
          Scoreboard
        </button>
        <button className="top-3 left-4 ml-1" onClick={() => setTab(Tab.Heatmaps)}>
          Heatmaps
        </button>
        {renderTab(tab, props)}
      </div>
    </>
  );
}

export default OverlayContainer;
