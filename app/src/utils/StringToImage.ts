import { AgentIcons } from "../assets/images/agent-icons";
import { RankIcons } from "../assets/images/rank-icons";

function getAgentIconSrc(agentName: string) {
  // remove "/" for keying KAYO properly
  return AgentIcons[agentName.replace("/", "") as keyof typeof AgentIcons];
}

function getRankIconSrc(rankNum: number) {
  return RankIcons[rankNum as keyof typeof RankIcons];
}

export { getAgentIconSrc, getRankIconSrc };
