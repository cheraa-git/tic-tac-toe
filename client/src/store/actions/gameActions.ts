import { AppDispatch, RootState } from "../store"
import { BoardData } from "../../../../common/common_types"
import { AppSocket } from "../../types"
import {
  setBoardData,
  setGameData,
  setIncomingInviteName,
  setInfoMessage,
  setResultGame,
  toggleMove
} from "../slices/gameSlices"


export const gameEvents = (socket: AppSocket) => (dispatch: AppDispatch, getState: () => RootState) => {
  socket.on('incoming_invite', (name) => {
    dispatch(setIncomingInviteName(name))
  })

  socket.on('user_is_playing', (name) => {
    console.log('user_is_playing', name)
    dispatch(setInfoMessage(`${name} is playing`))
  })

  socket.on('start_game', gameData => {
    dispatch(setGameData(gameData))
  })

  socket.on('move', ({ boardData, result }) => {
    dispatch(setBoardData(boardData))
    const moveAvailable = getState().game.moveAvailable
    if (result === 'win' && moveAvailable) {
      dispatch(setResultGame("win"))
    } else if (result === 'win' && !moveAvailable) {
      dispatch(setResultGame("lose"))
    } else if (result === 'draw') {
      dispatch(setResultGame("draw"))
    } else if (result === 'next') {
      dispatch(toggleMove())
    }
  })
}

export const sendInvite = (name: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  const socket = getState().app.socket
  if (socket) {
    socket.emit('send_invite', name)
    console.log('send_invite', name)
  }
}

export const acceptInvite = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const socket = getState().app.socket
  const incomingInviteName = getState().game.incomingInviteName
  if (socket && incomingInviteName) {
    socket.emit('accept_invite', incomingInviteName)
  }
}

export const doMove = (boardData: BoardData) => (dispatch: AppDispatch, getState: () => RootState) => {
  const socket = getState().app.socket
  const { roomName, shape } = getState().game
  if (shape && roomName && boardData && socket) {
    socket.emit('do_move', { boardData, shape, roomName })
  }
}
