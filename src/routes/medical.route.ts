import { Router } from "express";
import medicalController from "../controllers/medical.controller";
import { medicalUpload } from "../config/fileUpload";
import authMiddleware from "../middlewares/auth.middleware";

const medicalRoute = Router();
medicalRoute.post(
    "/add-medical-record",
    authMiddleware.exec,
    medicalController.addMedicalRecord
);

medicalRoute.post(
    "/add-medical-result",
    medicalUpload.single("medicineImage"),
    authMiddleware.exec,
    medicalController.addMedicalResult
);

medicalRoute.post(
    "/add-medical-examination-content",
    medicalUpload.single("image"),
    authMiddleware.exec,
    medicalController.addMedicalExaminationContent
);

medicalRoute.get(
    "/get-medical-record",
    authMiddleware.exec,
    medicalController.getMedicalRecord
);

medicalRoute.get(
    "/get-medical-records",
    authMiddleware.exec,
    medicalController.getMedicalRecords
);

medicalRoute.post(
    "/search-medical-record",
    authMiddleware.exec,
    medicalController.searchMedicalRecord
);

medicalRoute.post("/fake", medicalController.fake);
medicalRoute.get(
    "/recent",
    authMiddleware.exec,
    medicalController.getRecentExam
);

medicalRoute.get(
    "/appointment",
    authMiddleware.exec,
    medicalController.getAppointment
);

medicalRoute.get(
    "/get-medical-result",
    authMiddleware.exec,
    medicalController.getMedicalResult
);

medicalRoute.post(
    "/update-medical-record",
    authMiddleware.exec,
    medicalController.updateMedicalRecord
);

medicalRoute.post(
    "/update-medical-result",
    authMiddleware.exec,
    medicalUpload.single("medicineImage"),
    medicalController.updateMedicalResult
);

medicalRoute.post(
    "/add-medicine",
    authMiddleware.exec,
    medicalController.addMedicine
);

medicalRoute.post(
    "/update-status-medical-result",
    authMiddleware.exec,
    medicalUpload.single("medicineImage"),
    medicalController.updateStatusMedicalResult
);

medicalRoute.post(
    "/update-status-medical-record",
    authMiddleware.exec,
    medicalController.updateStatusMedicalRecord
);

export default medicalRoute;
