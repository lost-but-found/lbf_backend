import express from "express";
import CallController from "./call.controller";
import { isAuth } from "../auth/auth.middleware";

const router = express.Router();

router.post("/", isAuth, CallController.createCall);
router.get("/", isAuth, CallController.getCurrentUserCalls);
router.put("/:callId/end", isAuth, CallController.endCall);
router.get("/:callId", isAuth, CallController.getCallById);
// router.get("/users/:userId", CallController.getCallsByUserId);

export default router;
