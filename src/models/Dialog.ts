import mongoose, { Schema, Document } from "mongoose";

export interface IDialog extends Document {
  partner: {
    type: Object;
    require: true;
  };
  author: {
    type: Object;
    require: true;
  };
  messages: [
    {
      type: Schema.Types.ObjectId;
      ref: string;
    }
  ];
}

const DialogSchema = new Schema(
  {
    partner: {
      id: { type: Schema.Types.Number },
      fullname: { type: Schema.Types.String },
    },
    author: {
      id: { type: Schema.Types.Number },
      fullname: { type: Schema.Types.String },
    },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  {
    timestamps: true,
  }
);

const DialogModel = mongoose.model<IDialog>("Dialog", DialogSchema);

export default DialogModel;
