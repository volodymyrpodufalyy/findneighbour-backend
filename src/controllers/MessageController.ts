import express from "express";
import socket from "socket.io";

import { MessageModel, DialogModel } from "../models";
import { IMessage } from "../models/Message";

class MessageController {
  io: socket.Server;

  constructor(io: socket.Server) {
    this.io = io;
  }

  index = (req: any, res: express.Response) => {
    const dialogId: string = req.query.dialog;
    const userId = req.user.id;

    MessageModel.updateMany(
      { dialog: dialogId, "user.id": { $ne: Number(userId) } },
      { $set: { readed: true } },
      (err: any) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status: "error",
            message: err,
          });
        }
      }
    );

    MessageModel.find({ dialog: dialogId })
      .populate(["dialog", "attachments"])
      .exec(function (err, messages) {
        if (err) {
          return res.status(404).json({
            status: "error",
            message: "Messages not found",
          });
        }
        return res.json(messages);
      });
  };

  create = (req: any, res: express.Response): void => {
    const user = req.user;

    const postData = {
      text: req.body.text,
      dialog: req.body.dialog_id,
      attachments: req.body.attachments,
      user: { id: user.id, fullname: user.fullname },
    };

    const message = new MessageModel(postData);

    message
      .save()
      .then((obj: IMessage) => {
        obj.populate("dialog attachments", (err: any, message: IMessage) => {
          if (err) {
            return res.status(500).json({
              status: "error",
              message: err,
            });
          }

          DialogModel.findOneAndUpdate(
            { _id: postData.dialog },
            { lastMessage: message._id },
            { upsert: true },
            function (err) {
              if (err) {
                return res.status(500).json({
                  status: "error",
                  message: err,
                });
              }
            }
          );

          res.json(message);

          this.io.emit("SERVER:NEW_MESSAGE", message);
        });
      })
      .catch((reason) => {
        res.json(reason);
      });
  };

  delete = (req: any, res: express.Response) => {
    const id: string = req.query.id;
    const userId: string = req.user.id;

    MessageModel.findById(id, (err, message: any) => {
      if (err || !message) {
        return res.status(404).json({
          status: "error",
          message: "Message not found",
        });
      }

      if (message.user.toString() === userId) {
        const dialogId = message.dialog;
        message.remove();

        MessageModel.findOne(
          { dialog: dialogId },
          {},
          { sort: { created_at: -1 } },
          (err, lastMessage) => {
            if (err) {
              res.status(500).json({
                status: "error",
                message: err,
              });
            }

            DialogModel.findById(dialogId, (err, dialog: any) => {
              if (err) {
                res.status(500).json({
                  status: "error",
                  message: err,
                });
              }

              dialog.lastMessage = lastMessage;
              dialog.save();
            });
          }
        );

        return res.json({
          status: "success",
          message: "Message deleted",
        });
      } else {
        return res.status(403).json({
          status: "error",
          message: "Not have permission",
        });
      }
    });
  };
}

export default MessageController;
