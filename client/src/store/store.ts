import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import AppReducer from './slices/appSlices'
import GameReducer from './slices/gameSlices'

export const store = configureStore({
  reducer: {
    app: AppReducer,
    game: GameReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['app/setSocket'],
      ignoredPaths: ['app.socket']
    }
  })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
