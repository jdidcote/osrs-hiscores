import { WIKI_API } from "./common";

const getItemMapping = async () => {
  const url = new URL(WIKI_API + "/mapping");
  const data = await fetch(url).then((res) => res.json());
  let itemMapping = {};
  for (const item of data) {
    itemMapping[item["id"]] = item["name"];
  }
  return itemMapping;
};

export default getItemMapping;
