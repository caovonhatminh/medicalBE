import { Response } from "express";
import { UserModel } from "../models/user.model";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { http, BadRequest, CustomRequest } from "../config/http";
import { unlink } from "fs";
import { faker } from "@faker-js/faker";
import moment from "moment";
import { randomUUID } from "crypto";

function getDate(date: string) {
    return moment(date, "DD/MM/YYYY");
}
class UserController {
    @http()
    async register(request: CustomRequest, response: Response) {
        let {username = "", password = "", role = ""} = request.body;
        password = bcrypt.hashSync(password, 10);
        let _id = randomUUID();
        const oldUser = await UserModel.findByUsername(username);
        if (oldUser) {
            throw new BadRequest("user is existed");
        } else {
            await UserModel.insertBase(_id, username, password, role);
            return "success";
        }
    }
    @http()
    async updatePass(request: any, response: Response) {
        let {_id = "", password = "", oldPassword} = request.body;
        const oldUser = await UserModel.findById(_id);
        if (oldUser) {
            if (bcrypt.compareSync(oldPassword, oldUser.password as string)) {
                password = bcrypt.hashSync(password, 10);
                await UserModel.updatePass(_id, password);
                return "success";
            }
           return {code: 400, msg: 'Mật khẩu cũ không đúng'}
        } 
        return {code: 400, msg: 'Tài khoản không tồn tại'}
    }
    @http()
    async login(request: CustomRequest, response: Response) {
        const { username, password } = request.body;
        console.log(username, password);

        const user = await UserModel.findByUsername(username);
        console.log("get user login");

        if (user) {
            if (bcrypt.compareSync(password, user.password as string)) {
                console.log("compare success");
                const access_token = sign(
                    { username: user.username },
                    process.env.ACCESS_TOKEN_SECRET + "",
                    { expiresIn: process.env.ACCESS_TOKEN_LIFE }
                );
                console.log("sign access token");
                const refresh_token = sign(
                    { username: user.username },
                    process.env.REFRESH_TOKEN_SECRET + "",
                    { expiresIn: process.env.REFRESH_TOKEN_LIFE }
                );
                console.log("sign ho token");
                return { user, access_token, refresh_token };
            } else {
                throw new BadRequest("password incorrect");
            }
        } else {
            throw new BadRequest("username or password incorrect");
        }
    }

    @http()
    async logout(request: CustomRequest, response: Response) {
        const [_, token] = request.headers.authorization?.split(" ") as any[];
        return "success";
    }

    @http()
    async getUserInfo(request: CustomRequest, response: Response) {
        return request.user;
    }

    @http()
    async getUsers(request: CustomRequest, response: Response) {
        return UserModel.findAll();
    }

    @http()
    async delete(request: CustomRequest, response: Response) {
        const {_id} = request.body
        return UserModel.delete(_id);
    }
   
    @http()
    async updateUser(request: CustomRequest, response: Response) {
        const data = request.body;

        if (request.file) {
            unlink("assets/avatar/" + request.user?.avatar, () => {});
            data.avatar = request.file?.filename as string;
        } else {
            data.avatar = request.user?.avatar;
        }
        data.birthday = getDate(data.birthday);
        data._id = request.user?._id;
        await UserModel.update(data);
        return "success";
    }

    @http()
    async renewAccessToken(request: CustomRequest, response: Response) {
        const { refresh_token } = request.body;
        const username = (
            verify(
                refresh_token,
                process.env.REFRESH_TOKEN_SECRET as string
            ) as any
        ).username;

        const user = await UserModel.findByUsername(username);

        const access_token = sign(
            { username },
            process.env.ACCESS_TOKEN_SECRET + "",
            { expiresIn: process.env.ACCESS_TOKEN_LIFE }
        );
        const new_refresh_token = sign(
            { username },
            process.env.REFRESH_TOKEN_SECRET + "",
            { expiresIn: process.env.REFRESH_TOKEN_LIFE }
        );
        return {
            access_token,
            refresh_token: new_refresh_token,
        };
    }

    /**
     * TODO: tao du lieu fake user
     * @param request
     * @param response
     */
    @http()
    async fakeUser(request: CustomRequest, response: Response) {
        let { quantity } = request.body;
        while (quantity > 0) {
            const username = faker.internet.userName();
            const oldUser = await UserModel.findByUsername(username);
            if (oldUser) {
                continue;
            }

            const password = bcrypt.hashSync("123", 10);
            const fullName = faker.name.fullName();
            const avatar = faker.image.avatar();
            const phone = faker.phone.number();
            const address = faker.address.country();
            const birthday = faker.date.birthdate();

            const user = {
                id: randomUUID(),
                username,
                password,
                fullName,
                avatar,
                phone,
                address,
                birthday,
            };
            await UserModel.insert(user);
            quantity--;
        }
        return "success";
    }
}

export default new UserController();
