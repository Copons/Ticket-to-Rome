import React from 'react';
import Rooms from './Rooms';

export const RoomsTable = () =>
  <table className="rooms">
    <thead>
      <tr>
        <th>Room</th>
        <th>Owner</th>
        <th>Players</th>
        <th>Actions</th>
      </tr>
    </thead>
    <Rooms />
  </table>;
