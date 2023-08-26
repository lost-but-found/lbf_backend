import express from "express";
import ChatRoomController from "./chatRoom.controller";
import { isAuth } from "../auth/auth.middleware";

const router = express.Router();

router.post("/", ChatRoomController.createChatRoom);
router.delete("/:chatRoomId", ChatRoomController.deleteChatRoom);
router.get("/", isAuth, ChatRoomController.getUserChatRooms);
router.get("/users/", ChatRoomController.getChatRoomByUsers);
router.get("/:id", ChatRoomController.getChatRoomById);

export default router;
