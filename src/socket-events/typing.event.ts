import { io } from "..";
import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";

export function handleTyping(socket: Socket) {
  socket.on(SocketEvents.Typing, ({ to, typing, room }) => {
    io.to(room).emit(SocketEvents.ReceiveTyping, { typing, room, to });
  });
}
