import { promises as fs } from "fs";

export const getCards = async () => {
  const file = await fs.readFile(process.cwd() + "/cards.json", "utf8");
  return JSON.parse(file);
};
export const Cards = async ({}) => {
  const cardList = await getCards();
  return <div>{cardList.map((card) => card.name)}</div>;
};
