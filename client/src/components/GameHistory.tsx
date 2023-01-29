import { FC } from "react"
import { RootState, useAppSelector } from "../store/store"
import { ResultGameText } from "./ResultGameText"

export const GameHistory: FC = () => {

  const gamesHistory = useAppSelector((state: RootState) => state.game.gamesHistory)
  const winNumber = gamesHistory.reduce((acc, game) => game.result === 'win' ? ++acc : acc, 0)
  const loseNumber = gamesHistory.reduce((acc, game) => game.result === 'lose' ? ++acc : acc, 0)

  return (
    <div className="h-[200px] shadow bg-sky-200 p-5">
      <div className="flex justify-evenly text-lg border-b-2 border-white">
        <h2>Win: {winNumber}</h2>
        <h2>Lose: {loseNumber}</h2>
      </div>
      <div className="overflow-y-scroll h-[80%]">
        {gamesHistory.map((game, index) => (
          <div className="border-b border-white px-5 py-2 my-auto flex justify-around" key={index}>
            <p className="capitalize">VS {game.opponent}</p>
            <ResultGameText result={game.result}/>
          </div>
        ))}
      </div>
    </div>
  )
}
