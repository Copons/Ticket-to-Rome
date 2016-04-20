'use strict';
const CONFIG = require('../../config');
const Response = require('../communications/Response');
const Room = require('./Room');


class Rooms {


  constructor() {
    this.list = [];
  }


  emitList() {
    return Response.success('Rooms.emitList', this.list);
  }


  create(room, players, client, io) {
    let response = {};
    const player = players.list.find(p => p.id === room.owner.id).simplify();

    if (this.list.find(r => r.name === room.name)) {
      response = Response.error(`Room [${room.name}] already exists.`);
    } else {
      const newRoom = new Room(room);
      this.list.push(newRoom);
      response = this.join({
        player,
        room: newRoom,
      }, players, client, io);
    }

    io.sockets.emit('Rooms.getList', this.emitList());
    return response;
  }


  join(data, players, client, io) {
    let response = {};
    const room = this.list.find(r => r.id === data.room.id);
    const player = players.list.find(p => p.id === data.player.id).simplify();

    if (!room) {
      response = Response.error(`Room [${data.room.name}] does not exist.`);
    } else if (room.players.length >= CONFIG.RULES.player.max) {
      response = Response.error(`Room [${room.name}] is full.`);
    } else if (room.players.find(p => p.id === player.id)) {
      response = Response.error(`Player [${player.name}] is already in room [${room.name}].`);
    } else {
      this.leaveAll(client);
      room.players.push(player);
      client.join(room.id);
      response = Response.success(
        `Player [${player.name}] joined room [${room.name}].`,
        room
      );
    }

    if (response.type === 'success') {
      client.broadcast.in(room.id).emit('Message.Player.joinRoom', response.message);
    }

    io.sockets.emit('Rooms.getList', this.emitList());
    return response;
  }


  leaveAll(client) {
    const player = {
      id: client.id,
      name: client.name || client.id,
    };
    for (const room of this.list) {
      if (room.players.find(p => player.id.includes(p.id))) {
        this.leave(room, player, client);
      }
    }
  }


  leave(roomToLeave, player, client) {
    const room = this.list.find(r => r.id === roomToLeave.id);
    if (!room) {
      return Response.error(`Room [${roomToLeave.name}] does not exist.`);
    }

    if (room.status === 'playing') {
      room.status = 'open';
    }

    if (player.id.includes(room.owner.id)) {
      this.list = this.list.filter(r => r.id !== room.id);
    } else {
      room.players = room.players.filter(p => !player.id.includes(p.id));
    }
    client.leave(room.id);
    return Response.success(`Player [${player.name}] left room [${room.name}].`, room);
  }


  startGame(roomToStart, games) {
    const room = this.list.find(r => r.id === roomToStart.id);
    if (!room) {
      return Response.error(`Room [${roomToStart.name}] does not exist.`);
    } else if (room.players.length < 1) {
      return Response.error(`Room [${room.name}] is empty.`);
    }

    room.status = 'playing';
    return games.start(room);
  }

}


module.exports = Rooms;
