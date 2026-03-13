import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment {
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  _id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  caption: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  publicId: string;
  likes: string[]; // user IDs who liked
  comments: IComment[];
  shares: number;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: String,
  userName: String,
  userAvatar: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema<IPost>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "" },
    caption: { type: String, default: "" },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    publicId: { type: String, default: "" },
    likes: [{ type: String }],
    comments: [CommentSchema],
    shares: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.models.Post ?? mongoose.model<IPost>("Post", PostSchema);
export default Post;
