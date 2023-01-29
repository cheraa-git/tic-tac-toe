import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppSocket } from "../../types"

export interface AppSlice {
  socket: AppSocket | null
  onlineUsers: string[]
  currentUser: string
  errorMessage: string

}

const initialState: AppSlice = {
  socket: null,
  onlineUsers: [],
  currentUser: '',
  errorMessage: '',
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSocket: (state, { payload: socket }: PayloadAction<AppSocket | null>) => {
      return { ...state, socket: socket }
    },
    setOnlineUsers: (state, { payload: users }: PayloadAction<string[]>) => {
      state.onlineUsers = users
    },
    clearAppState: () => {
      return initialState
    },
    setCurrentUser: (state, { payload: name }: PayloadAction<string>) => {
      state.currentUser = name
    },
    setError: (state, { payload: error }: PayloadAction<string>) => {
      state.errorMessage = error
    },

  }
})

export const { setSocket, setOnlineUsers, clearAppState, setCurrentUser, setError } = appSlice.actions

export default appSlice.reducer
