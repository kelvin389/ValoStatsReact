import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { queryAccountInfo, queryMatchHistory, queryMatchInfo } from "./utils/Query";

// load variables from .env in root directory
// up once to exit /src, then up once more to root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const API_KEY = process.env.API_KEY || "";
if (API_KEY == "") throw new Error("Bad API key");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "https://localhost:5173",
  methods: ["GET"],
  //allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));

// api routes
app.get("/api/account_info/:username/:tag", async (req: Request, res: Response) => {
  const { username, tag } = req.params;
  const apiData = await queryAccountInfo(API_KEY, username, tag);

  res.json(apiData);
});

app.get(
  "/api/match_history/:puuid/:region/:startIndex/:endIndex",
  async (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");

    const { puuid, region, startIndex, endIndex } = req.params;
    const matchHistoryData = await queryMatchHistory(API_KEY, puuid, region, startIndex, endIndex);

    const matches = matchHistoryData.History;
    for (let i = 0; i < matches.length; i++) {
      const matchId = matches[i].MatchID;
      const matchData = await queryMatchInfo(API_KEY, region, matchId);
      res.write(`data: ${JSON.stringify(matchData.data)}\n\n`);
    }
    res.end();
  }
);

// start server
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
