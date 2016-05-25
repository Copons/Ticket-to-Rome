// Socket.io
export const CONNECTION = 'connection';
export const DISCONNECT = 'disconnect';

// Response
export const SUCCESS = 'SUCCESS';
export const ERROR = 'ERROR';

// Players
export const CREATE_PLAYER = 'CREATE_PLAYER';
export const CHANGE_PLAYER_NAME = 'CHANGE_PLAYER_NAME';
export const SET_PLAYER_COLOR = 'SET_PLAYER_COLOR';
export const RESET_PLAYER_STATS = 'RESET_PLAYER';
export const DELETE_PLAYER = 'DELETE_PLAYER';

// Rooms
export const SET_ROOMS = 'SET_ROOMS';
export const CREATE_ROOM = 'CREATE_ROOM';
export const JOIN_ROOM = 'JOIN_ROOM';
export const LEAVE_ROOM = 'LEAVE_ROOM';
export const DELETE_ROOM = 'DELETE_ROOM';
export const UPDATE_PLAYER_IN_ROOMS = 'UPDATE_PLAYER_IN_ROOMS';
export const CHANGE_ROOM_STATUS = 'CHANGE_ROOM_STATUS';

// Games
export const SET_GAME = 'SET_GAME';
export const START_GAME = 'START_GAME';
export const KILL_GAME = 'KILL_GAME';

// Tables
export const SET_TABLE = 'SET_TABLE';
export const CREATE_TABLE = 'CREATE_TABLE';
export const DELETE_TABLE = 'DELETE_TABLE';

// Cards
export const CREATE_DECK = 'CREATE_DECK';
export const REMOVE_FROM_DECK = 'REMOVE_FROM_DECK';
export const MULTIPLE_REMOVE_FROM_DECK = 'MULTIPLE_REMOVE_FROM_DECK';
export const ADD_TO_PILE = 'ADD_TO_PILE';
export const REMOVE_FROM_PILE = 'REMOVE_FROM_PILE';
export const DISCARD_CARD = 'DISCARD_CARD';
export const CREATE_DESTINATION_DECK = 'CREATE_DESTINATION_DECK';
export const REMOVE_FROM_DESTINATION_DECK = 'REMOVE_FROM_DESTINATION_DECK';

// Hands
export const SET_HAND = 'SET_HAND';
export const CREATE_HAND = 'CREATE_HAND';
export const DELETE_HAND = 'DELETE_HAND';
export const RESET_HAND = 'RESET_HAND';
export const ALL_HANDS_IN_GAME = 'ALL_HANDS_IN_GAME';
export const DRAW_FROM_DECK = 'DRAW_FROM_DECK';
export const MULTIPLE_DRAW_FROM_DECK = 'MULTIPLE_DRAW_FROM_DECK';
export const DRAW_FROM_PILE = 'DRAW_FROM_PILE';
export const DRAW_DESTINATION = 'DRAW_DESTINATION';
