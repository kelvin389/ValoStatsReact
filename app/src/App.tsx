import { useState, useEffect, useRef } from "react";

function App() {
  // gets matches from index 0->BATCH_SIZE, then BATCH_SIZE->BATCH_SIZE*2, ...
  const BATCH_SIZE = 3;

  const [endIndex, setEndIndex] = useState<number>(BATCH_SIZE);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [puuid, setPuuid] = useState<string>("");
  const [matches, setMatches] = useState<object[]>([]);

  const usernameInputRef = useRef<HTMLInputElement | null>(null);
  const serverInputRef = useRef<HTMLSelectElement | null>(null);

  /*
    useEffect(() => {
        fetch("/api/helloworld")
            .then((res) => res.json())
            .then((data) => {
                setData(data.message);
            });
    }, []);
    */

  // trigger getMatchHistory when puuid changes.
  // puuid should only change when we are searching
  // for a new user and in this case we want to
  // immediately get initial match history
  useEffect(() => {
    if (puuid != "") {
      getMatchHistory();
    }
  }, [puuid]);

  function incrementIndices() {
    setStartIndex(endIndex);
    setEndIndex((prevEndIndex) => {
      return prevEndIndex + BATCH_SIZE;
    });
  }

  async function getMatchHistory() {
    if (!serverInputRef.current) {
      console.log("tried to get server before ref was mounted");
      throw new Error();
    }

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
      const dataJson = JSON.parse(event.data);
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
        console.log("closed es");
      } else {
        console.error("es error", error);
      }
    };
  }

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

  return (
    <>
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
        <button type="submit" onClick={getPuuid}>
          Search
        </button>
        <br />
      </div>

      <button onClick={debug}>debug</button>

      <h1>puuid: {puuid}</h1>

      <ul>
        {matches.map((match: any) => (
          <li key={match.metadata.matchid}>{match.metadata.matchid}</li>
        ))}
      </ul>
      <button onClick={getMatchHistory}>load more</button>
    </>
  );
}

export default App;
