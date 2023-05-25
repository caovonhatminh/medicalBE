import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";

export interface CustomRequest extends Request {
    user?: User;
}

class ErrorRequest extends Error {
    status?: number;
    constructor(message: string) {
        super(message);
        this.message = message;
        this.status = 400;
    }
}

export class BadRequest extends ErrorRequest {
    constructor(message: string) {
        super(message);
        this.status = 400;
    }
}

export class Forbidden extends ErrorRequest {
    constructor(message: string) {
        super(message);
        this.status = 403;
    }
}

interface Options {
    is_middleware: boolean;
}

export const http = (options?: Options) => {
    return (target: any, name: any, descriptor: any) => {
        const fn = descriptor.value;
        descriptor.value = async function (
            request: CustomRequest,
            response: Response,
            next: NextFunction
        ) {
            const res = {
                data: "",
                msg: "",
            };
            try {
                if (options?.is_middleware) {
                    return fn.apply(this, [request, response, next]);
                }
                const data = await fn.apply(this, [request, response, next]);
                res.data = data;
                return response.status(200).json(res);
            } catch (error: any) {
                res.msg = error.message;
                if (!error.status) {
                    error.status = 400;
                }
                return response.status(error.status).json(res);
            }
        };
        return descriptor;
    };
};
