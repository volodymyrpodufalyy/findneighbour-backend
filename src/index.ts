import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

import sequelize from "./core/dbconfig";
import "./core/db";
import swaggerDocument from "./core/swagger";
import createRoutes from "./core/routes";
import createSocket from "./core/socket";

const app = express();
app.use(cors());
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
const http = createServer(app);
const io = createSocket(http);

createRoutes(app, io);

const options = {
  definition: swaggerDocument,
  apis: ["./src/core/*.ts", "./src/swagger/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    http.listen(process.env.PORT, () => {
      console.log(
        `Example app listening at http://localhost:${process.env.PORT}`
      );
    });
  } catch (e) {
    console.log(e);
  }
};

start();
