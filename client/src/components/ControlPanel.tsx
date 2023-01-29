import { FC } from "react"
import { PlayersList } from "./PlayersList"
import { GameHistory } from "./GameHistory"

export const ControlPanel: FC = () => {
  return (
    <div className="w-full sm:bg-green-200 sm:shadow-2xl p-4 sm:flex">
      <div className="sm:w-[50%] sm:mr-4">
        <h1 className="text-2xl text-center">Players online:</h1>
        <PlayersList/>
      </div>
      <div className="sm:w-[50%] sm:mr-4">
        <h1 className="text-2xl text-center">Game history</h1>
        <GameHistory/>
      </div>
    </div>
  )
}
