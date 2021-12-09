import sequelize from "./../core/dbconfig";
import { User } from "./../models/SUser";
import express from "express";
import bcrypt from "bcrypt";
import socket from "socket.io";
import { Op, UniqueConstraintError } from "sequelize";
import { validationResult } from "express-validator";
import { SentMessageInfo } from "nodemailer/lib/sendmail-transport";

import { createJWToken } from "../utils";
import transporter from "../core/mailer";

class UserController {
  io: socket.Server;

  constructor(io: socket.Server) {
    this.io = io;
  }

  userRepository = sequelize.getRepository(User);

  show = async (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;
    const user = await User.findByPk(id);
    return res.json(user);
  };

  getMe = async (req: express.Request, res: express.Response) => {
    const id = (req.user as User).id;
    const user = await User.findByPk(Number(id), { include: { all: true } });

    if (!user) {
      return res.status(404).json({
        message: "Sorry, User not found",
      });
    }
    return res.json(user);
  };

  findUsers = async (req: any, res: express.Response) => {
    const query: string = req.query.query;
    try {
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { fullname: { [Op.iRegexp]: query } },
            { email: { [Op.iRegexp]: query } },
          ],
        },
        include: { all: true },
      });
      return res.json(users);
    } catch (error) {
      return res.status(404).json({
        status: "error",
        message: error,
      });
    }
  };

  delete = (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;
    User.destroy({ where: { id: id } })
      .then((user) => {
        if (user) {
          res.json({
            message: `User deleted`,
          });
        }
      })
      .catch(() => {
        res.json({
          message: `User not found`,
        });
      });
  };

  create = (req: express.Request, res: express.Response): void => {
    const postData: { email: string; fullname: string; password: string } = {
      email: req.body.email,
      fullname: req.body.fullname,
      password: req.body.password,
    };

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      this.userRepository
        .create(postData)
        .then((obj) => {
          const token = createJWToken(obj);
          res.json({
            obj,
            token,
          });
          transporter.sendMail(
            {
              from: process.env.GMAIL_USER,
              to: postData.email,
              subject: "Findneighbour account verification",
              html: `To verify your account go to <a href="http://localhost:80/signup/verify?hash=${obj.confirm_hash}">by this link</a>`,
            },
            function (err: Error | null, info: SentMessageInfo) {
              if (err) {
                console.log(err);
              } else {
                console.log(info);
              }
            }
          );
        })
        .catch((err) => {
          if (err instanceof UniqueConstraintError) {
            res.status(500).json({
              status: "error",
              message: "Such user already exists",
            });
          } else {
            res.status(500).json({
              status: "error",
              message: err,
            });
          }
        });
    }
  };

  addAvatar = async (req: express.Request, res: express.Response) => {
    const userId = (req.user as User).id;

    const file: string = req.body.link;
    try {
      await User.update({ avatar: file }, { where: { id: Number(userId) } });
      res.json({
        status: "success",
        message: "Avatar added!",
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err,
      });
    }
  };

  verify = async (req: express.Request, res: express.Response) => {
    const hash = req.query.hash;

    if (!hash) {
      return res.status(422).json({ errors: "Invalid hash" });
    }

    try {
      const user = await User.findOne({ where: { confirm_hash: hash } });
      if (user) {
        user.confirmed = true;
        user.save();
        res.json({
          status: "success",
          message: "Аккаунт успішно підтверджено!",
        });
      } else {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }
    } catch (error) {
      return res.status(404).json({
        status: "error",
        message: "Hash not found",
      });
    }
  };

  login = async (req: express.Request, res: express.Response) => {
    const postData = {
      email: req.body.email,
      password: req.body.password,
    };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ where: { email: postData.email } });
      if (user) {
        if (bcrypt.compareSync(postData.password, user.password)) {
          const token = createJWToken(user);
          res.json({
            status: "success",
            token,
          });
        } else {
          res.status(403).json({
            status: "error",
            message: "Incorrect password or email",
          });
        }
      } else {
        return res.status(404).json({
          message: "User not found",
        });
      }
    } catch (error) {
      return res.status(404).json({
        message: error,
      });
    }
  };
}

export default UserController;
