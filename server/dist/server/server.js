"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const socket_io_1 = require("socket.io");
const utils_1 = require("./utils");
const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = new socket_io_1.Server(server);
app.use(cors());
io.on('connection', (socket) => {
    socket.on('login', (name) => {
        for (let [_, s] of io.sockets.sockets) {
            if (s.data.name === name) {
                socket.emit('name_exists');
                return;
            }
        }
        socket.data.name = name;
        const users = Object.keys((0, utils_1.getOnlineUsers)(io));
        socket.emit('login', users, name);
        socket.broadcast.emit('users_online', users);
    });
    socket.on('send_invite', (name) => {
        const invitedUser = (0, utils_1.getOnlineUsers)(io)[name];
        if (invitedUser.data.status === 'playing') {
            return socket.emit('user_is_playing', invitedUser.data.name);
        }
        if (socket.data.name && invitedUser) {
            invitedUser.emit('incoming_invite', socket.data.name);
        }
        else {
            console.log('NAME NOT FOUND');
        }
    });
    socket.on('accept_invite', (name) => {
        const invitingUser = (0, utils_1.getOnlineUsers)(io)[name];
        if (invitingUser && socket.data.name) {
            const roomName = socket.id + invitingUser.id;
            const moveAvailable = !!Math.floor(Math.random() * 2);
            const invitingUserData = {
                opponentName: socket.data.name,
                shape: 'cross',
                roomName,
                moveAvailable
            };
            const invitedUserData = {
                opponentName: invitingUser.data.name,
                shape: 'circle',
                roomName,
                moveAvailable: !moveAvailable
            };
            socket.data.status = 'playing';
            invitingUser.data.status = 'playing';
            socket.join(roomName);
            invitingUser.join(roomName);
            socket.emit('start_game', invitedUserData);
            invitingUser.emit('start_game', invitingUserData);
        }
    });
    socket.on('do_move', ({ boardData, shape, roomName }) => {
        const result = (0, utils_1.checkWin)(boardData, shape);
        if (result.status === "win" && result.payload) {
            boardData = (0, utils_1.setWinBoardData)(boardData, result.payload);
            io.to(roomName).fetchSockets().then(players => {
                players.forEach(player => {
                    player.data.status = 'waiting';
                });
            });
        }
        const moveData = {
            boardData,
            result: result.status
        };
        io.to(roomName).emit('move', moveData);
        if (result.status !== 'next') {
            io.in(roomName).socketsLeave(roomName);
        }
    });
    socket.on('disconnect', () => {
        socket.data.name = '';
        socket.data.status = undefined;
        socket.broadcast.emit('users_online', Object.keys((0, utils_1.getOnlineUsers)(io)));
    });
    socket.on('error', () => {
        socket.data.name = '';
        socket.data.status = undefined;
        socket.broadcast.emit('users_online', Object.keys((0, utils_1.getOnlineUsers)(io)));
    });
});
server.listen(PORT, () => {
    console.log(`App listen on port ${PORT}...`);
});
