import { io } from "..";
import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";
import { ChatRoomService } from "../modules/chatRoom";

export async function handleCreateChat(socket: Socket) {
  socket.on(SocketEvents.CreateChat, async ({ user_target, user }) => {
    socket.join(user_target);
    socket.join(user);

    const newChat = await ChatRoomService.createChatRoom([user_target, user]);

    io.to(user_target).emit(SocketEvents.ReceiveJoinNewChat, {
      user,
      room: newChat,
    });
  });
}
