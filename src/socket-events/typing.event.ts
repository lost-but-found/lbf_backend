import { io } from "..";
import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";

export function handleTyping(socket: Socket) {
  socket.on(SocketEvents.Typing, ({ to, writting, room }) => {
    io.to(to).emit(SocketEvents.ReceiveTyping, { writting, room, to });
  });
}
