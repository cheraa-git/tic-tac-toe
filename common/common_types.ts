export interface ClientToServerEvents {
  login: (name: string) => void;
  send_invite: (to: string) => void
  accept_invite: (to: string) => void
  do_move: (payload: { boardData: BoardData, shape: UserShape, roomName: string }) => void
}

export interface ServerToClientEvents {
  users_online: (users: string[]) => void
  name_exists: () => void
  login: (users: string[], currentUser: string) => void
  incoming_invite: (from: string) => void
  start_game: (gameData: StartGameData) => void
  move: (payload: { boardData: BoardData, result: MoveResult }) => void
  user_is_playing: (name: string) => void
  opponent_disconnected: (name: string) => void
}


export interface SocketData {
  name: string
  status: 'playing' | 'waiting'
  roomName: string
}

export type BoardEntry = 'circle' | 'cross' | 'none' | 'winCircle' | 'winCross'
export type UserShape = 'circle' | 'cross'
export type BoardRow = [BoardEntry, BoardEntry, BoardEntry]
export type BoardData = [BoardRow, BoardRow, BoardRow]
export type MoveResult = 'win' | 'draw' | 'next'
export type GameResult = 'win' | 'draw' | 'lose'

export interface StartGameData {
  opponentName: string
  shape: UserShape
  roomName: string
  moveAvailable: boolean
}
