const URL_BASE = "https://api.henrikdev.xyz/valorant";

async function queryAccountInfo(apiKey: string, name: string, tag: string): Promise<any> {
  const urlExt = `/v1/account/${name}/${tag}?`;
  const params = new URLSearchParams({
    api_key: apiKey,
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
  apiKey: string,
  puuid: string,
  region: string,
  startIndex: string,
  endIndex: string
): Promise<any> {
  const urlExt = "/v1/raw";
  const headers = {
    Authorization: apiKey,
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

async function queryMatchInfo(apiKey: string, matchId: string): Promise<any> {
  const urlExt = `/v2/match/${matchId}?`;
  const params = new URLSearchParams({
    api_key: apiKey,
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

export { queryAccountInfo, queryMatchInfo, queryMatchHistory };
