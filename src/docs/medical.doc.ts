const medicalDoc = {
    "/medical/add-medical-record": {
        post: {
            tags: ["Medical"],
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                medicalName: {
                                    type: "string",
                                    default: "bệnh gan",
                                },
                                hospitalName: {
                                    type: "string",
                                    default: "Bệnh viện abc",
                                },
                                startDate: {
                                    type: "string",
                                    default: "20/11/2022",
                                },
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

    "/medical/add-medical-result": {
        post: {
            tags: ["Medical"],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            requestBody: {
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                medicalRecordID: { type: "string" },
                                date: {
                                    type: "string",
                                    default: "20/11/2022",
                                },
                                finalResult: {
                                    type: "string",
                                    default: "bác sĩ bó tay",
                                },
                                medicines: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: {
                                                type: "string",
                                                default: "thuốc giải độc gan",
                                            },
                                            quantity: {
                                                type: "string",
                                                default: "20 viên",
                                            },
                                            dosage: {
                                                type: "object",
                                                properties: {
                                                    isAfter: {
                                                        type: "boolean",
                                                        default: true,
                                                    },
                                                    morning: {
                                                        type: "string",
                                                        default: "1 viên",
                                                    },
                                                    afternoon: {
                                                        type: "string",
                                                    },
                                                    night: {
                                                        type: "string ",
                                                        default: "1 viên",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                medicineImage: {
                                    type: "string",
                                    format: "binary",
                                },
                                appointment: {
                                    type: "string",
                                    default: "1/1/2022",
                                },
                                doctor:{
                                    type: "string",
                                    default: "Nguyen Van A"
                                },
                                phone: {
                                    type: "string",
                                    default: "01234"
                                }
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

    "/medical/add-medical-examination-content": {
        post: {
            tags: ["Medical"],
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                medicalResultID: { type: "string" },
                                name: {
                                    type: "string",
                                    default: "xét nghiệm máu",
                                },
                                result: {
                                    type: "string",
                                    default: "máu bình thường",
                                },
                                image: { type: "string", format: "binary" },
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
    "/medical/get-medical-record": {
        get: {
            tags: ["Medical"],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "_id",
                    type: "string",
                    in: "query",
                    default: "6326ee120aaf686061bb540f",
                },
            ],
            responses: {
                200: {},
            },
        },
    },
    "/medical/get-medical-records": {
        get: {
            tags: ["Medical"],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {},
            },
        },
    },
    "/medical/update": {
        post: {
            tags: ["Medical"],
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                _id: { type: "string" },
                                name: { type: "string" },
                                date: { type: "string" },
                                medicines: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: {
                                                type: "string",
                                            },
                                            fromDate: {
                                                type: "string",
                                            },
                                            toDate: {
                                                type: "string",
                                            },
                                            quantity: {
                                                type: "string",
                                            },
                                            dosage: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                                reExamination: { type: "string" },
                                medicinesImage: {
                                    type: "string",
                                    format: "binary",
                                },
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
    "/medical/search-medical-record": {
        post: {
            tags: ["Medical"],
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                hospitalName: {
                                    type: "string",
                                    default: "abc",
                                },
                                medicalName: { type: "string", default: "cam" },
                                fromDate: {
                                    type: "string",
                                    default: "20/01/2021",
                                },
                                toDate: {
                                    type: "string",
                                    default: "20/01/2022",
                                },
                                fullText: { type: "string", default: "abc" },
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

    "/medical/search-medical-result": {
        post: {
            tags: ["Medical"],
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                medicalRecordID: { type: "string" },
                                fromDate: {
                                    type: "string",
                                    default: "02/01/2022",
                                },
                                toDate: {
                                    type: "string",
                                    default: "22/11/2022",
                                },
                                finalResult: {
                                    type: "string",
                                    default: "bo tay",
                                },
                                resultExam: {
                                    type: "string",
                                    default: "bo chan",
                                },
                                medicineName: {
                                    type: "string",
                                    default: "thuoc ho",
                                },
                                fullText: {
                                    type: "string",
                                    default: "xet nghiem mau",
                                },
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
    "/medical/fake": {
        post: {
            tags: ["Medical"],
            responses: {
                200: {},
            },
        },
    },

    "/medical/get-medical-result": {
        get: {
            tags: ["Medical"],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "medicalRecordID",
                    type: "string",
                    in: "query",
                    default: "63380e28270181d09de8d232",
                },
            ],
            responses: {
                200: {},
            },
        },
    },
};

export default medicalDoc;
