import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  text: {
    type: string;
    require: boolean;
  };
  dialog: {
    type: Schema.Types.ObjectId;
    ref: string;
    require: true;
  };
  readed: {
    type: boolean;
    default: boolean;
  };
}

const MessageSchema = new Schema(
  {
    text: { type: String, require: Boolean },
    dialog: { type: Schema.Types.ObjectId, ref: "Dialog", require: true },
    user: {
      id: { type: Schema.Types.Number },
      fullname: { type: Schema.Types.String },
    },
    readed: {
      type: Boolean,
      default: false,
    },
    attachments: [{ type: Schema.Types.ObjectId, ref: "Upload" }],
  },
  {
    timestamps: true,
    usePushEach: true,
  }
);

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
