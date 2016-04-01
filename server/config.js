'use strict';


const RULES = {
  player: {
    max: 5,
    startingHand: 3,
    startingPieces: 45,
  },
  turn: {
    actions: 2,
  },
  action: {
    drawFromDeck: 1,
    drawFromPile: 1,
    drawWildFromPile: 2,
    claimRoute: 2,
    newDestination: 2,
  },
};


const DECK = [
  { type: 'red', amount: 12 },
  { type: 'orange', amount: 12 },
  { type: 'yellow', amount: 12 },
  { type: 'green', amount: 12 },
  { type: 'blue', amount: 12 },
  { type: 'purple', amount: 12 },
  { type: 'black', amount: 12 },
  { type: 'white', amount: 12 },
  { type: 'wild', amount: 14 },
];


module.exports = {
  RULES,
  DECK,
};
