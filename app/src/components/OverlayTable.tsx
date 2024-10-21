// this file handles the table that shows up in the overlay when clicking into a match.
// to add more columns, add a new entry to "tableCols", and the corresponding way
// to retrieve the data for each cell in "tableData"

import { useMemo } from "react";
import * as MatchTypes from "../types/MatchTypes";
import { getAgentIconSrc, getRankIconSrc } from "../utils/StringToImage";
import { getEcoFrags, getRoundLostFrags, getRoundWonFrags } from "../utils/OverlayStatCalculations";
import {
  ECO_MY_MIN_LOADOUT_VAL,
  ECO_OP_MAX_LOADOUT_VAL,
} from "../constants/StatCalculationConstants";

// external
import { Tooltip } from "react-tooltip";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
  RowData,
  getSortedRowModel,
} from "@tanstack/react-table";

import "../styles/OverlayTable.css";

interface OverlayTableProps {
  matchData: MatchTypes.Match;
  teamPlayers: MatchTypes.Player[];
  puuid: string;
}

interface TableData {
  highlight: boolean;
  agent: string;
  rank: number;
  playerName: string;
  acs: number;
  kills: number;
  deaths: number;
  assists: number;
  adr: number;
  roundWonFrags: number;
  roundLostFrags: number;
  eco: number;
}

// extend ColumnDef to have custom properties.
// only exists to satisfy typescript
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    customClass?: string;
    tooltipText?: string;
  }
}

function OverlayTable(props: OverlayTableProps) {
  const data = props.matchData;
  const teamPlayers = props.teamPlayers;

  const numRounds = data.rounds.length;

  // tooltipText is the hint that pops up when you hover over a table header
  const tableCols = useMemo<ColumnDef<TableData>[]>(
    () => [
      {
        header: "",
        accessorKey: "agent",
        cell: (props: any) => (
          <img
            src={getAgentIconSrc(props.row.original.agent)}
            className="aspect-square w-12 rounded-xl"
            alt="Agent Icon"
          />
        ),
        enableSorting: false,
      },
      {
        header: "",
        accessorKey: "rank",
        cell: (props: any) => (
          <img
            src={getRankIconSrc(props.row.original.rank)}
            className="aspect-square w-10"
            alt="Rank Icon"
          />
        ),
        enableSorting: false,
      },
      {
        header: "",
        accessorKey: "playerName",
        size: 200,
        enableSorting: false,
        meta: { customClass: "name-width" },
      },
      {
        header: "ACS",
        accessorKey: "acs",
        meta: { tooltipText: "Average Combat Score" },
      },
      {
        header: "K",
        accessorKey: "kills",
        meta: { tooltipText: "Kills" },
      },
      {
        header: "D",
        accessorKey: "deaths",
        meta: { tooltipText: "Deaths" },
      },
      {
        header: "A",
        accessorKey: "assists",
        meta: { tooltipText: "Assists" },
      },
      {
        header: "ADR",
        accessorKey: "adr",
        meta: { tooltipText: "Average Damage Per Round" },
      },
      {
        header: "RWF",
        accessorKey: "roundWonFrags",
        meta: { tooltipText: "Round Won Frags" },
      },
      {
        header: "RLF",
        accessorKey: "roundLostFrags",
        meta: { tooltipText: "Round Lost Frags" },
      },
      {
        header: "Eco",
        accessorKey: "eco",
        meta: {
          tooltipText: `Eco Frags (Kills while team loadout value is greater than ${ECO_MY_MIN_LOADOUT_VAL} and opposing teams loadout value is less than ${ECO_OP_MAX_LOADOUT_VAL})`,
        },
      },
    ],
    []
  );

  const tableData = useMemo(() => {
    return teamPlayers
      .slice() // Create a shallow copy of the array to avoid mutating the original
      .sort((a, b) => {
        // sort by ACS
        const acsA = Math.round(a.stats.score / numRounds);
        const acsB = Math.round(b.stats.score / numRounds);
        return acsB - acsA; // Change to acsA - acsB for ascending order
      })
      .map((player) => ({
        highlight: player.puuid == props.puuid,
        agent: player.character,
        rank: player.currenttier,
        playerName: `${player.name}#${player.tag}`,
        acs: Math.round(player.stats.score / numRounds),
        kills: player.stats.kills,
        deaths: player.stats.deaths,
        assists: player.stats.assists,
        adr: Math.round(player.damage_made / numRounds),
        roundWonFrags: getRoundWonFrags(player, data),
        roundLostFrags: getRoundLostFrags(player, data),
        eco: getEcoFrags(player, data),
      }));
  }, [teamPlayers, numRounds, data]);

  const table = useReactTable({
    columns: tableCols,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // client side sorting
  });

  return (
    <>
      <Tooltip id="stat-hint" />
      <table className="w-full text-center">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className={
                      "text-sm md:text-base" +
                      " " +
                      (header.column.columnDef.meta?.customClass
                        ? `${header.column.columnDef.meta?.customClass}`
                        : "std-width") +
                      " " +
                      (header.column.getCanSort() ? "cursor-pointer select-none" : "") // mouse turns to finger when hovering
                    }
                    data-tooltip-id="stat-hint"
                    data-tooltip-content={header.column.columnDef.meta?.tooltipText}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="absolute ml-1">
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={`${
                // highlight the searched player, otherwise alternate row colors
                row.original.highlight
                  ? "table-row-highlight"
                  : index % 2 === 0
                  ? "table-row-even"
                  : "table-row-odd"
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="text-sm md:text-base">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default OverlayTable;
