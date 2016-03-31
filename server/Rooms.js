'use strict';


class Rooms {

  constructor(io) {
    this.io = io;
    this.list = [];
  }


  getList() {
    this.io.sockets.emit('Rooms/list', { list: this.list });
  }


  create(newRoom, client) {
    let room = this.list.find(r => r.name === newRoom.name);
    if (!room) {
      room = newRoom;
      this.list.push(room);
    }
    return this.join(room, room.owner, client);
  }


  join(roomToJoin, player, client) {
    const room = this.list.find(r => r.id === roomToJoin.id);
    if (!room) {
      console.log(`Room [${roomToJoin.name}] does not exist.`);
      return `Room <b>${roomToJoin.name}</b> does not exist.`;
    } else if (room.players.length >= 5) {
      console.log(`Room [${room.name}] is full.`);
      return `Room <b>${room.name}</b> is full.`;
    } else if (room.players.find(p => p.id === player.id)) {
      console.log(`[${player.name}] is already in room [${room.name}].`);
      return `You are already in room <b>${room.name}</b>.`;
    } else {
      this.leaveAll(client);
      room.players.push(player);
      client.join(room.id);
      this.getList();
      console.log(`[${player.name}] joined room [${room.name}].`);
      return 'ok';
    }
  }


  leaveAll(client) {
    const player = {
      id: client.id,
    };
    for (const room of this.list) {
      if (room.players.find(p => client.id.includes(p.id))) {
        this.leave(room, player, client);
      }
    }
  }


  leave(roomToLeave, player, client) {
    const room = this.list.find(r => r.id === roomToLeave.id);
    if (!room) {
      console.log(`Room [${roomToLeave.name}] does not exist.`);
      return `Room <b>${roomToLeave.name}</b> does not exist.`;
    }

    const roomIndex = this.list.findIndex(r => r.id === room.id);

    if (room.status === 'playing') {
      this.list[roomIndex].status = 'open';
      console.log(`Game in room [${room.name}] closed because owner left.`);
      this.io.sockets.in(room.id).emit('Game/closed', room);
    }

    if (player.id.includes(room.owner.id)) {
      this.list = this.list.filter(r => r.id !== room.id);
    } else {
      this.list[roomIndex].players = this.list[roomIndex].players.filter(
        p => !player.id.includes(p.id)
      );
    }
    client.leave(room.id);
    console.log(`[${player.name}] left room [${room.name}].`);
    this.getList();
    return 'ok';
  }


  start(roomToStart) {
    const roomIndex = this.list.findIndex(r => r.id === roomToStart.id);
    if (roomIndex === -1) {
      console.log(`Room [${roomToStart.name}] does not exist.`);
      return `Room <b>${roomToStart.name}</b> does not exist.`;
    } else if (this.list[roomIndex].players.length < 1) {
      console.log(`Room [${roomToStart.name}] is empty.`);
      return `Room <b>${roomToStart.name}</b> is empty.`;
    }

    this.list[roomIndex].status = 'playing';
    this.getList();
    this.io.sockets.in(roomToStart.id).emit('Game/started', this.list[roomIndex]);
    console.log(`Started game in room [${roomToStart.name}].`);
    return 'ok';
  }

}

module.exports = Rooms;
