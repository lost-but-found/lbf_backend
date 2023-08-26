import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";
import { ChatRoomService } from "../modules/chatRoom";

export async function handleJoinChats(socket: Socket) {
  // socket.on(SocketEvents.JoinChats, ({ chats }) => {
  //   console.log("Joining chats: ", chats);
  //   chats.forEach((chat: string) => {
  //     socket.join(chat);
  //   });
  // });

  const userChats = await ChatRoomService.getChatRoomsByUserId(
    socket.data.user._id
  );
  userChats.forEach((chat) => {
    socket.join(chat._id);
  });
}
