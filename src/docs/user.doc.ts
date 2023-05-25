const userDoc = {
    "/user/register": {
        post: {
            tags: ["User"],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                password: { type: "string" },
                            },
                        },
                    },
                },
            },

            responses: {
                200: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        default: "success",
                                    },
                                    msg: {
                                        type: "string",
                                        default: "",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    "/user/login": {
        post: {
            tags: ["User"],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                username: { type: "string", default: "admin" },
                                password: { type: "string", default: "123" },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    content: {
                        "application/json": {
                            schema: {
                                properties: {
                                    data: {
                                        type: "object",
                                        properties: {
                                            user: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    username: {
                                                        type: "string",
                                                    },
                                                    password: {
                                                        type: "string",
                                                    },
                                                    avatar: { type: "string" },
                                                    fullName: {
                                                        type: "string",
                                                    },
                                                    phone: { type: "string" },
                                                    birthday: {
                                                        type: "string",
                                                    },
                                                    address: { type: "string" },
                                                },
                                            },
                                            access_token: { type: "string" },
                                            refresh_token: { type: "string" },
                                        },
                                    },
                                    msg: { type: "string", default: "" },
                                },
                            },
                        },
                    },
                },
                400: {
                    content: {
                        "application/json": {
                            schema: {
                                properties: {
                                    data: { type: "string", default: "" },
                                    msg: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    "/user/logout": {
        post: {
            tags: ["User"],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {},
            },
        },
    },

    "/user/get-user-info": {
        get: {
            tags: ["User"],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    content: {
                        "application/jpon": {
                            schema: {
                                properties: {
                                    data: {
                                        type: "object",
                                        properties: {
                                            _id: { type: "string" },
                                            username: { type: "string" },
                                            password: { type: "string" },
                                            fullName: { type: "string" },
                                            avatar: { type: "string" },
                                            phone: { type: "string" },
                                            address: { type: "string" },
                                            birthday: { type: "string" },
                                        },
                                    },
                                    msg: { type: "string" },
                                },
                            },
                        },
                    },
                },
                400: {},
            },
        },
    },
    "/user/faker": {
        post: {
            tags: ["User"],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                quantity: { type: "integer", default: 1000 },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {},
            },
        },
    },
};
export default userDoc;
