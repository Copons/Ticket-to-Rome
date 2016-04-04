'use strict';
const CONFIG = require('../../config');
const Response = require('../communications/Response');
const Room = require('./Room');


class RoomsList {


  constructor() {
    this.list = [];
  }


  getList() {
    return this.list;
  }


  emitList() {
    return Response.success('Rooms.emitList', this.getList());
  }


  create(newRoom, client) {
    if (this.list.find(r => r.name === newRoom.name)) {
      return Response.error(`Room [${newRoom.name}] already exists.`);
    }
    const room = new Room(newRoom);

    this.list.push(room);
    return this.join(room, room.owner, client);
  }


  join(roomToJoin, player, client) {
    const room = this.list.find(r => r.id === roomToJoin.id);
    if (!room) {
      return Response.error(`Room [${roomToJoin.name}] does not exist.`);
    } else if (room.players.length >= CONFIG.RULES.player.max) {
      return Response.error(`Room [${room.name}] is full.`);
    } else if (room.players.find(p => p.id === player.id)) {
      return Response.error(`Player [${player.name}] is already in room [${room.name}].`);
    }

    this.leaveAll(client);
    room.players.push(player);
    client.join(room.id);
    return Response.success(`Player [${player.name}] joined room [${room.name}].`, room);
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

    if (player.id.includes(room.owner.id)) {
      this.list = this.list.filter(r => r.id !== room.id);
    } else {
      room.players = room.players.filter(p => !player.id.includes(p.id));
    }
    client.leave(room.id);
    return Response.success(`Player [${player.name}] left room [${room.name}].`, room);
  }


  startGame(roomToStart) {
    const room = this.list.find(r => r.id === roomToStart.id);
    if (!room) {
      return Response.error(`Room [${roomToStart.name}] does not exist.`);
    } else if (room.players.length < 1) {
      return Response.error(`Room [${room.name}] is empty.`);
    }

    room.status = 'playing';
    return Response.success(`Starting game in room [${room.name}].`, room);
  }

}


module.exports = RoomsList;
