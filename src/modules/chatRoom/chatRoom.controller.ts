import { Request, Response } from "express";
import ChatRoomService from "./chatRoom.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

class ChatRoomController {
  createChatRoom = async (req: Request, res: Response) => {
    try {
      const { users } = req.body;
      const newChatRoom = await ChatRoomService.createChatRoom(users);
      return sendResponse({
        res,
        status: StatusCodes.CREATED,
        success: true,
        message: "Chat room created.",
        data: newChatRoom,
      });
    } catch (error) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to create chat room.",
      });
    }
  };

  deleteChatRoom = async (req: Request, res: Response) => {
    try {
      const { chatRoomId } = req.params;
      await ChatRoomService.deleteChatRoom(chatRoomId);
      return sendResponse({
        res,
        status: StatusCodes.OK,
        success: true,
        message: "Chat room deleted.",
      });
    } catch (error) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to delete chat room.",
      });
    }
  };

  getChatRoomById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const chatRoom = await ChatRoomService.getChatRoomById(id);
      return sendResponse({
        res,
        status: StatusCodes.OK,
        success: true,
        message: "Chat room fetched.",
        data: chatRoom,
      });
    } catch (error) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to fetch chat room.",
      });
    }
  };

  getChatRoomByUsers = async (req: Request, res: Response) => {
    try {
      // Get users from query params
      const { users } = req.query;
      // Convert users to array
      const usersArray = users?.toString().split(",") || [];
      const chatRoom = await ChatRoomService.getChatRoomByUsers(usersArray);
      return sendResponse({
        res,
        status: StatusCodes.OK,
        success: true,
        message: "Chat room fetched.",
        data: chatRoom,
      });
    } catch (error) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to fetch chat room.",
      });
    }
  };

  getUserChatRooms = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const chatRooms = await ChatRoomService.getChatRoomsByUserId(userId);
      return sendResponse({
        res,
        status: StatusCodes.OK,
        success: true,
        message: "Chat rooms fetched.",
        data: chatRooms,
      });
    } catch (error) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to fetch chat rooms.",
      });
    }
  };

  joinChatRoom = async (req: Request, res: Response) => {
    try {
      const { chatRoomId } = req.params;
      const userId = req.userId;
      await ChatRoomService.joinChatRoom(chatRoomId, userId);
      return sendResponse({
        res,
        status: StatusCodes.OK,
        success: true,
        message: "Joined chat room.",
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to join chat room.",
        error: error,
      });
    }
  };
}

export default new ChatRoomController();
