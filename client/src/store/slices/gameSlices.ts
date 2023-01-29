import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { BoardData, GameResult, StartGameData, UserShape } from "../../../../common/common_types"

export interface GameSlice {
  opponentName: string
  shape: UserShape | null
  boardData: BoardData
  incomingInviteName: string
  moveAvailable: boolean
  roomName: string
  resultGame: GameResult | null
  gamesHistory: { opponent: string, result: GameResult }[]
  infoMessage: string

}

const initialState: GameSlice = {
  opponentName: '',
  boardData: [
    ["none", "none", "none"],
    ["none", "none", "none"],
    ["none", "none", "none"]
  ],
  shape: null,
  incomingInviteName: '',
  moveAvailable: false,
  roomName: '',
  resultGame: null,
  gamesHistory: [],
  infoMessage: ''
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setBoardData: (state, { payload: data }: PayloadAction<BoardData>) => {
      state.boardData = data
    },
    setIncomingInviteName: (state, { payload: name }: PayloadAction<string>) => {
      state.incomingInviteName = name
    },
    setGameData: (state, { payload: gameData }: PayloadAction<StartGameData>) => {
      state.shape = gameData.shape
      state.opponentName = gameData.opponentName
      state.roomName = gameData.roomName
      state.moveAvailable = gameData.moveAvailable
      state.boardData = initialState.boardData
      state.resultGame = null
    },
    setResultGame: (state, { payload }: PayloadAction<GameResult>) => {
      state.resultGame = payload
      state.gamesHistory.push({ opponent: state.opponentName, result: payload })
      state.moveAvailable = false
      state.incomingInviteName = ''
      state.roomName = ''
      state.shape = null
    },
    toggleMove: state => {
      state.moveAvailable = !state.moveAvailable
    },
    clearGameState: () => {
      return initialState
    },
    setInfoMessage: (state, { payload }: PayloadAction<string>) => {
      state.infoMessage = payload
    }
  }
})

export const {
  setBoardData,
  setIncomingInviteName,
  setGameData,
  setResultGame,
  toggleMove,
  clearGameState,
  setInfoMessage
} = gameSlice.actions

export default gameSlice.reducer
