import oIcon from "../assets/circle.svg"
import xIcon from "../assets/x.svg"
import winXIcon from '../assets/x_win.svg'
import winOIcon from '../assets/circle_win.svg'
import { BoardEntry } from "../../../common/common_types"

export const BoardImage = ({ type }: { type: BoardEntry }) => {
  switch (type) {
    case "circle":
      return <img className="px-4 mx-auto h-full" src={oIcon} alt="circle" width={100}/>
    case "cross":
      return <img className="px-4 mx-auto h-full" src={xIcon} alt="cross" width={100}/>
    case "winCircle":
      return <img className="px-4 mx-auto h-full" src={winOIcon} alt="cross" width={100}/>
    case 'winCross':
      return <img className="px-4 mx-auto h-full" src={winXIcon} alt="cross" width={100}/>
    default:
      return <></>
  }
}
