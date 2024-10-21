import * as MatchTypes from "../types/MatchTypes";
import OverlayContainer from "./OverlayContainer";

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
        className="bg-overlay fixed flex left-0 top-0 w-full h-full z-50 overflow-auto"
        onClick={(event) => {
          // clicking on the overlay background hides overlay
          // checks target to make sure were not clicking on children
          if (event.target == event.currentTarget) props.hideOverlayCallback();
        }}
      >
        <OverlayContainer
          matchData={props.overlayMatchData}
          puuid={props.puuid}
          hideOverlayCallback={props.hideOverlayCallback}
        />
      </div>
    );
  }
  return;
}

export default Overlay;
