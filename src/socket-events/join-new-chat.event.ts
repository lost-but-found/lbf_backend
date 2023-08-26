import { io } from "../";
import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";
import { ChatRoomService } from "../modules/chatRoom";

export async function handleJoinNewChat(socket: Socket) {
  socket.on(
    SocketEvents.JoinNewChat,
    async ({ user_target, user, check, room_id }) => {
      socket.join(room_id);

      const formattedRoom = ChatRoomService.joinChatRoom(
        room_id,
        socket.data.user._id
      );

      io.to(user_target).emit(SocketEvents.ReceiveJoinNewChat, {
        user: socket.data.user._id,
        room: formattedRoom,
      });
    }
  );
}
