import { AppServer } from "./types"
import { BoardData, BoardRow, MoveResult, UserShape } from "../common/common_types"
import { Socket } from "socket.io"

export const getOnlineUsers = (io: AppServer) => {
  const users: { [userName: string]: Socket } = {}
  io.sockets.sockets.forEach(socket => {
    if (socket.data.name) {
      users[socket.data.name] = socket
    }
  })
  return users
}

type CheckWinPayload = [('row' | 'column' | 'leftTop' | 'leftBottom'), number]
export const checkWin = (board: BoardData, shape: UserShape): { status: MoveResult, payload?: CheckWinPayload } => {
  let countItems = 0
  const length = board.length
  for (let r = 0; r < length; r++) {
    let winRow: 'row' | '' = 'row'
    let winColumn: 'column' | '' = 'column'
    let winLeftTop: 'leftTop' | '' = 'leftTop'
    let winLeftBottom: 'leftBottom' | '' = 'leftBottom'
    for (let i = 0; i < length; i++) {
      if (board[r][i] !== 'none') countItems++
      if (board[r][i] !== shape) winRow = ''
      if (board[i][r] !== shape) winColumn = ''
      if (board[i][i] !== shape) winLeftTop = ''
      if (board[i][length - i - 1] !== shape) winLeftBottom = ''
    }
    const result = winRow || winColumn || winLeftTop || winLeftBottom
    if (result) {
      return { status: 'win', payload: [result, r] }
    }
    if (countItems === length * length) return { status: 'draw' }
  }
  return { status: 'next' }
}

export const setWinBoardData = (boardData: BoardData, payload: CheckWinPayload) => {
  if (payload) {
    switch (payload[0]) {
      case 'column':
        return boardData.map((row) => {
          row[payload[1]] = row[payload[1]] === "circle" ? 'winCircle' : 'winCross'
          return row
        })
      case "row":
        return boardData.map((row, index) => {
          if (payload[1] === index) {
            return row.map(item => item === "circle" ? 'winCircle' : 'winCross') as BoardRow
          }
          return row
        })
      case "leftBottom":
        return boardData.map((row, index) => {
          row[row.length - index - 1] = row[row.length - index - 1] === "circle" ? 'winCircle' : 'winCross'
          return row
        })
      case "leftTop":
        return boardData.map((row, index) => {
          row[index] = row[index] === "circle" ? 'winCircle' : 'winCross'
          return row
        })
    }
  }
}
