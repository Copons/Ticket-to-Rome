'use strict';
const CONFIG = require('../../config');
const Response = require('../communications/Response');
const Games = require('../games/Games');
const Players = require('../players/Players');
const Room = require('./Room');


class Rooms {


  constructor() {
    this.list = [];
  }


  emitList() {
    return Response.success('Rooms.emitList', this.list);
  }


  create(room, client, io) {
    let response = {};
    const player = Players.player(room.owner.id).simplify();

    if (this.list.find(r => r.name === room.name)) {
      response = Response.error(`Room [${room.name}] already exists.`);
    } else {
      const newRoom = new Room(room);
      this.list.push(newRoom);
      response = this.join({ player, room: newRoom }, client, io);
    }

    io.sockets.emit('Rooms.getList', this.emitList());
    return response;
  }


  join(data, client, io) {
    let response = {};
    const room = this.list.find(r => r.id === data.room.id);
    const player = Players.player(data.player.id).simplify();

    if (!room) {
      response = Response.error(`Room [${data.room.name}] does not exist.`);
    } else if (room.players.length >= CONFIG.RULES.player.max) {
      response = Response.error(`Room [${room.name}] is full.`);
    } else if (room.players.find(p => p.id === player.id)) {
      response = Response.error(`Player [${player.name}] is already in room [${room.name}].`);
    } else {
      this.leaveAll(client, io);
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


  leaveAll(client, io) {
    const player = {
      id: client.id,
      name: client.name || client.id,
    };

    for (const room of this.list) {
      if (room.players.find(p => player.id.includes(p.id))) {
        this.leave({ player, room }, client, io);
      }
    }

    io.sockets.emit('Rooms.getList', this.emitList());
  }


  leave(data, client, io) {
    let response = {};
    const room = this.list.find(r => r.id === data.room.id);

    if (!room) {
      response = Response.error(`Room [${data.room.name}] does not exist.`);
    } else {
      if (room.status === 'playing') {
        room.status = 'open';
      }

      if (data.player.id.includes(room.owner.id)) {
        this.list = this.list.filter(r => r.id !== room.id);
      } else {
        room.players = room.players.filter(p => !data.player.id.includes(p.id));
      }

      client.leave(room.id);
      response = Response.success(
        `Player [${data.player.name}] left room [${room.name}].`,
        room
      );
    }

    if (response.type === 'success') {
      io.in(room.id).emit('Message.Player.leaveRoom', response.message);
    }

    Games.closeOnLeaving(client, io);

    io.sockets.emit('Rooms.getList', this.emitList());
    return response;
  }


  startGame(roomToStart, io) {
    let response = {};
    const room = this.list.find(r => r.id === roomToStart.id);
    if (!room) {
      response = Response.error(`Room [${roomToStart.name}] does not exist.`);
    } else if (room.players.length < 1) {
      response = Response.error(`Room [${room.name}] is empty.`);
    } else {
      room.status = 'playing';
      response = Games.start(room);
    }

    if (response.type === 'success') {
      io.in(room.id).emit('Game.start', response);
    }

    return response;
  }

}


module.exports = new Rooms();
