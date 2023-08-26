import {
  ChatMessageModel,
  IChatMessage,
  MessageStatus,
  MessageType,
} from "./chatMessage.model";
import { IUser } from "../user";
import { IChatRoom } from "../chatRoom/chatRoom.model";

class ChatMessageService {
  async createChatMessage(
    content: string,
    sender: IUser,
    chatRoom: IChatRoom,
    type: MessageType
  ): Promise<IChatMessage> {
    try {
      const newChatMessage = await ChatMessageModel.create({
        content,
        sender,
        chatRoom,
        type,
      });
      return newChatMessage;
    } catch (error) {
      throw new Error("Failed to create chat message.");
    }
  }

  async updateChatMessageStatus(
    messageId: string,
    status: MessageStatus
  ): Promise<void> {
    try {
      await ChatMessageModel.findByIdAndUpdate(messageId, { status });
    } catch (error) {
      throw new Error("Failed to update chat message status.");
    }
  }

  async deleteChatMessage(messageId: string): Promise<void> {
    try {
      await ChatMessageModel.findByIdAndUpdate(messageId, { isDeleted: true });
    } catch (error) {
      throw new Error("Failed to delete chat message.");
    }
  }

  async getChatMessage(messageId: string): Promise<IChatMessage> {
    try {
      const chatMessage = await ChatMessageModel.findById(messageId);
      if (!chatMessage) {
        throw new Error("Chat message not found.");
      }
      return chatMessage;
    } catch (error) {
      throw new Error("Failed to retrieve chat message.");
    }
  }

  async getChatMessagesInRoom(
    roomId: string,
    page: number,
    limit: number
  ): Promise<IChatMessage[]> {
    try {
      const chatMessages = await ChatMessageModel.find({ chatRoom: roomId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      return chatMessages;
    } catch (error) {
      throw new Error("Failed to retrieve chat messages in room.");
    }
  }

  async getUnreadChatMessagesInRoom(
    roomId: string,
    userId: string
  ): Promise<IChatMessage[]> {
    try {
      const chatMessages = await ChatMessageModel.find({
        chatRoom: roomId,
        status: MessageStatus.UNREAD,
        sender: { $ne: userId },
      });
      return chatMessages;
    } catch (error) {
      throw new Error("Failed to retrieve unread chat messages in room.");
    }
  }

  async getUnreadChatMessagesCountInRoom(
    roomId: string,
    userId: string
  ): Promise<number> {
    try {
      const count = await ChatMessageModel.countDocuments({
        chatRoom: roomId,
        status: MessageStatus.UNREAD,
        sender: { $ne: userId },
      });
      return count;
    } catch (error) {
      throw new Error("Failed to retrieve unread chat messages count in room.");
    }
  }

  async readUnreadChatMessagesInRoom(
    roomId: string,
    userId: string
  ): Promise<void> {
    try {
      await ChatMessageModel.updateMany(
        {
          chatRoom: roomId,
          status: MessageStatus.UNREAD,
          sender: { $ne: userId },
        },
        { status: MessageStatus.READ }
      );
    } catch (error) {
      throw new Error("Failed to read unread chat messages in room.");
    }
  }
}

export default new ChatMessageService();
