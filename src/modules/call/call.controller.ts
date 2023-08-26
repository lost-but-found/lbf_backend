import { Request, Response } from "express";
import CallService from "./call.service";

class CallController {
  createCall = async (req: Request, res: Response) => {
    try {
      const { caller, receiver, status } = req.body;
      const newCall = await CallService.createCall(caller, receiver, status);
      return res.status(201).json(newCall);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create call." });
    }
  };

  endCall = async (req: Request, res: Response) => {
    try {
      const { callId } = req.params;
      const endedCall = await CallService.endCall(callId);
      return res.status(200).json(endedCall);
    } catch (error) {
      return res.status(500).json({ error: "Failed to end call." });
    }
  };

  getCallById = async (req: Request, res: Response) => {
    try {
      const { callId } = req.params;
      const call = await CallService.getCallById(callId);
      return res.status(200).json(call);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get call." });
    }
  };

  getCallsByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const calls = await CallService.getCallsByUserId(userId);
      return res.status(200).json(calls);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get calls." });
    }
  };

  getCurrentUserCalls = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const calls = await CallService.getCallsByUserId(userId);
      return res.status(200).json(calls);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get calls." });
    }
  };
}

export default new CallController();
