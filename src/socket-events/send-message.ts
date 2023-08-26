import { io } from "../";
import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";
import { ChatMessageService } from "../modules/chatMessage";

export function handleSendMessage(socket: Socket) {
  socket.on(
    SocketEvents.SendMessage,
    async ({ messageData, room, sender, replyTo, type }) => {
      // const unreadMessages = await Messages.create({
      //   user: messageData.user,
      //   message: messageData,
      //   to: messageData.assignedTo
      // });

      await ChatMessageService.createChatMessage(
        messageData,
        sender,
        room,
        type
      );
      io.to(room).emit(SocketEvents.ReceiveMessage, {
        messageData,
        // unreadMessages
      });
    }
  );
}
