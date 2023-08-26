import { io } from "../";
import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";
import { UserService } from "../modules/user";
import { ChatRoomService } from "../modules/chatRoom";

export async function handleIsOnline(socket: Socket) {
  socket.on(SocketEvents.IsOnline, async ({ user, status, room }) => {
    if (status) {
      await UserService.updateOnlineStatus(socket.data.user._id, true);
    } else {
      await UserService.updateOnlineStatus(socket.data.user._id, false);
    }
    // io.to(user).emit(SocketEvents.ReceiveIsOnline, { user, status, room });
    // To send to all user rooms
    const userRooms = await ChatRoomService.getChatRoomsByUserId(
      socket.data.user._id
    );
    userRooms.forEach((room) => {
      io.to(room._id).emit(SocketEvents.ReceiveIsOnline, {
        user,
        status,
        room,
      });
    });
  });
}
