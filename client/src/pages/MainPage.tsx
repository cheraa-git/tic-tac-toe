import { FC, useEffect, useState } from "react"
import { GameBoard } from "../components/GameBoard"
import { ControlPanel } from "../components/ControlPanel"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { Button, Dialog } from "@mui/material"
import { setIncomingInviteName, setInfoMessage } from "../store/slices/gameSlices"
import { acceptInvite } from "../store/actions/gameActions"

export const MainPage: FC = () => {
  const dispatch = useAppDispatch()
  const { incomingInviteName, infoMessage } = useAppSelector((state: RootState) => state.game)
  const [inviteIsOpen, setInviteIsOpen] = useState(false)

  useEffect(() => {
    if (incomingInviteName) {
      setInviteIsOpen(true)
    }
  }, [incomingInviteName])

  const cancelInviteHandler = () => {
    setInviteIsOpen(false)
    dispatch(setIncomingInviteName(''))
  }

  const acceptInviteHandler = () => {
    setInviteIsOpen(false)
    dispatch(acceptInvite())
  }

  const closeInfoMessage = () => {
    dispatch(setInfoMessage(''))
  }
  return (
    <div className="flex flex-col w-[70%] mt-5 mx-auto min-w-[350px]">
      <ControlPanel/>
      <GameBoard/>
      <Dialog open={inviteIsOpen} onClose={cancelInviteHandler}>
        <div className="p-5">
          <h1 className="text-2xl text-center mb-5">
            User <span className="capitalize">{incomingInviteName}</span> invites you to play
          </h1>
          <div className="flex justify-around">
            <Button color="error" onClick={cancelInviteHandler}>Cancel</Button>
            <Button onClick={acceptInviteHandler}>Accept</Button>
          </div>
        </div>
      </Dialog>
      <Dialog open={!!infoMessage} onClose={closeInfoMessage}>
        <h1 className="text-xl p-5">{infoMessage}</h1>
        <Button onClick={closeInfoMessage} color="inherit">Close</Button>
      </Dialog>
    </div>
  )
}
