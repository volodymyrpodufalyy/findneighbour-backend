import bodyParser from "body-parser";
import express from "express";
import socket from "socket.io";

import {
  DialogCtrl,
  MessageCtrl,
  UserCtrl,
  UploadCtrl,
  AddInfoCtrl,
} from "../controllers";
import { checkAuth, updateLastSeen } from "../middleware";
import { loginValidation, registerValidation } from "../utils/validations";
import multer from "./multer";

const createRoutes = (app: express.Express, io: socket.Server) => {
  const UserController = new UserCtrl(io);
  const DialogController = new DialogCtrl(io);
  const MessageController = new MessageCtrl(io);
  const UploadController = new UploadCtrl();
  const AddInfoController = new AddInfoCtrl();

  app.use(bodyParser.json());
  app.use(checkAuth);
  app.use(updateLastSeen);

  /**
   * @swagger
   * /user/signup:
   *   get:
   *     tags: ["user"]
   *     summary: signup a user
   *     description: Registration for a current user
   *     responses:
   *       200:
   *         description: New user instance and token.
   */
  app.post("/user/signup", registerValidation, UserController.create);

  /**
   * @swagger
   * /user/signin:
   *   get:
   *     tags: ["user"]
   *     summary: signin a user
   *     description: For signin use email, password
   *     responses:
   *       200:
   *         description: Status and token.
   */
  app.post("/user/signin", loginValidation, UserController.login);

  /**
   * @swagger
   * /users/me:
   *   get:
   *     tags: ["user"]
   *     summary: Retrieve a  user's info by token in headers
   *     description: Retrieve a  current user's info
   *     parameters:
   *       - in: headers
   *         name: token
   *         required: true
   *         description: string token of the user to retrieve.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A user's info.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *               type: object
   */

  app.get("/user/me", UserController.getMe);

  /**
   * @swagger
   * /user/verify:
   *   get:
   *     tags: ["user"]
   *     summary: Verify a user's hash
   *     description: Verify a  current user's hash
   *     responses:
   *       200:
   *         description: Verification status.
   */
  app.get("/user/verify", UserController.verify);

  /**
   * @swagger
   * /user/verify:
   *   get:
   *     tags: ["user"]
   *     summary: Find users
   *     description: Finds user by a given query
   *     responses:
   *       200:
   *         description: List of users.
   */
  app.get("/user/find", UserController.findUsers);
  app.get("/user/:id", UserController.show);
  app.delete("/user/:id", UserController.delete);

  app.get("/dialogs", DialogController.index);
  app.delete("/dialogs/:id", DialogController.delete);
  app.post("/dialogs", DialogController.create);

  app.get("/messages", MessageController.index);
  app.post("/messages", MessageController.create);
  app.delete("/messages", MessageController.delete);

  app.post("/files", multer.single("file"), UploadController.create);

  app.post("/user/addinfo", AddInfoController.create);
  app.put("/user/addinfo/:id", AddInfoController.update);
  app.get("/addinfo", AddInfoController.index);
  app.get("/addinfos", AddInfoController.getAll);
  app.get("/addinfos/filterUsers", AddInfoController.filterUsers);
};

export default createRoutes;
