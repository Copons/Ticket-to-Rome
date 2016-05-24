export const RULES = {
  player: {
    max: 5,
    startingHand: 3,
    startingDestinations: 3,
    startingPieces: 45,
    endGamePieces: 2,
    colorsOrder: [
      'red', 'blue', 'green', 'orange', 'purple',
    ],
    minDestinations: 2,
  },
  pile: {
    max: 5,
    maxWild: 3,
  },
  turn: {
    actions: 2,
  },
  points: {
    1: 1,
    2: 2,
    3: 4,
    4: 7,
    5: 10,
    6: 15,
    longest: 10,
  },
  action: {
    drawFromDeck: 1,
    drawFromPile: 1,
    drawWildFromPile: 2,
    claimRoute: 2,
    newDestination: 2,
  },
};
