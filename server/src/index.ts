import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { exit } from "process";
import { error } from "console";
import { stringify } from "querystring";

// load variables from .env in root directory
// up once to exit /src, then up once more to root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const URL_BASE = "https://api.henrikdev.xyz/valorant";
const API_KEY = process.env.API_KEY || "";
if (API_KEY == "") throw new Error("Bad API key");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "https://localhost:5173",
  methods: ["GET", "POST"],
  //allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));

// api routes
app.get("/api/account_info/:username/:tag", async (req: Request, res: Response) => {
  const { username, tag } = req.params;
  const apiData = await queryAccountInfo(username, tag);

  res.json(apiData);
});
app.get(
  "/api/match_history/:puuid/:region/:startIndex/:endIndex",
  async (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");

    const { puuid, region, startIndex, endIndex } = req.params;
    const matchHistoryData = await queryMatchHistory(puuid, region, startIndex, endIndex);

    const matches = matchHistoryData.History;
    for (let i = 0; i < matches.length; i++) {
      const matchId = matches[i].MatchID;
      const matchData = await queryMatchInfo(matchId);
      res.write(`data: ${JSON.stringify(matchData.data)}\n\n`);
    }
    res.end();
  }
);

async function queryAccountInfo(name: string, tag: string): Promise<any> {
  const urlExt = `/v1/account/${name}/${tag}?`;
  const params = new URLSearchParams({
    api_key: API_KEY,
  });

  try {
    const apiResp = await fetch(URL_BASE + urlExt + params);
    const apiData = await apiResp.json();

    return apiData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function queryMatchHistory(
  puuid: string,
  region: string,
  startIndex: string,
  endIndex: string
): Promise<any> {
  const urlExt = "/v1/raw";
  const headers = {
    Authorization: API_KEY,
    "Content-Type": "application/json",
  };
  const data = {
    type: "matchhistory",
    value: puuid,
    region: region,
    queries: `?startIndex=${startIndex}&endIndex=${endIndex}`,
    //queries: `?startIndex={start_index}&endIndex={end_index}&queue={queue}`
  };

  try {
    const apiResp = await fetch(URL_BASE + urlExt, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    const apiData = await apiResp.json();

    return apiData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function queryMatchInfo(matchId: string): Promise<any> {
  const urlExt = `/v2/match/${matchId}?`;
  const params = new URLSearchParams({
    api_key: API_KEY,
  });

  try {
    const apiResp = await fetch(URL_BASE + urlExt + params);
    const apiData = await apiResp.json();

    return apiData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
