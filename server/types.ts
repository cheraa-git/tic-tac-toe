import { Server } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, SocketData } from "../common/common_types"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

export type AppServer = Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>
