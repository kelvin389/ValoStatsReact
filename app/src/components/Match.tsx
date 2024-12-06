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

  for (let i = 0; i < match.players.length; i++) {
    const player = match.players[i];
    if (player.puuid == props.puuid) {
      myPlayer = player;
      if (player.team_id == MatchTypes.TeamID.Blue) {
        for (let j = 0; j < match.teams.length; j++) {
          if (match.teams[j].team_id == MatchTypes.TeamID.Blue) {
            myTeamData = match.teams[j];
            break;
          }
        }
      } else {
        for (let j = 0; j < match.teams.length; j++) {
          if (match.teams[j].team_id == MatchTypes.TeamID.Red) {
            myTeamData = match.teams[j];
            break;
          }
        }
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
  const matchStartTime = new Date(match.metadata.started_at).getTime(); // convert to ms since epoch from ISO 8601 format
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
        "md:flex py-3 px-2 xs:px-5 my-1 border-2 md:border border-gray-100/50 rounded-sm h-36 md:h-24 cursor-pointer select-none " +
        " " +
        (myTeamData.won ? "bg-emerald-600" : "bg-rose-800")
      }
      onClick={() => props.showOverlayCallback(match)}
    >
      <div className="flex mb-4 md:mb-0 md:w-[45%] justify-between">
        <div className="mx-auto md:mx-0 md:mr-4 flex items-center">
          <img
            src={getAgentIconSrc(myPlayer.agent.name)}
            alt={myPlayer.agent.name + " agent icon"}
            className="rounded-full aspect-square min-w-16 max-w-16 inline-block"
          />
          <img
            src={getRankIconSrc(myPlayer.tier.id)}
            alt={myPlayer.tier.name + " rank icon"}
            className="aspect-square w-12 inline-block ml-2"
          />
        </div>
        <div className="inline-flex items-center mx-auto md:mx-0 flex-grow text-center">
          <div className="text-2xl md:text-xl mdplus:text-2xl w-1/2">
            {myTeamData.rounds.won + ":" + myTeamData.rounds.lost}
          </div>
          <div className="text-2xl md:text-xl mdplus:text-2xl w-1/2">
            {myPlayer.stats.kills + "/" + myPlayer.stats.deaths + "/" + myPlayer.stats.assists}
          </div>
        </div>
      </div>
      <div className="flex justify-around md:ml-auto md:items-center">
        <div className="match-right inline-block w-28 text-center text-xs md:text-base">
          {timeAgoStr}
        </div>
        <div className="match-right inline-block w-28 text-center text-xs md:text-base">
          {match.metadata.map.name}
        </div>
        <div className="match-right inline-block w-28 text-center text-xs md:text-base">
          {match.metadata.queue.name}
        </div>
      </div>
    </div>
  );
}

export default Match;
