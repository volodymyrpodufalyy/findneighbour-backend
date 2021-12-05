import { Sequelize } from "sequelize-typescript";
import { AddInfo } from "../models/SAddInfo";
import { User } from "../models/SUser";
require("dotenv").config();

let sequelize = new Sequelize();

process.env.NODE_ENV !== "development"
  ? (sequelize = new Sequelize(process.env.PROD_DB_URL as string, {
      database: process.env.PROD_DB_DATABASE,
      host: process.env.PROD_DB_HOST,
      username: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASSWORD,
      dialect: "postgres",
      port: 5432,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      models: [User, AddInfo],
    }))
  : (sequelize = new Sequelize({
      database: process.env.DB_NAME,
      dialect: "postgres",
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      storage: ":memory:",
      models: [User, AddInfo],
    }));

export default sequelize;
