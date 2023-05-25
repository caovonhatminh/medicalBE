import userDoc from "./user.doc";
import base from "./base";
import medicalDoc from "./medical.doc";

const docs = {
    ...base,
    paths: { ...userDoc, ...medicalDoc },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                require: true,
            },
        },
    },
};

export default docs;
