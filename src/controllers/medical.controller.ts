import { Response } from "express";
import {
    MedicalRecordModel,
    MedicalExaminationContentModel,
    MedicalResultModel,
    MedicalRecord,
    MedicalResult,
    MedicineModel,
    Medicine,
    MedicalExaminationContent,
} from "../models/medical.model";
import { http, CustomRequest } from "../config/http";
import { faker } from "@faker-js/faker";
import { UserModel } from "../models/user.model";
import moment from "moment";
import { unlink } from "fs";
import { randomUUID } from "crypto";
import {log} from "util";

function getDate(date: string) {
    return moment(date, "DD/MM/YYYY").add(1);
}

function getDateDay(date: string) {
    return moment(date, "DD/MM/YYYY")
}

function removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

class MedicalController {
    /**
     * TODO: them mot ho so benh an moi
     * @param request
     * @param response
     * @returns
     */
    @http()
    async addMedicalRecord(request: CustomRequest, response: Response) {
        const data = request.body;
        data.medicalResults = [];
        // data.startDate = getDate(data.startDate);
        data.createAt = new Date();
        data.updateAt = new Date();
        data._id = randomUUID();
        await MedicalRecordModel.insert(data);
        const medicalRecord = await MedicalRecordModel.findById(data._id);
        return medicalRecord;
    }

    /**
     * TODO: them ket qua cua lan di kham
     * @param request
     * @param response
     * @returns
     */
    @http()
    async addMedicalResult(request: CustomRequest, response: Response) {
        let {
            medicalRecordID,
            date,
            finalResult,
            medicines = "",
            appointment = "",
            doctor = "",
            phone = "",
        } = request.body;

        date = getDateDay(date).format("YYYY-MM-DD");

        if (appointment !== "") {
                const [time, date] = appointment.split(' ')
                const [hour, minute] = time.split(':');
                const [day, month, year] = date.split('/');
                const newDate = new Date(year, month - 1, day, hour, minute);
                appointment = moment(newDate).format("HH:mm YYYY-MM-DD");;
        } else {
            appointment = null;
        }

        if (medicines !== "") medicines = JSON.parse("[" + medicines + "]");
        else medicines = [];

        let medicineImage = null;

        if (request.file)
            medicineImage = request.file?.filename as string;

        const data = {
            _id: randomUUID(),
            date,
            finalResult,
            medicineImage,
            appointment,
            doctor,
            phone,
            createdDate: moment().format("HH:mm DD/MM/YYYY"),
            updatedDate: moment().format("HH:mm DD/MM/YYYY"),
        } as MedicalResult;

        console.log(data)

        await MedicalResultModel.insert(medicalRecordID, data);

        medicines = medicines.map((value: any) => {
            return {
                _id: randomUUID(),
                medicalResult: data._id,
                name: value.name,
                quantity: value.quantity,
                isAfter: value.dosage.isAfter,
                morning: value.dosage.morning,
                afternoon: value.dosage.afternoon,
                night: value.dosage.night,
            } as Medicine;
        });

        for (let medicine of medicines) {
            await MedicineModel.insert(medicine as Medicine);
        }

        const medicalResult = (await MedicalResultModel.findById(
            data._id as string
        )) as any;
        medicalResult.medicines = await MedicineModel.findWithMedicalResult(
            medicalResult.id as string
        );

        return medicalResult;
    }

    /**
     * TODO: them kq cua 1 noi dung kham
     * @param request
     * @param response
     * @returns
     */
    @http()
    async addMedicalExaminationContent(
        request: CustomRequest,
        response: Response
    ) {
        const { medicalResultID, name, result } = request.body;
        const image = request.file?.filename as string;
        const data = {
            _id: randomUUID(),
            name,
            result,
            image,
        } as MedicalExaminationContent;
        await MedicalExaminationContentModel.insert(medicalResultID, data);
        const newMedicalResult = await MedicalResultModel.findById(
            medicalResultID
        );

        console.log('newMedicalResult', newMedicalResult                                                                                                   )
        await MedicalResultModel.update(medicalResultID, {
            ...newMedicalResult,
            updatedDate: moment().format("HH:mm DD/MM/YYYY"),
        });
        return data;
    }

    @http()
    async getMedicalRecords(request?: CustomRequest, response?: Response) {
        console.log('medicalRecords')
        const medicalRecords = (await MedicalRecordModel.findAll(
            undefined,
            "all"
        )) as any[];

        console.log(medicalRecords)
        medicalRecords.reverse();

        const medicalResults = [] as any;
        for (let v of medicalRecords) {
            medicalResults.push(
                (await MedicalResultModel.findWithMedicalRecordID(v._id)).map(
                    (value) => value._id
                )
            );
        }
        return medicalRecords.map((value, index) => {
            return {
                ...value,
                medicalResults: medicalResults[index],
            };
        });
    }

