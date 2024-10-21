interface LoadMoreButtonProps {
  loading: boolean;
  hide: boolean; // used when page is first loaded and no user is currently searched
  onClick: () => void;
}

function LoadMoreButton(props: LoadMoreButtonProps) {
  if (props.hide) return;

  if (props.loading) {
    return <div className="text-lg">Loading...</div>;
  } else {
    return (
      <button className="text-lg" onClick={props.onClick}>
        Load more
      </button>
    );
  }
}

export default LoadMoreButton;
