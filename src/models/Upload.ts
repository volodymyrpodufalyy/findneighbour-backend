import mongoose, { Schema, Document } from "mongoose";

export interface IUpload extends Document {
  filename: string;
  size: number;
  ext: string;
  url: string;
  message: string;
  user: {
    id: { type: Schema.Types.Number };
    fullname: { type: Schema.Types.String };
  };
}

const UploadSchema = new Schema(
  {
    filename: String,
    size: Number,
    ext: String,
    url: String,
    message: { type: Schema.Types.ObjectId, ref: "Message", require: true },
    user: {
      id: { type: Schema.Types.Number },
      fullname: { type: Schema.Types.String },
    },
  },
  {
    timestamps: true,
  }
);

const UploadModel = mongoose.model<IUpload>("Upload", UploadSchema);

export default UploadModel;
