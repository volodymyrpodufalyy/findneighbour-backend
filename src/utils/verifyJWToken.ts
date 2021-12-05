import jwt from "jsonwebtoken";
import { User } from "../models/SUser";

export interface DecodedData {
  data: {
    dataValues: User;
  };
}

export default (token: string): Promise<DecodedData | Object> =>
  new Promise((resolve, reject) => {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || "",
      (err, decodedData) => {
        if (err || !decodedData) {
          return reject(err);
        }

        resolve(decodedData);
      }
    );
  });
