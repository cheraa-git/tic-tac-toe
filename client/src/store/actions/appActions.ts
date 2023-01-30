import { AppDispatch } from "../store"
import { io } from "socket.io-client"
import { clearAppState, setCurrentUser, setError, setLoading, setOnlineUsers, setSocket } from "../slices/appSlices"
import { AppSocket } from "../../types"
import { clearGameState, } from "../slices/gameSlices"
import { gameEvents } from "./gameActions"

export const connect = (name: string) => (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const socket: AppSocket = io(process.env.REACT_APP_SERVER_URL + '', { transports: ['websocket'] })
  socket.on('connect', () => {
    socket.emit('login', name)
    dispatch(setSocket(socket))
    console.log('connected', socket.id)
  })
  socket.on('disconnect', () => {
    dispatch(logout())
    dispatch(setLoading(false))
    console.log('disconnect')
  })
  socket.on('connect_error', () => {
    socket.close()
    dispatch(logout())
    dispatch(setError('Connection error'))
    dispatch(setLoading(false))
    console.log('connect_error')
  })
  dispatch(authEvents(socket))
  dispatch(gameEvents(socket))
}

export const logout = () => (dispatch: AppDispatch) => {
  dispatch(clearAppState())
  dispatch(clearGameState())
}

export const authEvents = (socket: AppSocket) => (dispatch: AppDispatch) => {
  socket.on('users_online', (users) => {
    dispatch(setOnlineUsers(users))
  })

  socket.on('login', (users, currentUser) => {
    console.log('LOGIN', currentUser, users)
    dispatch(setLoading(false))
    dispatch(setOnlineUsers(users))
    dispatch(setCurrentUser(currentUser))
  })

  socket.on('name_exists', () => {
    socket.close()
    dispatch(setError('This name already exists'))
  })
}

