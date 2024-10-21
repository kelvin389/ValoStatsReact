import * as MatchTypes from "../types/MatchTypes";
import "../styles/Match.css";
import { getAgentIconSrc, getRankIconSrc } from "../utils/StringToImage";

interface MatchProps {
  data: MatchTypes.Match;
  puuid: string;
  showOverlayCallback: (overlayMatchData: MatchTypes.Match) => void;
}

function Match(props: MatchProps) {
  const match = props.data;
  //const matchid = match.metadata.matchid;

  let myTeamData: MatchTypes.TeamData | null = null;
  let myPlayer: MatchTypes.Player | null = null;

  for (let i = 0; i < match.players.all_players.length; i++) {
    const player = match.players.all_players[i];
    if (player.puuid == props.puuid) {
      myPlayer = player;
      if (player.team == MatchTypes.TeamName.Blue) {
        myTeamData = match.teams.blue;
      } else {
        myTeamData = match.teams.red;
      }

      break;
    }
  }

  if (myTeamData == null) {
    console.log("error finding searched players team");
    throw new Error();
  }
  if (myPlayer == null) {
    console.log("error finding searched players stats");
    throw new Error();
  }

  // calculate how long ago this game took place
  const matchStartTime = match.metadata.game_start * 1000; // convert from seconds to ms since epoch
  const curTime = Date.now();

  const diffMs = curTime - matchStartTime;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  let timeAgoStr = "";
  if (diffDays > 0) {
    timeAgoStr = diffDays == 1 ? "1 day ago" : diffDays + " days ago";
  } else if (diffHrs > 0) {
    timeAgoStr = diffHrs == 1 ? "1 hour ago" : diffHrs + " hrs ago";
  } else if (diffMins > 0) {
    timeAgoStr = diffMins + " min ago";
  } else {
    timeAgoStr = diffSecs + " sec ago";
  }

  return (
    <div
      className={
        "md:flex py-3 px-5 my-1 border border-white h-36 md:h-24 " +
        (myTeamData.has_won ? "bg-emerald-500" : "bg-rose-700")
      }
      onClick={() => props.showOverlayCallback(match)}
    >
      <div className="flex mb-4 md:mb-0 md:w-[45%] justify-between">
        <div className="inline-block mx-auto md:mx-0 md:mr-4">
          <img
            src={getAgentIconSrc(myPlayer.character)}
            className="aspect-square min-w-16 max-w-16 inline-block"
          />
          <img
            src={getRankIconSrc(myPlayer.currenttier)}
            className="aspect-square w-12 inline-block"
          />
        </div>
        <div className="inline-flex items-center mx-auto md:mx-0 flex-grow text-center">
          <div className="text-xl xs:text-2xl w-1/2">
            {myTeamData.rounds_won + ":" + myTeamData.rounds_lost}
          </div>
          <div className="text-xl xs:text-2xl w-1/2">
            {myPlayer.stats.kills + "/" + myPlayer.stats.deaths + "/" + myPlayer.stats.assists}
          </div>
        </div>
      </div>
      <div className="flex justify-around md:ml-auto md:items-center">
        <div className="match-right inline-block w-28 text-center text-xs md:text-base">
          {timeAgoStr}
        </div>
        <div className="match-right inline-block w-28 text-center text-xs md:text-base">
          {match.metadata.map}
        </div>
        <div className="match-right inline-block w-28 text-center text-xs md:text-base">
          {match.metadata.mode}
        </div>
      </div>
    </div>
  );
}

export default Match;
