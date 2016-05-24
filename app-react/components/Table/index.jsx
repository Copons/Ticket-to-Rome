import React from 'react';
import Deck from './Deck';
import Hand from '../Hand';
import Pile from './Pile';


export const Table = () =>
  <div className="table">
    <Deck />
    <Pile />
    <Hand />
  </div>;
