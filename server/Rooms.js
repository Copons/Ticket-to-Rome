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
    let room = this.list.find(r => r.name === data.room.name);
    if (!room) {
      room = {
        id: uuid.v4(),
        name: data.room.name,
        owner: data.player,
        players: [],
      };
      this.list.push(room);
    }
    this.join({ room, player: data.player }, client);
  }


  join(data, client) {
    const room = this.list.find(r => r.id === data.room.id);

    if (!room) {
      // Room does not exist
      client.emit('Rooms/join/error', `Room [${data.room.name}] does not exists.`);
      console.log(`Room [${data.room.name}] does not exists.`);
    } else if (room.players.length >= 5) {
      // Room is full
      client.emit('Rooms/join/error', `Room [${room.name}] is full.`);
      console.log(`Room ${room.name} is full.`);
    } else if (room.players.find(p => p.id === data.player.id)) {
      // Player is already in the room
      client.emit('Rooms/join/error', `[${data.player.name}] is already in room [${room.name}].`);
      console.log(`[${data.player.name}] is already in room [${room.name}].`);
    } else {
      // Player joins the room
      this.leaveAll(data, client);
      room.players.push(data.player);
      client.join(room.id);
      this.io.sockets.in(room.id)
        .emit('Rooms/join', `[${data.player.name}] joined room [${room.name}].`);
      console.log(`[${data.player.name}] joined room [${room.name}].`);
      this.getList();
    }
  }


  leaveAll(data, client) {
    for (const room of this.list) {
      if (room.players.find(p => p.id === data.player.id)) {
        this.leave({ room, player: data.player }, client);
      }
    }
  }


  leave(data, client) {
    const room = this.list.find(r => r.id === data.room.id);
    if (room.owner.id === data.player.id) {
      this.list = this.list.filter(r => r.id !== room.id);
    } else {
      const roomIndex = this.list.findIndex(r => r.id === room.id);
      this.list[roomIndex].players = this.list[roomIndex].players.filter(
        p => p.id !== data.player.id
      );
    }
    client.leave(room.id);
    this.io.sockets.in(room.id)
      .emit('Rooms/leave', `[${data.player.name}] left room [${room.name}].`);
    console.log(`[${data.player.name}] left room [${room.name}].`);
    this.getList();
  }

}

module.exports = Rooms;
