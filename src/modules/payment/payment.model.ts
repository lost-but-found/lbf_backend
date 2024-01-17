import { Schema, Document, model, Types } from "mongoose";
import { PaymentStatus } from "./payment.type";

// export type PaymentIntentType = Stripe.Response<Stripe.PaymentIntent>;

export interface IPayment extends Document {
  user: string | Types.ObjectId;
  item: string | Types.ObjectId;
  email: string;
  paymentUrl: string;
  amount?: number;
  status: PaymentStatus;
  createdAt?: Date;
}

const paymentSchema = new Schema<IPayment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  item: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  paymentUrl: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PROCESSING,
  },
});

// Ensure the virtual field is included when converting to JSON
paymentSchema.set("toJSON", { virtuals: true });

export default model<IPayment>("Payment", paymentSchema);