    @http()
    async getMedicalRecord(request: CustomRequest, response: Response) {
        const { _id } = request.query;
        const medicalRecord = await MedicalRecordModel.findById(_id as string);
        return medicalRecord;
    }

    @http()
    async searchMedicalRecord(request: CustomRequest, response: Response) {
        let { phone = "", fullText = "" } = request.body;

        if (fullText) {
            fullText = removeAccents(fullText.trim());
        }

        if (phone) {
            phone = phone.trim();
        }

        let medicalRecords = [];

        if(!fullText && !phone) {
            medicalRecords = (await MedicalRecordModel.findAll(
                undefined,
                "all"
            )) as any[];

        } else {
            medicalRecords = await MedicalRecordModel.search(
                phone,
                fullText,
            );
        }

        medicalRecords.reverse();

        const medicalResults = [] as any;
        for (let v of medicalRecords) {
            medicalResults.push(
                (await MedicalResultModel.findWithMedicalRecordID(v._id)).map(
                    (value) => value._id
                )
            );
        }
        return medicalRecords.map((value: any, index: number) => {
            return {
                ...value,
                medicalResults: medicalResults[index],
            };
        });
    }

    @http()
    async fake(request: CustomRequest, response: Response) {
        const users = [
            await UserModel.findByUsername("admin"),
            await UserModel.findByUsername("cong"),
        ];

        console.log("========== fake ===============");

        let num = 5;
        while (num > 0) {
            num--;
            const user = users[Math.floor(Math.random() * users.length)];

            let numMedical = 5;
            // while (numMedical > 0) {
            //     numMedical--;
            //     // * tao benh an
            //     const medicalName = faker.hacker.phrase();
            //     const hospitalName = faker.company.bs();
            //     const createAt = new Date();
            //     const updateAt = faker.date.future();
            //     const medicalRecord = {
            //         _id: randomUUID(),
            //         medicalName,
            //         hospitalName,
            //         createAt,
            //         updateAt,
            //         fullName: "Nguyen van a",
            //         phone: "123",
            //         address: "12",
            //         birthday: "1/1/2022"
            //     } as MedicalRecord;
            //     await MedicalRecordModel.insert(medicalRecord);
            //
            //     let numMedicalResult = 5;
            //     while (numMedicalResult > 0) {
            //         numMedicalResult--;
            //         // * tạo medical result
            //         const date = faker.date.birthdate();
            //         const finalResult = faker.hacker.phrase();
            //         const medicineImage = faker.image.cats();
            //         const appointment = faker.date.birthdate();
            //         const medicines = [];
            //         let numMedicine = Math.floor(Math.random() * 6) + 1;
            //         const medicalResult = {
            //             _id: randomUUID(),
            //             date,
            //             finalResult,
            //             medicineImage,
            //             appointment,
            //         } as MedicalResult;
            //
            //         while (numMedicine > 0) {
            //             numMedicine--;
            //             medicines.push({
            //                 _id: randomUUID(),
            //                 medicalResult: medicalResult._id,
            //                 name: faker.music.songName(),
            //                 quantity:
            //                     Math.floor(Math.random() * 6) + 1 + " viên",
            //                 isAfter: Math.floor(Math.random() * 6) + 1 > 3,
            //                 morning: Math.floor(Math.random() * 2) + " viên",
            //                 afternoon: Math.floor(Math.random() * 2) + " viên",
            //                 night: Math.floor(Math.random() * 2) + " viên",
            //             } as Medicine);
            //         }
            //
            //         await MedicalResultModel.insert(
            //             medicalRecord._id as string,
            //             medicalResult
            //         );
            //
            //         for (let medicine of medicines) {
            //             const result = await MedicineModel.insert(
            //                 medicine as Medicine
            //             );
            //             if (!result) {
            //                 return "";
            //             }
            //         }
            //
            //         let numExam = Math.floor(Math.random() * 6) + 1;
            //         while (numExam > 0) {
            //             numExam--;
            //             const name = faker.hacker.phrase();
            //             const result = faker.hacker.phrase();
            //             const image = faker.image.cats();
            //             await MedicalExaminationContentModel.insert(
            //                 medicalResult._id as string,
            //                 {
            //                     _id: randomUUID(),
            //                     name,
            //                     result,
            //                     image,
            //                 } as MedicalExaminationContent
            //             );
            //         }
            //     }
            // }
        }

        return "success";
    }

