import mongoose, { Schema, Document } from 'mongoose';

export interface IUpload extends Document {
  filename: string;
  size: number;
  ext: string;
  url: string;
  message: string;
  user: string;
}

const UploadSchema = new Schema(
  {
    filename: String,
    size: Number,
    ext: String,
    url: String,
    message: { type: Schema.Types.ObjectId, ref: "Message" , require: true },
    user: { type: Schema.Types.ObjectId, ref: "User", require: true }
  },
  {
    timestamps: true,
  }
);

const UploadModel = mongoose.model<IUpload>('Upload', UploadSchema);

export default UploadModel;