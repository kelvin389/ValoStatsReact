interface LoadMoreButtonProps {
  loading: boolean;
  onClick: () => void;
}

function LoadMoreButton(props: LoadMoreButtonProps) {
  if (props.loading) {
    return "loading";
  } else {
    return <button onClick={props.onClick}>load more</button>;
  }
}

export default LoadMoreButton;
