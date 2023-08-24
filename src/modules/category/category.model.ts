import { Schema, Document, model, Types } from "mongoose";

interface ICategory extends Document {
  name: string;
  description?: string;
  image?: string;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

export default model<ICategory>("Category", categorySchema);
