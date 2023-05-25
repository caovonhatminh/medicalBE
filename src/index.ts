import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connect from "./models/connect";

import router from "./routes";
import swaggerUI from "swagger-ui-express";
import docs from "./docs";

export const clientDB = connect();

clientDB
    .connect()
    .then(() => {
        console.log("connected db");
    })
    .catch((error) => {
        console.error("connect db error: ", error);
    });

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use("/assets", express.static("assets"));

app.listen(process.env.PORT);
router(app);

const options = {
    customCss: ".swagger-ui .topbar { display: none }",
};

app.use("/docs", swaggerUI.serve, swaggerUI.setup(docs, options));
