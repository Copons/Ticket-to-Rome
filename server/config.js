'use strict';


const RULES = {
  player: {
    max: 5,
    startingHand: 3,
    startingDestinations: 3,
    startingPieces: 45,
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


const DECK = [
  { type: 'red', amount: 3 },
  { type: 'orange', amount: 3 },
  { type: 'yellow', amount: 3 },
  { type: 'green', amount: 3 },
  { type: 'blue', amount: 3 },
  { type: 'purple', amount: 3 },
  { type: 'black', amount: 3 },
  { type: 'white', amount: 3 },
  { type: 'wild', amount: 14 },
];


const DESTINATIONS = [
  {
    start: 'battistini',
    end: 'colosseo',
    points: 10,
  },
  {
    start: 'clodio-mazzini',
    end: 'san-pietro',
    points: 3,
  },
  {
    start: 'spagna',
    end: 'venezia',
    points: 1,
  },
  {
    start: 'termini',
    end: 'venezia',
    points: 3,
  },
  {
    start: 'battistini',
    end: 'ottaviano',
    points: 5,
  },
  {
    start: 'spagna',
    end: 'san-pietro',
    points: 4,
  },
];


module.exports = {
  RULES,
  DECK,
  DESTINATIONS,
};
