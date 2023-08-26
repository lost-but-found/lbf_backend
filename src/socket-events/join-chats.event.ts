import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";

export function handleJoinChats(socket: Socket) {
  socket.on(SocketEvents.JoinChats, ({ chats }) => {
    console.log("Joining chats: ", chats);
    chats.forEach((chat: string) => {
      socket.join(chat);
    });
  });
}
