import { Schema, Document, model, Types } from "mongoose";

interface ICategory extends Document {
  name: string;
  description?: string;
  categoryImg?: string;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  categoryImg: {
    type: String,
  },
});

export default model<ICategory>("Category", categorySchema);
