import { Express } from "express";
import userRouter from "./user.router";
import medicalRoute from "./medical.route";

const router = (app: Express) => {
    app.use("/user", userRouter);
    app.use("/medical", medicalRoute);
};

export default router;
