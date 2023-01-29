import { FC } from "react"
import logoutIcon from '../assets/logout.svg'
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { logout } from "../store/actions/appActions"

export const NavBar: FC = () => {
  const dispatch = useAppDispatch()
  const { currentUser, socket } = useAppSelector((state: RootState) => state.app)

  const logoutHandler = () => {
    dispatch(logout())
    socket?.close()
  }

  return (
    <nav className="bg-green-200">
      <div className="mx-auto max-w-7xl px-2">
        <div className="relative flex h-16 items-center text-white">
          <div className="block sm:flex min-w-[200px]">
            <h1 className="sm:text-5xl text-2xl">Tic tac toe</h1>
          </div>
          <div className="ml-auto flex">
            <p className="sm:text-3xl text-xl mr-3 capitalize self-center">{currentUser}</p>
            {
              currentUser
              && <img className="text-white transition-opacity hover:opacity-70 cursor-pointer"
                      src={logoutIcon}
                      width={40}
                      alt="logout-icon"
                      onClick={logoutHandler}
              />
            }
          </div>
        </div>
      </div>
    </nav>
  )
}
