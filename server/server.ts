import * as http from "http"
import { Server } from "socket.io"
import { BoardData, StartGameData } from "../common/common_types"
import { AppServer } from "./types"
import { checkWin, getOnlineUsers, setWinBoardData } from "./utils"

const express = require('express')
const dotenv = require("dotenv")
const cors = require('cors')

dotenv.config()

const PORT = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const io: AppServer = new Server(server)
app.use(cors())


io.on('connection', (socket) => {
  socket.on('login', (name) => {
    for (let [_, s] of io.sockets.sockets) {
      if (s.data.name === name) {
        socket.emit('name_exists')
        return
      }
    }
    socket.data.name = name
    const users = Object.keys(getOnlineUsers(io))
    socket.emit('login', users, name)
    socket.broadcast.emit('users_online', users)
  })

  socket.on('send_invite', (name) => {
    const invitedUser = getOnlineUsers(io)[name]
    if (invitedUser && invitedUser.data.status === 'playing') {
      return socket.emit('user_is_playing', invitedUser.data.name)
    }
    if (socket.data.name && invitedUser) {
      invitedUser.emit('incoming_invite', socket.data.name)
    } else {
      console.log('NAME NOT FOUND')
    }
  })

  socket.on('accept_invite', (name) => {
    const invitingUser = getOnlineUsers(io)[name]
    if (invitingUser && socket.data.name) {
      const roomName = socket.id + invitingUser.id
      const moveAvailable = !!Math.floor(Math.random() * 2)
      const invitingUserData: StartGameData = {
        opponentName: socket.data.name,
        shape: 'cross',
        roomName,
        moveAvailable
      }
      const invitedUserData: StartGameData = {
        opponentName: invitingUser.data.name,
        shape: 'circle',
        roomName,
        moveAvailable: !moveAvailable
      }
      socket.data.status = 'playing'
      socket.data.roomName = roomName
      invitingUser.data.status = 'playing'
      invitingUser.data.roomName = roomName
      socket.join(roomName)
      invitingUser.join(roomName)
      socket.emit('start_game', invitedUserData)
      invitingUser.emit('start_game', invitingUserData)
    }
  })

  socket.on('do_move', ({ boardData, shape, roomName }) => {
    const result = checkWin(boardData, shape)
    if (result.status === "win" || result.status === 'draw') {
      io.to(roomName).fetchSockets().then(players => {
        players.forEach(player => {
          player.data.status = 'waiting'
        })
      })
      if (result.payload) {
        boardData = setWinBoardData(boardData, result.payload) as BoardData
      }
    }


    const moveData = {
      boardData,
      result: result.status
    }
    io.to(roomName).emit('move', moveData)
    if (result.status !== 'next') {
      io.in(roomName).socketsLeave(roomName)
    }
  })

  socket.on('disconnect', () => {
    const roomName = socket.data.roomName + ''
    io.in(roomName).emit('opponent_disconnected', socket.data.name + '')
    io.in(roomName).fetchSockets().then(players => {
      players.forEach(player => player.data.status = "waiting")
    })
    console.log('ROOMS', socket.data.roomName)
    socket.data.name = ''
    socket.data.status = undefined
    socket.broadcast.emit('users_online', Object.keys(getOnlineUsers(io)))
  })
  socket.on('error', () => {
    socket.data.name = ''
    socket.data.status = undefined
    socket.broadcast.emit('users_online', Object.keys(getOnlineUsers(io)))
  })

})


server.listen(PORT, () => {
  console.log(`App listen on port ${PORT}...`)
})
