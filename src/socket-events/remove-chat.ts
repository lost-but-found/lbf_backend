import { io } from "../";
import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";

export function handleRemoveChat(socket: Socket) {
  socket.on(SocketEvents.RemoveChat, ({ user_target, user, room, check }) => {
    if (!check) {
      io.to(user_target).emit(SocketEvents.ReceiveRemoveChat, { user, room });
      socket.leave(user_target);
    } else {
      socket.leave(user_target);
    }
  });
}
