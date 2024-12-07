import { useEffect, useRef, useState } from "react";
import * as MatchTypes from "../types/MatchTypes";
import HeatMap from "heatmap-ts";
import { getMinimapData } from "../utils/MinimapData";
import { getAgentIconSrc } from "../utils/StringToImage";
import * as HeatmapConstants from "../constants/HeatmapConstants";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // css that must be imported to correctly draw slider
import {
  splitPlayersByTeam,
  formatTime,
  getHeatmapPoints,
  generateAndSetHeatmap,
  updateHeatmap,
} from "../utils/HeatmapUtils";
import * as HeatmapTypes from "../types/HeatmapTypes";

interface OverlayHeatmapTabProps {
  matchData: MatchTypes.Match;
  puuid: string;
}

function OverlayHeatmapTab(props: OverlayHeatmapTabProps) {
  const matchData = props.matchData;
  const minimapData = getMinimapData(matchData.metadata.map.name);

  const heatmapDivRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HeatMap | null>(null);

  // initialize the heatmap to show the searched player
  const [curPuuid, setCurPuuid] = useState<string>(props.puuid);

  // initial filter states
  const [filters, setFilters] = useState<HeatmapTypes.Filters>({
    KillDeath: HeatmapTypes.FilterKillDeath.Both,
    AttackDefend: HeatmapTypes.FilterAttackDefend.Both,
    PrePostPlant: HeatmapTypes.FilterPrePostPlant.Both,
    TimeRange: [HeatmapConstants.TIME_MIN, HeatmapConstants.TIME_MAX],
  });

  function updateFilterKillDeath(newVal: HeatmapTypes.FilterKillDeath) {
    setFilters((old) => ({
      ...old,
      KillDeath: newVal,
    }));
  }
  function updateFilterAttackDefend(newVal: HeatmapTypes.FilterAttackDefend) {
    setFilters((old) => ({
      ...old,
      AttackDefend: newVal,
    }));
  }
  function updateFilterPrePostPlant(newVal: HeatmapTypes.FilterPrePostPlant) {
    setFilters((old) => ({
      ...old,
      PrePostPlant: newVal,
    }));
  }
  function updateTimeRange(newVal: [number, number]) {
    setFilters((old) => ({
      ...old,
      TimeRange: newVal,
    }));
  }

  // initialize heatmap
  useEffect(() => {
    // this if statement prevents initialization of
    // 2 heatmaps when strict mode is enabled
    if (heatmapRef.current == null) {
      heatmapRef.current = new HeatMap({
        container: heatmapDivRef.current!,
        radius: HeatmapConstants.RADIUS,
        maxOpacity: HeatmapConstants.MAX_OPACITY,
      });
    }
    const init_pts = getHeatmapPoints(matchData, minimapData, curPuuid, filters);
    updateHeatmap(init_pts, heatmapRef);
  }, []);

  // update heatmap whenever filters or puuid is changed
  useEffect(() => {
    generateAndSetHeatmap(matchData, minimapData, curPuuid, heatmapRef, filters);
  }, [filters, curPuuid]);

  const [redPlayers, bluePlayers] = splitPlayersByTeam(matchData.players);

  const highlightStyle = " bg-gray-500";
  const leftButtonStyle = " rounded-l-lg";
  const rightButtonStyle = " rounded-r-lg";
  const allButtonStyle = " px-2";

  return (
    <>
      <div className="grid grid-cols-2 mt-4">
        <div className="flex flex-col">
          <div className="border flex flex-col pt-2 pb-4">
            <div className="text-center text-2xl">Filters</div>
            <div className="grid grid-cols-2 grid-rows-2 mt-1">
              <div className="flex items-center justify-center">
                {/* yeah these should probably be components but whatever */}
                <button
                  className={
                    (filters.KillDeath == HeatmapTypes.FilterKillDeath.Kill ? highlightStyle : "") +
                    allButtonStyle +
                    leftButtonStyle
                  }
                  onClick={() => updateFilterKillDeath(HeatmapTypes.FilterKillDeath.Kill)}
                >
                  Kills
                </button>
                <button
                  className={
                    (filters.KillDeath == HeatmapTypes.FilterKillDeath.Death
                      ? highlightStyle
                      : "") + allButtonStyle
                  }
                  onClick={() => updateFilterKillDeath(HeatmapTypes.FilterKillDeath.Death)}
                >
                  Deaths
                </button>
                <button
                  className={
                    (filters.KillDeath == HeatmapTypes.FilterKillDeath.Both ? highlightStyle : "") +
                    allButtonStyle +
                    rightButtonStyle
                  }
                  onClick={() => updateFilterKillDeath(HeatmapTypes.FilterKillDeath.Both)}
                >
                  Both
                </button>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className={
                    (filters.AttackDefend == HeatmapTypes.FilterAttackDefend.Attack
                      ? highlightStyle
                      : "") +
                    allButtonStyle +
                    leftButtonStyle
                  }
                  onClick={() => updateFilterAttackDefend(HeatmapTypes.FilterAttackDefend.Attack)}
                >
                  Attack
                </button>
                <button
                  className={
                    (filters.AttackDefend == HeatmapTypes.FilterAttackDefend.Defense
                      ? highlightStyle
                      : "") + allButtonStyle
                  }
                  onClick={() => updateFilterAttackDefend(HeatmapTypes.FilterAttackDefend.Defense)}
                >
                  Defense
                </button>
                <button
                  className={
                    (filters.AttackDefend == HeatmapTypes.FilterAttackDefend.Both
                      ? highlightStyle
                      : "") +
                    allButtonStyle +
                    rightButtonStyle
                  }
                  onClick={() => updateFilterAttackDefend(HeatmapTypes.FilterAttackDefend.Both)}
                >
                  Both
                </button>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className={
                    (filters.PrePostPlant == HeatmapTypes.FilterPrePostPlant.Preplant
                      ? highlightStyle
                      : "") +
                    allButtonStyle +
                    leftButtonStyle
                  }
                  onClick={() => updateFilterPrePostPlant(HeatmapTypes.FilterPrePostPlant.Preplant)}
                >
                  Pre-Plant
                </button>
                <button
                  className={
                    (filters.PrePostPlant == HeatmapTypes.FilterPrePostPlant.Postplant
                      ? highlightStyle
                      : "") + allButtonStyle
                  }
                  onClick={() =>
                    updateFilterPrePostPlant(HeatmapTypes.FilterPrePostPlant.Postplant)
                  }
                >
                  Post-Plant
                </button>
                <button
                  className={
                    (filters.PrePostPlant == HeatmapTypes.FilterPrePostPlant.Both
                      ? highlightStyle
                      : "") +
                    allButtonStyle +
                    rightButtonStyle
                  }
                  onClick={() => updateFilterPrePostPlant(HeatmapTypes.FilterPrePostPlant.Both)}
                >
                  Both
                </button>
              </div>
              <div className="flex items-center justify-center text-center">
                <div className="w-48">
                  Round Time
                  <Slider
                    range
                    min={HeatmapConstants.TIME_MIN}
                    max={HeatmapConstants.TIME_MAX}
                    step={5}
                    pushable
                    value={filters.TimeRange}
                    onChange={(newTimeRange) => updateTimeRange(newTimeRange as [number, number])}
                  />
                  {formatTime(filters.TimeRange[0]) + " - " + formatTime(filters.TimeRange[1])}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 my-auto">
            <div className="mx-auto">
              {redPlayers.map((player) => (
                <div
                  className={
                    (curPuuid == player.puuid ? "bg-gray-600" : "") +
                    " w-64 mb-1 border cursor-pointer"
                  }
                  onClick={() => {
                    setCurPuuid(player.puuid);
                  }}
                  key={player.puuid}
                >
                  <img
                    className="w-12 aspect-square inline"
                    src={getAgentIconSrc(player.agent.name)}
                  />
                  <span className="ml-2">{player.name}</span>
                </div>
              ))}
            </div>
            <div className="mx-auto">
              {bluePlayers.map((player) => (
                <div
                  className={
                    (curPuuid == player.puuid ? "bg-gray-600" : "") +
                    " w-64 mb-1 border cursor-pointer"
                  }
                  onClick={() => {
                    setCurPuuid(player.puuid);
                  }}
                  key={player.puuid}
                >
                  <img
                    className="w-12 aspect-square inline"
                    src={getAgentIconSrc(player.agent.name)}
                  />
                  <span className="ml-2">{player.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="m-auto border">
            <div
              className="w-[512px] h-[512px] bg-cover"
              style={{
                backgroundImage: `url(${minimapData.icon})`,
              }}
              ref={heatmapDivRef}
            ></div>
          </div>
          <div className="text-center text-3xl mt-2">{matchData.metadata.map.name}</div>
        </div>
      </div>
    </>
  );
}

export default OverlayHeatmapTab;
