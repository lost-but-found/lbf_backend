import express from "express";
import CallController from "./call.controller";
import { isAuth } from "../auth/auth.middleware";

const router = express.Router();

router.post("/calls", isAuth, CallController.createCall);
router.get("/calls", isAuth, CallController.getCurrentUserCalls);
router.put("/calls/:callId/end", isAuth, CallController.endCall);
router.get("/calls/:callId", isAuth, CallController.getCallById);
// router.get("/calls/users/:userId", CallController.getCallsByUserId);

export default router;
