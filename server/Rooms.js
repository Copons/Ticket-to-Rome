'use strict';
const uuid = require('node-uuid');


class Rooms {

  constructor(io, players) {
    this.io = io;
    this.players = players;
    this.list = [];
  }


  getList() {
    this.io.sockets.emit('Rooms/list', { list: this.list });
  }


  create(data, client) {
    const player = this.players.list.find(p => p.name === data.playerName);
    let room = this.list.find(r => r.name === data.roomName);
    if (!room) {
      room = {
        id: uuid.v4(),
        name: data.roomName,
        owner: player,
        players: [],
      };
      this.list.push(room);
    }
    this.join({
      roomId: room.id,
      playerName: player.name,
    }, client);
  }


  join(data, client) {
    const player = this.players.list.find(p => p.name === data.playerName);
    const room = this.list.find(r => r.id === data.roomId);

    if (!room) {
      client.emit('Rooms/join', {
        type: 'error',
        message: `Room ${data.roomId} does not exists.`,
      });
      console.log(`Room ${data.roomId} does not exists.`);
    } else if (room.players.length >= 5) {
      client.emit('Rooms/join', {
        type: 'error',
        message: `Room ${room.id} is full.`,
      });
      console.log(`Room ${room.id} is full.`);
    } else if (room.players.find(p => p.name === player.name)) {
      client.emit('Rooms/join', {
        type: 'error',
        message: `${player.name} is already in room ${room.name}.`,
      });
      console.log(`${player.name} is already in room ${room.name}.`);
    } else {
      this.leaveAll(data, client);
      room.players.push(player);
      client.join(room.id);
      this.io.sockets.in(room.id).emit('Rooms/join', {
        type: 'ok',
        message: `${player.name} joined room ${room.name}.`,
      });
      console.log(`${player.name} joined room ${room.name}.`);
      this.getList();
    }
  }

  leaveAll(data, client) {
    for (const room of this.list) {
      if (room.players.find(p => p.name === data.playerName)) {
        this.leave({
          roomId: room.id,
          playerName: data.playerName,
        }, client);
      }
    }
  }

  leave(data, client) {
    const player = this.players.list.find(p => p.name === data.playerName);
    const room = this.list.find(r => r.id === data.roomId);
    if (room.owner.name === player.name) {
      this.list = this.list.filter(r => r.id !== room.id);
    } else {
      const roomIndex = this.list.findIndex(r => r.id === room.id);
      this.list[roomIndex].players = this.list[roomIndex].players(p => p.name !== player.name);
    }
    // this.list.splice(roomIndex, 1);
    client.leave(data.roomId);
    this.io.sockets.in(room.id).emit('Rooms/leave', {
      type: 'ok',
      message: `${player.name} left room ${room.name}.`,
    });
    console.log(`${player.name} left room ${room.name}.`);
    this.getList();
  }

}

module.exports = Rooms;
