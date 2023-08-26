import { io } from "../";
import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";
import { UserService } from "../modules/user";

export async function handleIsOnline(socket: Socket) {
  socket.on(SocketEvents.IsOnline, async ({ user, status, room }) => {
    if (status) {
      await UserService.updateOnlineStatus(user, true);
    } else {
      await UserService.updateOnlineStatus(user, false);
    }
    io.to(user).emit(SocketEvents.ReceiveIsOnline, { user, status, room });
  });
}
