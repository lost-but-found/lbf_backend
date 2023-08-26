import { ChatRoomModel, IChatRoom } from "./chatRoom.model";
import { IUser } from "../user";
import { ObjectId } from "mongoose";

class ChatRoomService {
  async createChatRoom(users: IUser[]): Promise<IChatRoom> {
    try {
      const newChatRoom = await ChatRoomModel.create({ users });
      return newChatRoom;
    } catch (error) {
      throw new Error("Failed to create chat room.");
    }
  }

  async getChatRoomById(chatRoomId: string): Promise<IChatRoom | null> {
    try {
      const chatRoom = await ChatRoomModel.findById(chatRoomId);
      return chatRoom;
    } catch (error) {
      throw new Error("Failed to fetch chat room.");
    }
  }

  async getChatRoomByUsers(users: string[]): Promise<IChatRoom | null> {
    try {
      const chatRoom = await ChatRoomModel.findOne({
        users: { $all: users },
      });
      return chatRoom;
    } catch (error) {
      throw new Error("Failed to fetch chat room.");
    }
  }

  async getChatRoomsByUserId(userId: string): Promise<IChatRoom[]> {
    try {
      const chatRooms = await ChatRoomModel.find({ users: userId });
      return chatRooms;
    } catch (error) {
      throw new Error("Failed to fetch chat rooms.");
    }
  }

  async joinChatRoom(chatRoomId: string, userId: string): Promise<void> {
    try {
      const chatRoom = await ChatRoomModel.findById(chatRoomId);
      if (!chatRoom) {
        throw new Error("Chat room not found.");
      }

      if (chatRoom.users.includes(userId)) {
        throw new Error("User already joined the chat room.");
      }

      chatRoom.users.push(userId);
      await chatRoom.save();
    } catch (error) {
      throw new Error("Failed to join chat room.");
    }
  }

  async deleteChatRoom(chatRoomId: string): Promise<void> {
    try {
      const chatRoom = await ChatRoomModel.findByIdAndDelete(chatRoomId);
      if (!chatRoom) {
        throw new Error("Chat room not found.");
      }
    } catch (error) {
      throw new Error("Failed to delete chat room.");
    }
  }
}

export default new ChatRoomService();
