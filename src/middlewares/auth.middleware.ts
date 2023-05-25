import { http, CustomRequest, Forbidden } from "../config/http";
import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { User, UserModel } from "../models/user.model";
class AuthMiddleware {
    async exec(request: CustomRequest, response: Response, next: NextFunction) {
        const split = request.headers.authorization?.split(" ") as any;

        if ((split?.length as number) < 2) {
            return response.status(403).json("token incorrect");
        }
        if (split[1] === "null") {
            return response.status(403).json("token incorrect");
        }
        const token = (split as any)[1];
        if (token) {
            try {
                const data = (
                    verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any
                ).username;
                if (data) {
                    const userData = await UserModel.findByUsername(data);
                    if (!userData) {
                        return response.status(403).json("token incorrect");
                    } else {
                        request.user = userData as User;
                        return next();
                    }
                }
                return response.status(403).json("token incorrect");
            } catch (error) {
                return response.status(403).json("token expired");                
            }
        } else {
            return response.status(403).json("token incorrect");
        }
    }
}

export default new AuthMiddleware();
