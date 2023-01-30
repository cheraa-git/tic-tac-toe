import { FC } from "react"
import { BoardImage } from "./BoardImage"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { BoardData, BoardRow } from "../../../common/common_types"
import { doMove, sendInvite } from "../store/actions/gameActions"
import { ResultGameText } from "./ResultGameText"
import { Button } from "@mui/material"
import { Ellipsis } from "./Loader/Ellipsis"

export const GameBoard: FC = () => {
  const dispatch = useAppDispatch()
  const {
    boardData,
    shape,
    opponentName,
    moveAvailable,
    resultGame,
    gameLoading
  } = useAppSelector((state: RootState) => state.game)
  const { currentUser } = useAppSelector((state: RootState) => state.app)

  const setShapeHandler = (rowIndex: number, itemIndex: number) => {
    if (shape && opponentName && moveAvailable && boardData[rowIndex][itemIndex] === 'none') {
      const newBoardData: BoardData = [...boardData]
      const newRow: BoardRow = [...newBoardData[rowIndex]]
      newRow[itemIndex] = shape
      newBoardData[rowIndex] = newRow
      dispatch(doMove(newBoardData))
    }
  }

  if (!opponentName) return <></>
  return (
    <div className="my-5 w-[300px] mx-auto">
      <div className="text-xl text-center bg-green-200 rounded-lg mb-1 capitalize">
        <p className="font-bold">{currentUser} VS {opponentName}</p>
        <div className="flex justify-center">
          {
            resultGame
              ? <div className="flex justify-evenly">
                <ResultGameText result={resultGame}/>
                <Button onClick={() => dispatch(sendInvite(opponentName))}>Revenge</Button>
              </div>
              : <p>{moveAvailable ? 'Your move' : `${opponentName} move`}</p>
          }
          {gameLoading && <div className="mt-auto mb-2 ml-5"><Ellipsis/></div>}
        </div>

      </div>
      <div className="grid grid-cols-3 bg-sky-200 rounded mx-auto shadow-2xl relative">
        {!moveAvailable && <div className="w-full h-full absolute" style={{ background: '#0000000C' }}></div>}
        {boardData.map((row, rowIndex) => row.map((item, itemIndex) => (
            <div
              className="border border-white w-[100px] h-[100px] text-[80px] transition-colors hover:bg-sky-100 hover:bg-sky-100"
              key={`${rowIndex}${itemIndex}`}
              onClick={() => setShapeHandler(rowIndex, itemIndex)}
            >
              <BoardImage type={item}/>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
