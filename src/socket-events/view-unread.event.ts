import { io } from "../";
import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";
import { ChatMessageService } from "../modules/chatMessage";

export async function handleViewUnreadMessages(socket: Socket) {
  socket.on(SocketEvents.ViewUnreadMessages, async ({ user, room }) => {
    await ChatMessageService.readUnreadChatMessagesInRoom(room, user);
    io.to(user).emit(SocketEvents.ReceiveViewUnreadMessages, { room, user });
  });
}
