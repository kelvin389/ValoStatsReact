import "../styles/Overlay.css";

interface OverlayProps {
  showOverlay: boolean;
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
        <div className="bg-black">
          asdfasdfaweifjaweicj
          <div className="bg-red-50">asdfasdfsadf</div>
        </div>
      </div>
    );
  }
  return;
}

export default Overlay;
