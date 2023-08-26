import { Schema, Document, model, Types } from "mongoose";
import { IUser } from "../user";

interface ICall extends Document {
  caller: Types.ObjectId | IUser;
  receiver: Types.ObjectId | IUser;
  status: CallStatus;
  startedAt: Date;
  endedAt?: Date;
}

enum CallStatus {
  ONGOING = "ongoing",
  MISSED = "missed",
  ENDED = "ended",
}

const callSchema = new Schema<ICall>({
  caller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(CallStatus),
    default: CallStatus.ONGOING,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
});

const CallModel = model<ICall>("Call", callSchema);

export { CallModel, ICall, CallStatus };
