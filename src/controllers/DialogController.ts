import express from "express";
import socket from "socket.io";
import sequelize from "../core/dbconfig";

import { DialogModel, MessageModel } from "../models";
import { IDialog } from "../models/Dialog";
import { User } from "../models/SUser";

class DialogController {
  io: socket.Server;
  userRepository = sequelize.getRepository(User);

  constructor(io: socket.Server) {
    this.io = io;
  }

  index = async (req: express.Request, res: express.Response) => {
    const user = req.user as User;

    try {
      DialogModel.find()
        .or([
          { "author.id": Number(user.id) },
          { "partner.id": Number(user.id) },
        ])
        .populate({
          path: "lastMessage",
        })
        .exec(function (err, dialogs) {
          if (err || !dialogs.length) {
            return res.status(404).json({
              message: "Dialogs not found",
            });
          }
          return res.json(dialogs);
        });
    } catch (error) {
      return res.status(404).json({
        message: error,
      });
    }
  };

  create = async (req: any, res: express.Response) => {
    const postData = {
      author: req.user,
      partner: req.body.partner,
    };

    let dialog = {};

    const partner = await User.findByPk(Number(postData.partner));

    if (partner) {
      dialog = new DialogModel({
        author: {
          id: postData.author.id,
          fullname: postData.author.fullname,
        },
        partner: {
          id: partner.id,
          fullname: partner.fullname,
        },
      });
    }

    (dialog as IDialog)
      .save()
      .then((dialogObj: any) => {
        const message = new MessageModel({
          text: req.body.text,
          user: {
            id: req.user.id,
            fullname: req.user.fullname,
          },
          dialog: dialogObj._id,
        });

        message
          .save()
          .then(() => {
            dialogObj.lastMessage = message._id;
            dialogObj.save().then(() => {
              res.json(dialogObj);
              this.io.emit("SERVER:DIALOG_CREATED", {
                ...postData,
                dialog: dialogObj,
              });
            });
          })
          .catch((reason) => {
            res.json(reason);
          });
      })
      .catch((reason) => {
        res.json(reason);
      });
  };

  delete = (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;
    DialogModel.findOneAndRemove({ _id: id })
      .then((dialog) => {
        if (dialog) {
          res.json({
            message: `Dialog deleted`,
          });
        }
      })
      .catch(() => {
        res.json({
          message: `Dialog not found`,
        });
      });
  };
}

export default DialogController;
