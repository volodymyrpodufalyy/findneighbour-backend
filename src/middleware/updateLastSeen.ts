import express from "express";
import { User } from "../models/SUser";

export default async (
  req: any,
  __: express.Response,
  next: express.NextFunction
) => {
  if (req.user) {
    const user = await User.findByPk(Number(req.user.id));
    if (user) {
      user.last_seen = new Date().toISOString();
      user.save();
    }
  }
  next();
};
