import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";

export function handleJoinChats(socket: Socket) {
  socket.on(SocketEvents.JoinChats, ({ chats }) => {
    chats.forEach((chat: string) => {
      socket.join(chat);
    });
  });
}
