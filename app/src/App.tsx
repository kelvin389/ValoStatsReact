import { useState, useEffect, useRef } from "react";
import LoadMoreButton from "./components/LoadMoreButton";
import Match from "./components/Match";
import * as MatchTypes from "./types/MatchTypes";
import Overlay from "./components/Overlay";

function App() {
  // gets matches from index 0->BATCH_SIZE, then BATCH_SIZE->BATCH_SIZE*2, ...
  const BATCH_SIZE = 3;

  const [usernameText, setUsernameText] = useState<string>("Valo Stats");

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

  function resetIndices() {
    setStartIndex(0);
    setEndIndex(BATCH_SIZE);
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
  async function getPuuid(pieces: string[]) {
    await fetch(`/api/account_info/${pieces[0]}/${pieces[1]}`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setPuuid(data.data.puuid);
      });
  }

  async function searchHandler() {
    if (!usernameInputRef.current) {
      console.log("tried to search player before ref was mounted");
      throw new Error();
    }
    if (loadingMatches) {
      console.log("tried to search while matches are still");
      throw new Error();
    }

    // display search term at top of page
    setUsernameText(usernameInputRef.current.value);
    // pull username and split into pieces
    const pieces = usernameInputRef.current.value.split("#");
    // clear textbox
    usernameInputRef.current.value = "";

    // clear variables for new player
    setMatches([]);
    resetIndices();

    // TODO: make sure input is valid
    await getPuuid(pieces);
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
      <div className="text-center mb-7">
        {/* <h1 className="text-5xl mb-4 mt-20">{username}</h1> */}
        <div className="flex justify-center items-end text-5xl mb-4 h-32">{usernameText}</div>
        <div>
          <input
            type="text"
            ref={usernameInputRef}
            placeholder="username#tag"
            className="dark-text mr-1 w-[60%] xs:w-[50%] md:w-96 h-searchbar"
          />
          <select title="region" ref={serverInputRef} className="dark-text mr-1 h-searchbar">
            <option value="na">NA</option>
            <option value="latam">LATAM</option>
            <option value="br">BR</option>
            <option value="eu">EU</option>
            <option value="kr">KR</option>
            <option value="ap">AP</option>
          </select>
          <button onClick={searchHandler}>Search</button>
        </div>
      </div>

      <div className="w-full xs:w-4/5 md:w-[91%] lg:w-[70%] xl:w-3/5 2xl:w-2/5 m-auto">
        {matches.map((match: MatchTypes.Match) => (
          <Match
            key={match.metadata.matchid}
            data={match}
            puuid={puuid}
            showOverlayCallback={displaySpecificMatch}
          />
        ))}
        <div className="text-center">
          <LoadMoreButton hide={puuid == ""} loading={loadingMatches} onClick={getMatchHistory} />
        </div>
      </div>

      {/*
      <div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1 className="text-5xl">debug stuff:</h1>

        <h1>puuid: {puuid}</h1>
        <h1>loading: {loadingMatches.toString()}</h1>
        <h1>stopautoload: {debugStopAutoLoad.toString()}</h1>

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
      </div>
      */}
    </>
  );
}

export default App;
