import { Request, Response } from "express";
import ChatMessageService from "./chatMessage.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

class ChatMessageController {
  createChatMessage = async (req: Request, res: Response) => {
    try {
      const { content, sender, chatRoom, type } = req.body;
      const newChatMessage = await ChatMessageService.createChatMessage(
        content,
        sender,
        chatRoom,
        type
      );

      return sendResponse({
        res,
        status: StatusCodes.CREATED,
        success: true,
        message: "Chat message created.",
        data: newChatMessage,
      });
    } catch (error) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to create chat message.",
      });
    }
  };

  updateChatMessageStatus = async (req: Request, res: Response) => {
    try {
      const { messageId, status } = req.body;
      await ChatMessageService.updateChatMessageStatus(messageId, status);
      return sendResponse({
        res,
        status: StatusCodes.OK,
        success: true,
        message: "Chat message status updated.",
      });
    } catch (error) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to update chat message status.",
      });
    }
  };

  deleteChatMessage = async (req: Request, res: Response) => {
    try {
      const { messageId } = req.params;
      await ChatMessageService.deleteChatMessage(messageId);

      return sendResponse({
        res,
        status: StatusCodes.OK,
        success: true,
        message: "Chat message deleted.",
      });
    } catch (error) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to delete chat message.",
      });
    }
  };

  getChatMessage = async (req: Request, res: Response) => {
    try {
      const { messageId } = req.params;
      const chatMessage = await ChatMessageService.getChatMessage(messageId);
      return sendResponse({
        res,
        status: StatusCodes.OK,
        success: true,
        message: "Chat message fetched.",
        data: chatMessage,
      });
    } catch (error) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to fetch chat message.",
      });
    }
  };

  getChatMessagesInRoom = async (req: Request, res: Response) => {
    try {
      const { roomId } = req.params;
      const { page, limit } = req.query;
      const pageValue = page ? +page : 0;
      const limitValue = limit ? +limit : 10;
      const chatMessages = await ChatMessageService.getChatMessagesInRoom(
        roomId,
        pageValue,
        limitValue
      );

      return sendResponse({
        res,
        status: StatusCodes.OK,
        success: true,
        message: "Chat messages fetched.",
        data: chatMessages,
      });
    } catch (error) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to fetch chat messages.",
      });
    }
  };
}

export default new ChatMessageController();