    @http()
    async getRecentExam(request: CustomRequest, response: Response) {
        const medicalRecord = await MedicalRecordModel.findAll(
            { field: "updateAt", type: "desc" },
            100
        );
        return medicalRecord;
    }

    @http()
    async getAppointment(request: CustomRequest, response: Response) {
        let medicalRecord = await MedicalRecordModel.getAppointment(
        );
        // const currentDate = moment(); // Get current date and time
        // medicalRecord = medicalRecord.filter(item =>  moment(item.appointment).isSameOrAfter(currentDate))

        return medicalRecord;
    }

    @http()
    async getMedicalResult(request: CustomRequest, response: Response) {
        const { medicalRecordID } = request.query;

        let medicalResults = (await MedicalResultModel.findWithMedicalRecordID(
            medicalRecordID as string
        )) as any[];

        medicalResults = await Promise.all(
            medicalResults.map(async (value) => {
                value.medicines = await MedicineModel.findWithMedicalResult(
                    value._id as string
                );

                value.results =
                    await MedicalExaminationContentModel.findWithMedicalResult(
                        value._id as string
                    );
                return value;
            })
        );

        return medicalResults;
    }

    @http()
    async updateMedicalExaminationContent(
        request: CustomRequest,
        response: Response
    ) {
        const data = request.body;
        let oldData = await MedicalExaminationContentModel.findById(data._id);
        if (request.file) {
            unlink("assets/prescription/" + oldData?.image, () => { });
            data.image = request.file?.filename as string;
        } else {
            data.image = oldData?.image;
        }
        await MedicalExaminationContentModel.update(data.id, data);
        oldData = await MedicalExaminationContentModel.findById(data._id);
        return oldData;
    }
    @http()
    async updateMedicalResult(request: CustomRequest, response: Response) {
        const data = request.body;
        const old = await MedicalResultModel.findById(data._id);

        if (request.file) {
            unlink("assets/prescription/" + old?.medicineImage, () => { });
            data.medicineImage = request.file?.filename as string;
        } else {
            data.medicineImage = old?.medicineImage;
        }

        if (data.date) {
            data.date = getDateDay(data.date).format("YYYY-MM-DD");
        }


        try {

            if(data.appointment) {
                const [time, date] = data.appointment.split(' ')
                const [hour, minute] = time.split(':');
                const [day, month, year] = date.split('/');
                const newDate = new Date(year, month - 1, day, hour, minute);
                data.appointment = moment(newDate).format("HH:mm YYYY-MM-DD");;
            }

            await MedicalResultModel.update(data._id, data);
            const medicalResult = await MedicalResultModel.findById(data._id);
            if(data?.users) {
                console.log(medicalResult)
                console.log(data?.users)
                const medicalRecord = await MedicalRecordModel.updateUsers(medicalResult?.medicalRecord, data?.users)
            }
            return medicalResult;
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    @http()
    async updateMedicalRecord(request: CustomRequest, response: Response) {

        try {
            const data = request.body;
            data.createAt = getDate(data.createAt);
            data.updateAt = new Date();
            await MedicalRecordModel.update(data._id, data);
            return "success";
        } catch (error) {
            return error;
        }
    }

    @http()
    async addMedicine(request: CustomRequest, response: Response) {
        const { medicalResultID, name, quantity, dosage } = request.body;
        const medicine = {
            _id: randomUUID(),
            name,
            medicalResult: medicalResultID,
            quantity,
            isAfter: dosage.isAfter,
            morning: dosage.morning,
            afternoon: dosage.afternoon,
            night: dosage.night,
        } as Medicine;
        await MedicineModel.insert(medicine);
        const newMedicalResult = await MedicalResultModel.findById(
            medicalResultID
        );
        await MedicalResultModel.update(medicalResultID, {
            ...newMedicalResult,
            updatedDate: moment().format("HH:mm DD/MM/YYYY"),
        });
        return medicine;
    }
    @http()
    async updateStatusMedicalResult(
        request: CustomRequest,
        response: Response
    ) {
        const { medicalResultID, status } = request.body;
        await MedicalResultModel.updateStatus(medicalResultID, status);
        const newMedicalResult = await MedicalResultModel.findById(
            medicalResultID
        );
        return newMedicalResult;
    }

    @http()
    async updateStatusMedicalRecord(
        request: CustomRequest,
        response: Response
    ) {
        const { medicalRecordID, status } = request.body;
        await MedicalRecordModel.updateStatus(medicalRecordID, status);
        const newMedicalRecord = await MedicalRecordModel.findById(
            medicalRecordID
        );
        return newMedicalRecord;
    }

    @http()
    async getCurrentAppontment(request: CustomRequest, response: Response) {
        //
    }
}

export default new MedicalController();
