import { Types } from "mongoose";
import { CommentModel } from "./itemComment.model";

class ItemCommentService {
  async getPaginatedComments(itemId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const comments = await CommentModel.find({ item: itemId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("user");
    const totalComments = await CommentModel.countDocuments({ item: itemId });
    return { comments, total: totalComments, page, limit };
  }

  async createComment(itemId: string, userId: string, text: string) {
    try {
      const comment = new CommentModel({
        item: itemId,
        user: userId,
        text,
      });

      await comment.save();

      return comment;
    } catch (error) {
      throw new Error("Failed to create comment.");
    }
  }

  async deleteComment(commentId: string, userId: string) {
    try {
      const deletedComment = await CommentModel.findOneAndDelete({
        _id: commentId,
        user: userId,
        // user: new Types.ObjectId(userId),
      });

      console.log({ deletedComment });

      // if (!deletedComment) {
      //   throw new Error("Comment not found.");
      // }

      return {
        message: "Comment deleted successfully.",
      };
    } catch (error) {
      throw new Error("Failed to delete comment.");
    }
  }
}

export default new ItemCommentService();
