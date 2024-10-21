import { useState, useEffect, useRef } from "react";
import LoadMoreButton from "./components/LoadMoreButton";
import Match from "./components/Match";
import * as MatchTypes from "./types/MatchTypes";
import Overlay from "./components/Overlay";

function App() {
  // gets matches from index 0->BATCH_SIZE, then BATCH_SIZE->BATCH_SIZE*2, ...
  const BATCH_SIZE = 3;

  const [endIndex, setEndIndex] = useState<number>(BATCH_SIZE);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [puuid, setPuuid] = useState<string>("");
  const [matches, setMatches] = useState<MatchTypes.Match[]>([]);
  const [debugStopAutoLoad, setDebugStopAutoLoad] = useState<boolean>(false);

  const [loadingMatches, setLoadingMatches] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [overlayMatchData, setOverlayMatchData] = useState<MatchTypes.Match | null>(null);

  const usernameInputRef = useRef<HTMLInputElement | null>(null);
  const serverInputRef = useRef<HTMLSelectElement | null>(null);

  // trigger getMatchHistory when puuid changes.
  // puuid should only change when we are searching
  // for a new user and in this case we want to
  // immediately get initial match history
  useEffect(() => {
    if (puuid != "" && !debugStopAutoLoad) {
      getMatchHistory();
    }
  }, [puuid]);

  // set overflow:hidden when overlay is open.
  // prevents mobile users from scrolling background
  // while the overlay is still open
  useEffect(() => {
    if (showOverlay) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showOverlay]);

  function incrementIndices() {
    setStartIndex(endIndex);
    setEndIndex((prevEndIndex) => {
      return prevEndIndex + BATCH_SIZE;
    });
  }

  // request api for next set of matches
  async function getMatchHistory() {
    if (!serverInputRef.current) {
      console.log("tried to get server before ref was mounted");
      throw new Error();
    }
    if (loadingMatches) {
      console.log("tried to load matches while matches are already loading");
      throw new Error();
    }
    setLoadingMatches(true);

    // get match history and receive response as a stream of data.
    // this lets us display matches as they come in from the server instead
    // waiting for the entire batch of matches to come in
    const eventSource = new EventSource(
      `/api/match_history/${puuid}/${serverInputRef.current.value}/${startIndex}/${endIndex}`
    );
    incrementIndices();

    eventSource.onopen = () => {
      console.log("opened es");
    };
    eventSource.onmessage = (event) => {
      console.log("received data from es");
      const dataJson = JSON.parse(event.data) as MatchTypes.Match;
      console.log(dataJson);
      setMatches((prevMatches) => {
        return prevMatches.concat(dataJson);
      });
    };
    eventSource.onerror = (error) => {
      // when res.end() is called on the server an error is received on the client side
      // and the phase indicates that the source has been closed by the server
      if (error.eventPhase == EventSource.CLOSED) {
        eventSource.close();
        setLoadingMatches(false);
        console.log("closed es");
      } else {
        console.error("es error", error);
      }
    };
  }

  // request api with username#tag input and get puuid in return
  async function getPuuid() {
    if (!usernameInputRef.current) {
      console.log("tried to search player before ref was mounted");
      throw new Error();
    }

    const pieces = usernameInputRef.current.value.split("#");

    await fetch(`/api/account_info/${pieces[0]}/${pieces[1]}`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setPuuid(data.data.puuid);
      });
  }

  async function debug() {
    await fetch("/api/account_info/kal/389")
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setPuuid(data.data.puuid);
      });
  }

  function displaySpecificMatch(overlayMatchData: MatchTypes.Match) {
    setOverlayMatchData(overlayMatchData);
    setShowOverlay(true);
  }

  return (
    <>
      <Overlay
        showOverlay={showOverlay}
        overlayMatchData={overlayMatchData}
        puuid={puuid}
        hideOverlayCallback={() => setShowOverlay(false)}
      />
      <div>
        Search for user:
        <input type="text" ref={usernameInputRef} placeholder="username#tag" />
        <select ref={serverInputRef}>
          <option value="na">na</option>
          <option value="na">na</option>
          <option value="na">na</option>
          <option value="na">kr</option>
          <option value="na">na</option>
        </select>
        <button onClick={getPuuid}>Search</button>
        <br />
      </div>

      <button onClick={debug}>debug</button>

      <h1>puuid: {puuid}</h1>
      <h1>loading: {loadingMatches.toString()}</h1>
      <h1>stopautoload: {debugStopAutoLoad.toString()}</h1>

      <div className="w-full md:w-5/6 lg:w-4/6 xl:w-3/6 m-auto">
        {matches.map((match: MatchTypes.Match) => (
          <Match
            key={match.metadata.matchid}
            data={match}
            puuid={puuid}
            showOverlayCallback={displaySpecificMatch}
          />
        ))}
        <LoadMoreButton loading={loadingMatches} onClick={getMatchHistory} />
      </div>

      <br />
      <br />
      <button onClick={() => setDebugStopAutoLoad(true)}>DEBUG STOP AUTO LOAD</button>
      <button
        onClick={() => {
          if (showOverlay) {
            setShowOverlay(false);
          } else {
            setShowOverlay(true);
          }
        }}
      >
        toggle overlay
      </button>
    </>
  );
}

export default App;
