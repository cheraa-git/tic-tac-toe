import { Socket } from "socket.io-client"
import { ClientToServerEvents, ServerToClientEvents } from "../../common/common_types"

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

