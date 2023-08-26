import express from "express";
import ChatMessageController from "./chatMessage.controller";

const chatMessageRouter = express.Router();

chatMessageRouter.post(
  "/chat-messages",
  ChatMessageController.createChatMessage
);
chatMessageRouter.put(
  "/chat-messages/update-status",
  ChatMessageController.updateChatMessageStatus
);
chatMessageRouter.delete(
  "/chat-messages/:messageId",
  ChatMessageController.deleteChatMessage
);

chatMessageRouter.get(
  "/chat-messages/:messageId",
  ChatMessageController.getChatMessage
);
chatMessageRouter.get(
  "/chat-messages/room/:roomId",
  ChatMessageController.getChatMessagesInRoom
);

export default chatMessageRouter;
