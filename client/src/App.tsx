import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from "react-router-dom"
import { AuthPage } from "./pages/AuthPage"
import { NavBar } from "./components/NavBar"
import { MainPage } from "./pages/MainPage"
import { RootState, useAppSelector } from "./store/store"

function App() {
  const navigate = useNavigate()
  const { currentUser, socket } = useAppSelector((state: RootState) => state.app)
  const isAuth = currentUser && socket?.connected

  useEffect(() => {
    if (!isAuth) {
      navigate('/')
    } else {
      navigate('/main')
    }
  }, [isAuth, navigate])

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<AuthPage/>}/>
        <Route path="/main" element={<MainPage/>}/>
      </Routes>
    </>
  )
}

export default App
