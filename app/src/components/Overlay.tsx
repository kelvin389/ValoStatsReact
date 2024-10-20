import * as MatchTypes from "../types/MatchTypes";
import OverlayMatch from "./OverlayContainer";
import "../styles/Overlay.css";

interface OverlayProps {
  showOverlay: boolean;
  overlayMatchData: MatchTypes.Match | null;
  puuid: string;
  hideOverlayCallback: () => void;
}

function Overlay(props: OverlayProps) {
  if (props.showOverlay) {
    return (
      <div
        className="overlay"
        onClick={(event) => {
          // clicking on children of this element doesnt hide overlay
          if (event.target == event.currentTarget) props.hideOverlayCallback();
        }}
      >
        <OverlayMatch matchData={props.overlayMatchData} puuid={props.puuid} />
      </div>
    );
  }
  return;
}

export default Overlay;
