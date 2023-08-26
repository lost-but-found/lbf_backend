import { handleIsOnline } from "./socket-events/is-online.event";
import { handleJoinChats } from "./socket-events/join-chats.event";
import { handleJoinNewChat } from "./socket-events/join-new-chat.event";
import { handleRemoveChat } from "./socket-events/remove-chat";
import { handleSendMessage } from "./socket-events/send-message";
import { handleTyping } from "./socket-events/typing.event";
import { handleViewUnreadMessages } from "./socket-events/view-unread.event";
import SocketEventManager from "./utils/socketEventManager";

const socketEvents = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("A new user has been connected: ", socket.id);

    const socketManager = new SocketEventManager(socket);

    socketManager
      .use(handleIsOnline)
      .use(handleJoinChats)
      .use(handleJoinNewChat)
      .use(handleRemoveChat)
      .use(handleSendMessage)
      .use(handleTyping)
      .use(handleViewUnreadMessages);
    // Add more handlers using .use() here

    socketManager.attachHandlers();

    socket.on("disconnect", () => {
      console.log("A user has been disconnected");
    });
  });
};

export default socketEvents;
