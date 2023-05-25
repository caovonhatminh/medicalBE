import { Router } from "express";
import userController from "../controllers/user.controller";
import { avatarUpload } from "../config/fileUpload";
import authMiddleware from "../middlewares/auth.middleware";

const userRouter = Router();
userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);

userRouter.post("/logout", userController.logout);
userRouter.get(
    "/get-user-info",
    authMiddleware.exec,
    userController.getUserInfo
);
userRouter.get(
    "/get-users",
    authMiddleware.exec,
    userController.getUsers
);
userRouter.post(
    "/update",
    avatarUpload.single("avatar"),
    authMiddleware.exec,
    userController.updateUser
);
userRouter.post(
    "/update-pass",
    authMiddleware.exec,
    userController.updatePass
);
userRouter.post("/renew-access-token", userController.renewAccessToken);
userRouter.post("/faker", userController.fakeUser);
userRouter.post('/delete', authMiddleware.exec, userController.delete)

export default userRouter;
