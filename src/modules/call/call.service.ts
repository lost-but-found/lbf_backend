import { CallModel, CallStatus, ICall } from "./call.model";
import { IUser } from "../user";

class CallService {
  async createCall(
    caller: IUser,
    receiver: IUser,
    status?: CallStatus
  ): Promise<ICall> {
    try {
      const newCall = await CallModel.create({ caller, receiver });
      return newCall;
    } catch (error) {
      throw new Error("Failed to create call.");
    }
  }

  async endCall(callId: string): Promise<ICall | null> {
    try {
      const endedCall = await CallModel.findByIdAndUpdate(
        callId,
        { status: CallStatus.ENDED, endedAt: new Date() },
        { new: true }
      );
      return endedCall;
    } catch (error) {
      throw new Error("Failed to end call.");
    }
  }

  async getCallById(callId: string): Promise<ICall | null> {
    try {
      const call = await CallModel.findById(callId);
      return call;
    } catch (error) {
      throw new Error("Failed to get call.");
    }
  }

  async getCallsByUserId(userId: string): Promise<ICall[] | null> {
    try {
      const calls = await CallModel.find({
        $or: [{ caller: userId }, { receiver: userId }],
      });
      return calls;
    } catch (error) {
      throw new Error("Failed to get calls.");
    }
  }
}

export default new CallService();
