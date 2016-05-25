import React from 'react';
import Deck from './Deck';
import DestinationDeck from './DestinationDeck';
import Hand from '../Hand';
import Pile from './Pile';


export const Table = () =>
  <div className="table">
    <Deck />
    <DestinationDeck />
    <Pile />
    <Hand />
  </div>;
