import { Sequelize } from "sequelize-typescript";
import { AddInfo } from "../models/SAddInfo";
import { User } from "../models/SUser";
require("dotenv").config();

const devConfig = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const isProductionMode = process.env.NODE_ENV !== "development";

const sequelize = new Sequelize(
  (isProductionMode ? process.env.PROD_DB_URL : devConfig) as string,
  {
    database: isProductionMode
      ? process.env.PROD_DB_DATABASE
      : process.env.DB_NAME,
    host: isProductionMode ? process.env.PROD_DB_HOST : process.env.DB_HOST,
    username: isProductionMode ? process.env.PROD_DB_USER : process.env.DB_USER,
    password: isProductionMode
      ? process.env.PROD_DB_PASSWORD
      : process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: isProductionMode
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
    models: [User, AddInfo],
  }
);

export default sequelize;
