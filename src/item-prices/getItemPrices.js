import { WIKI_API } from "./common";

const getItemPriceHistory = async (itemId, freq = "6h") => {
  const url = new URL(WIKI_API + "/timeseries");

  const params = {
    id: itemId,
    timestep: freq,
  };

  for (const [k, v] of Object.entries(params)) {
    url.searchParams.append(k, v);
  }

  const response = await fetch(url);
  return response.json();
};

export default getItemPriceHistory;
