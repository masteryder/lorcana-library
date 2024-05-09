import { promises as fs } from "fs";
import { z } from "zod";

const validSearchParams = z.object({
  rarities: z
    .array(
      z.enum([
        "common",
        "rare",
        "uncommon",
        "super_rare",
        "legendary",
        "enchanted",
        "promo",
      ]),
    )
    .optional()
    .default(["common", "rare", "uncommon", "super_rare", "legendary"]),
  colors: z
    .array(
      z.enum(["amber", "amethyst", "emerald", "ruby", "sapphire", "steel"]),
    )
    .optional(),
  cardTypes: z
    .array(z.enum(["action", "character", "item", "location", "song"]))
    .optional(),
  minCost: z.number().int().min(0).default(0),
  maxCost: z.number().int().optional(),
  inkable: z.boolean().optional(),
  minStrength: z.number().int().min(0).default(0),
  maxStrength: z.number().int().optional(),
  minWillpower: z.number().int().min(0).default(0),
  maxWillpower: z.number().int().optional(),
  archetypes: z
    .array(
      z.enum([
        "Alien",
        "Ally",
        "Broom",
        "Captain",
        "Deity",
        "Detective",
        "Dragon",
        "Dreamborn",
        "Fairy",
        "Floodborn",
        "Hero",
        "Inventor",
        "King",
        "Mentor",
        "Pirate",
        "Prince",
        "Princess",
        "Queen",
        "Sorcerer",
        "Storyborn",
        "Tigger",
        "Villain",
      ]),
    )
    .optional(),
});

const Cards = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: z.infer<typeof validSearchParams>;
}) => {
  const parsedSearchParams = validSearchParams.parse(searchParams);
  const cards = JSON.parse(
    await fs.readFile(process.cwd() + "/public/convertedCards.json", "utf8"),
  );
  const {
    archetypes,
    cardTypes,
    colors,
    inkable,
    maxCost,
    maxStrength,
    maxWillpower,
    minCost,
    minStrength,
    minWillpower,
    rarities,
  } = parsedSearchParams;
  let filteredCards = cards ?? [];
  if (archetypes != null) {
    filteredCards = filteredCards.filter(
      (card) =>
        card.type != "character" ||
        card.archetypes.some((archetype) => archetypes.includes(archetype)),
    );
  }
  if (cardTypes != null) {
    filteredCards = filteredCards.filter((card) =>
      cardTypes?.includes(card.type),
    );
  }
  if (colors != null) {
    filteredCards = filteredCards.filter((card) =>
      colors?.includes(card.color),
    );
  }
  if (inkable != null) {
    filteredCards = filteredCards.filter((card) => card.inkable === inkable);
  }

  return (
    <>
      <img width={30} src="/icons/ink.svg" />
      <img width={30} src="/icons/inkable.svg" />
      <img width={30} src="/icons/lore.svg" />
      <img width={30} src="/icons/strength.svg" />
      <img width={30} src="/icons/tap.svg" />
      <img width={30} src="/icons/willpower.svg" />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCards != null &&
          filteredCards.map((card) => (
            <div className="flex flex-col gap-1">
              <img src={card.image} />
              <div className="font-bold">{card.name}</div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Cards;
