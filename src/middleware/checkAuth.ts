import express from "express";
import { User } from "../models/SUser";
import { verifyJWToken } from "../utils";
import { DecodedData } from "../utils/verifyJWToken";

const swaggerRegExp = new RegExp("/api-docs(.*)");

export interface ExtendedRequest extends express.Request {
  user: User;
}

export function isDecodedData(object: unknown): object is DecodedData {
  return Object.prototype.hasOwnProperty.call(object, "data");
}

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (
    req.path === "/" ||
    req.path === "/user/signin" ||
    req.path === "/user/signup" ||
    req.path === "/user/verify" ||
    swaggerRegExp.test(req.path)
  ) {
    return next();
  }

  const token = req.headers.token as string;

  verifyJWToken(token)
    .then((user: DecodedData | Object) => {
      isDecodedData(user) && (req.user = user.data.dataValues);
      next();
    })
    .catch((err) => {
      res.status(403).json({ message: "Invalid auth token provided." });
    });
};
