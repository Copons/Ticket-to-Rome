import React from 'react';
import Deck from './Deck';
import Hand from '../Hand';


export const Table = () =>
  <div className="table">
    <Deck />
    <Hand />
  </div>;
