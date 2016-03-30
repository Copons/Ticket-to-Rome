'use strict';
const uuid = require('node-uuid');


class Rooms {

  constructor(io) {
    this.io = io;
    this.list = [];
  }


  getList() {
    this.io.sockets.emit('room/list', { list: this.list });
  }


  create(data, client) {
    let room = this.list.find(existingRoom => existingRoom.name === data.roomName);
    if (!room) {
      room = {
        name: data.roomName,
        id: uuid.v4(),
        owner: {
          id: client.id,
          name: data.playerName,
        },
        players: [],
      };
      this.list.push(room);
    }
    this.join({
      roomId: room.id,
      playerName: data.playerName,
    }, client);
  }


  join(data, client) {
    const room = this.list.find(existingRoom => existingRoom.id === data.roomId);
    if (!room) {
      client.emit('room/join', {
        type: 'error',
        message: `Room ${data.roomId} does not exists.`,
      });
      console.log(`Room ${data.roomId} does not exists.`);
    } else if (room.players.length >= 5) {
      client.emit('room/join', {
        type: 'error',
        message: `Room ${data.roomId} is full.`,
      });
      console.log(`Room ${data.roomId} is full.`);
    } else if (room.players.find(player => player.id === client.id)) {
      client.emit('room/join', {
        type: 'error',
        message: `${data.playerName} is already in room ${data.roomId}.`,
      });
      console.log(`${data.playerName} is already in room ${data.roomId}.`);
    } else {
      this.leaveAll(data, client);
      room.players.push({
        id: client.id,
        name: data.playerName,
      });
      client.join(data.roomId);
      this.io.sockets.in(data.roomId).emit('room/join', {
        type: 'ok',
        message: `${data.playerName} joined room ${data.roomId}.`,
      });
      console.log(`${data.playerName} joined room ${data.roomId}.`);
      this.getList();
    }
  }

  leaveAll(data, client) {
    for (const room of this.list) {
      if (room.players.find(player => player.id === client.id)) {
        this.leave({
          roomId: room.id,
          playerName: data.playerName,
        }, client);
      }
    }
  }

  leave(data, client) {
    const roomIndex = this.list.findIndex(room => room.id === data.roomId);
    this.list.splice(roomIndex, 1);
    client.leave(data.roomId);
    this.io.sockets.in(data.roomId).emit('room/leave', {
      type: 'ok',
      message: `${data.playerName} left room ${data.roomId}.`,
    });
    console.log(`${data.playerName} left room ${data.roomId}.`);
    this.getList();
  }

}

module.exports = Rooms;
