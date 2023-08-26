import { io } from "..";
import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";
import { ChatRoomService } from "../modules/chatRoom";

export async function handleCreateChat(socket: Socket) {
  socket.on(SocketEvents.CreateChat, async ({ user_target, user }) => {
    const newChat = await ChatRoomService.createChatRoom([user_target, user]);
    socket.join(newChat._id);

    // io.to(newChat._id).emit(SocketEvents.CreateChat, newChat);
    io.emit(SocketEvents.ReceiveCreateChat, {
      user,
      room: newChat,
    });
  });
}
