import { io } from "../";
import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";
import { ChatRoomService } from "../modules/chatRoom";

export async function handleJoinNewChat(socket: Socket) {
  socket.on(
    SocketEvents.JoinNewChat,
    async ({ user_target, user, check, room_id }) => {
      socket.join(user_target);

      if (!check) {
        //   const updatedRoom = await Room.findById(room_id).populate(['users', "messages"]);
        //   const user_data = await User.findById(user);

        // const formattedRoom = {
        //   _id: updatedRoom._id,
        //   messages: updatedRoom.messages,
        //   user: [user_data],
        //   unreadMessages: 0,
        // };

        const formattedRoom = ChatRoomService.joinChatRoom(room_id, user);

        io.to(user_target).emit(SocketEvents.ReceiveJoinNewChat, {
          user,
          room: formattedRoom,
        });
      }
    }
  );
}
