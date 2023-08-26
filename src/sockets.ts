import { handleIsOnline } from "./socket-events/is-online.event";
import { handleJoinChats } from "./socket-events/join-chats.event";
import { handleJoinNewChat } from "./socket-events/join-new-chat.event";
import { handleRemoveChat } from "./socket-events/remove-chat";
import { handleSendMessage } from "./socket-events/send-message";
import { handleTyping } from "./socket-events/typing.event";
import { handleViewUnreadMessages } from "./socket-events/view-unread.event";
import SocketEventManager from "./socket-events/socketEventManager";
import { UserService } from "./modules/user";
import { Socket } from "socket.io";
import AuthService from "./modules/auth/auth.service";

const socketEvents = (io: any) => {
  io.use(async (socket: Socket, next: (err?: any) => void) => {
    const token =
      socket.handshake.headers?.access_token || socket.handshake?.auth?.token;
    if (!token) {
      return next(new Error("invalid token"));
    }

    if (!token || !token.startsWith("Bearer ")) {
      return next(new Error("Access token required"));
    }

    const decoded = await AuthService.verifyAuthToken(token.split(" ")[1]);

    if (!decoded) {
      return next(new Error("Invalid access token"));
    }

    socket.data.user = decoded.user;
    next();
  });

  io.on("connection", (socket: any) => {
    console.log("A new user has been connected: ", socket.id, socket.data);

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

    io.emit("user-connected", socket.user._id);
    io.emit("events-list", socketManager.getEventsList);

    socket.on("disconnecting", () => {
      console.log(socket.rooms); // the Set contains at least the socket ID

      UserService.updateOnlineStatus(socket.id, false);
    });

    socket.on("disconnect", () => {
      console.log("A user has been disconnected");
    });
  });
};

export default socketEvents;
