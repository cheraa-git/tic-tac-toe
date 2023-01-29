import { GameResult } from "../../../common/common_types"

export const ResultGameText = ({result}: {result: GameResult}) => {
  switch (result) {
    case "draw":
      return <p className="text-gray-500 mt-[3px]">Draw</p>
    case "lose":
      return <p className="text-red-500 mt-[3px]">You are Lose</p>
    case "win":
      return <p className="text-green-500 mt-[3px]">You are Win</p>
  }
}
