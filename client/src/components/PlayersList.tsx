import { FC, useEffect, useState } from "react"
import { Button } from "@mui/material"
import { PlayersOfflineLoader } from "./Loader/PlayersOfflineLoader"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { sendInvite } from "../store/actions/gameActions"

export const PlayersList: FC = () => {
  const dispatch = useAppDispatch()
  const { onlineUsers, currentUser } = useAppSelector((state: RootState) => state.app)
  const [players, setPlayers] = useState(onlineUsers.filter(user => user !== currentUser))
  const [playersFilter, setPlayersFilter] = useState('')


  useEffect(() => {
    setPlayers(onlineUsers.filter(user => user !== currentUser))
  }, [onlineUsers, currentUser])

  const sendInviteHandler = (name: string) => {
    dispatch(sendInvite(name))
  }

  const searchPlayersHandler = (value: string) => {
    if (value) {
      setPlayers(onlineUsers.filter(user => user.includes(value)).filter(user => user !== currentUser))
    } else {
      setPlayers(onlineUsers.filter(user => user !== currentUser))
    }
    setPlayersFilter(value)
  }

  return (
    <div className="h-[200px] overflow-y-scroll shadow bg-sky-200 p-5 pt-2">
      <input className="outline-none py-1 px-2 w-full bg-sky-100 rounded text-gray-600"
             placeholder="Search players..."
             value={playersFilter}
             onChange={e => searchPlayersHandler(e.target.value)}
      />
      {players.length === 0 && <div className="text-center"><PlayersOfflineLoader/></div>}
      {players.map((name, index) => (
        <div className="border-b border-white px-5 py-2 my-auto flex" key={index}>
          <p className="self-center mr-auto">{name}</p>
          <Button onClick={() => sendInviteHandler(name)}>Invite</Button>
        </div>
      ))}
    </div>
  )
}
