import { io } from "../";
import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";
import { ChatMessageService } from "../modules/chatMessage";

export function handleSendMessage(socket: Socket) {
  socket.on(
    SocketEvents.SendMessage,
    async ({ content, chatRoom, sender, replyTo, type }) => {
      await ChatMessageService.createChatMessage(
        content,
        socket.data.user._id,
        chatRoom,
        type
        // replyTo
      );
      io.to(chatRoom).emit(SocketEvents.ReceiveMessage, {
        content,
        sender: socket.data.user._id,
        chatRoom,
        type,
      });
    }
  );
}
