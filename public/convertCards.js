const fs = require("node:fs");

const Colors = Object.freeze({
  RUBY: "ruby",
  AMETHYST: "amethyst",
  SAPPHIRE: "sapphire",
  AMBER: "amber",
  STEEL: "steel",
  EMERALD: "emerald",
});

fs.readFile("./cards.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let cards = JSON.parse(data).cards;

  const convertColor = (card) => {
    switch (card.color) {
      case 1: {
        return Colors.RUBY;
      }
      case 2: {
        return Colors.SAPPHIRE;
      }
      case 3: {
        return Colors.EMERALD;
      }
      case 4: {
        return Colors.AMBER;
      }
      case 5: {
        return Colors.AMETHYST;
      }
      case 6: {
        return Colors.STEEL;
      }
    }
    return "pipi";
  };

  const convertType = (card) => {
    switch (card.type) {
      case "action":
      case "location":
      case "item":
        return card.type;
      case "glimmer":
        return "character";
      case "song":
        return "action";
    }
  };

  const convertSetId = (card) => {
    switch (card.card_set_id) {
      case 1:
      case 3:
        return 2;
      case 2:
        return 1;
      default:
        return card.card_set_id - 1;
    }
  };

  const generateCardId = (card) => {
    return `${convertSetId(card)}.${card.number}`;
  };

  const convertStrength = (card) => {
    if (card.type === "location") {
      return undefined;
    }
    return card.attack;
  };

  const getArchetypes = (card) => {
    if (card.type === "glimmer") {
      return card.traits;
    }
    return undefined;
  };

  const getSubtypes = (card) => {
    if (card.type === "song") {
      return ["song"];
    }
    return undefined;
  };

  const getMoveCost = (card) => {
    if (card.type === "location") {
      return card.attack;
    }
    return undefined;
  };

  cards = cards.map((card) => ({
    id: generateCardId(card),
    name: card.name,
    subtitle: card.title,
    text: card.action,
    type: convertType(card),
    cost: card.cost,
    inkable: card.inkwell === 1,
    moveCost: getMoveCost(card),
    strength: convertStrength(card),
    willPower: card.defence,
    lore: card.stars,
    color: convertColor(card),
    archetypes: getArchetypes(card),
    subtypes: getSubtypes(card),
    set: convertSetId(card),
    number: card.number,
    rarity: card.rarity,
    illustrator: card.illustrator,
    image: card.image,
  }));

  const cardsToSave = JSON.stringify(cards);

  // console.log({ cardsToSave });

  fs.writeFile("./convertedCards.json", cardsToSave, (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });
});
