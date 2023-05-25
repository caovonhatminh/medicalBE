import { clientDB } from "..";
import moment from "moment";
export interface MedicalRecord {
    appointment?: moment.MomentInput;
    _id?: string;
    hospitalName: string;
    medicalName: string;
    createAt: string;
    updateAt: string;
    status: string;
    startDate?: string;
    fullName?: string;
    phone?: string;
    address?: string;
    birthday: string;
    users: string;
}

export interface MedicalResult {
    _id?: string;
    medicalRecord: MedicalRecord;
    date: string;
    finalResult: string;
    medicineImage?: string;
    appointment: string;
    status?: string;
    doctor?: string;
    phone?: string;
    createdDate?: string;
    updatedDate?: string;
}

export interface MedicalExaminationContent {
    _id?: string;
    medicalReuslt: MedicalResult;
    name: string;
    result: string;
    image?: string;
}

export interface Medicine {
    _id?: string;
    medicalResult?: MedicalResult;
    name: string;
    quantity: string;
    isAfter: boolean;
    morning: string;
    afternoon: string;
    night: string;
}

class MedicalRecordModel {
    static async findAll(
        order_by: { field: string; type: "desc" | "asc" } | undefined,
        limit: number | "all"
    ) {
        let order_query = "";
        if (order_by) {
            order_query = ` ORDER BY "${order_by.field}" ${order_by.type} `;
        }
        const query = {
            text:
                `select mr._id, "hospitalName", "medicalName", "createAt", "updateAt", mr.status, "startDate", "fullName", mr.phone, address, birthday, "users",
                count(public.medicine._id) as medicine_count
                from public."medicalRecord" mr left join public."medicalResult" ON "medicalResult"."medicalRecord" = mr._id
                left JOIN public.medicine ON medicine."medicalResult" = "medicalResult"._id
                group by mr._id` +
                order_query +
                ` limit ${limit} `,
        };
        const result = await clientDB.query(query);
        return result.rows;
    }

    static async findById(id: string) {
        const query = {
            text: `SELECT _id, "hospitalName", "medicalName", "createAt", "updateAt", status, "fullName", phone, address, birthday, "users"
            FROM public."medicalRecord" where _id=$1`,
            values: [id],
        };
        const result = await clientDB.query(query);
        if (result.rowCount > 0) return result.rows[0];
        return [];
    }

    static async insert(data: MedicalRecord) {
        const query = {
            text: `INSERT INTO public."medicalRecord"(
                _id, "hospitalName", "medicalName", "createAt", "updateAt", "startDate", "fullName", "status", phone, address, birthday, "users")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`,
            values: [
                data._id,
                data.hospitalName,
                data.medicalName,
                data.createAt,
                data.updateAt,
                data.startDate,
                data.fullName,
                "1",
                data.phone,
                data.address,
                data.birthday,
                data.users,
            ],
        };
        const result = await clientDB.query(query);
        if (result.rowCount > 0) return true;
        return false;
    }

    static async getAppointment() {
        const query = {
            text: `SELECT rc.*, rs.appointment,rs._id, rc._id as medicalRecordId
                    FROM public."medicalRecord" rc
                    JOIN public."medicalResult" rs ON rc._id = rs."medicalRecord"
                    ORDER BY rs.appointment ASC;`,
        };

        const result = await clientDB.query(query);
        return result.rows as MedicalRecord[];
    }

    static async getCurrentAppointment() {
        const query = {
            text: `select * from public."medicalRecord" rc join public."medicalResult" rs on rc._id = rs."medicalRecord"
            where to_char(now(), 'DD/MM/YYYY') = to_char(rs.appointment, 'DD/MM/YYYY') order by rs.appointment asc`,
        };

        const result = await clientDB.query(query);
        return result.rows as MedicalRecord[];
    }

    static async update(id: string, data: MedicalRecord) {
        console.log(moment(new Date()).format("YYYY/MM/DD"));

        try {
            const query = {
                text: `UPDATE public."medicalRecord"
            SET "hospitalName"=$1, "medicalName"=$2, "updateAt"=$3, "createAt"=$4, "fullName" = $5, phone=$6, address=$7, birthday=$8
            WHERE _id=$9`,
                values: [
                    data.hospitalName,
                    data.medicalName,
                    moment(new Date()).format("YYYY/MM/DD"),
                    moment(data.createAt).format("YYYY/MM/DD"),
                    data.fullName,
                    data.phone,
                    data.address,
                    data.birthday,
                    id,
                ],
            };
            const result = await clientDB.query(query);
            return result.rowCount === 1;
        } catch (error) {
            return error
        }
    }
    static async updateStatus(id: string, status: boolean) {
        const query = {
            text: `UPDATE public."medicalRecord"
            SET "status"=$1, "updateAt"=$2
            WHERE _id=$3`,
            values: [status, moment(new Date()).format("YYYY/MM/DD"), id],
        };
        const result = await clientDB.query(query);
        return result.rowCount === 1;
    }
    static async updateUsers(id: string, users: string) {
        const query = {
            text: `UPDATE public."medicalRecord"
            SET "users"=$1, "updateAt"=$2
            WHERE _id=$3`,
            values: [users, moment(new Date()).format("YYYY/MM/DD"), id],
        };
        const result = await clientDB.query(query);
        return result.rowCount === 1;
    }
    static async search(phone: string, fullText: string | undefined) {
        let query = {
            text: "",
            values: [] as any[],
        };
        if (fullText) {
            fullText = fullText.split(" ").join(" | ");
        }

        if (phone) {
            query = {
                text: `SELECT public."medicalRecord"._id, "hospitalName", "medicalName", "createAt", "updateAt", "fullName", public."medicalRecord".phone, address, birthday, public."medicalRecord".status
                FROM public."medicalRecord"
                where "medicalRecord".phone = $1
                    `,
                values: [phone],
            };
        } else {
            query = {
                text: `SELECT public."medicalRecord"._id, "hospitalName", "medicalName", "fullName", public."medicalRecord".phone, address, birthday, "createAt", "updateAt", public."medicalRecord".status
                        FROM public."medicalRecord"
                        WHERE "medicalRecord"."fullName" LIKE $1`,
                values: [`%${fullText}%`],
              };
        }

        console.log(query);

        const result = await clientDB.query(query);
        return result.rows;
    }
}
class MedicalResultModel {
    static async findWithMedicalRecordID(medicalRecordID: string) {
        const query = {
            text: `select * from public."medicalResult" where "medicalRecord" = $1`,
            values: [medicalRecordID],
        };
        const result = await clientDB.query(query);
        return result.rows as MedicalResult[];
    }

    static async findById(id: string) {
        const query = {
            text: `SELECT _id, "medicalRecord", date, "finalResult", "medicineImage", appointment, status, tsv
            FROM public."medicalResult" where _id=$1`,
            values: [id],
        };
        const result = await clientDB.query(query);
        if (result.rowCount > 0) return result.rows[0];
        return null;
    }

    static async insert(medicalRecordID: string, data: MedicalResult) {
        const query = {
            text: `INSERT INTO public."medicalResult"(
                _id, "medicalRecord", date, "finalResult", "medicineImage", appointment, doctor, phone)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
            values: [
                data._id,
                medicalRecordID,
                data.date,
                data.finalResult,
                data.medicineImage,
                data.appointment,
                data.doctor,
                data.phone,
            ],
        };

        const result = await clientDB.query(query);
        if (result.rowCount > 0) return true;
        return false;
    }

    static async update(id: string, data: MedicalResult) {
        const query = {
            text: `UPDATE public."medicalResult"
            SET date=$1, "finalResult"=$2, "medicineImage"=$3, appointment=$4, doctor=$5, phone=$6
            WHERE _id=$7`,
            values: [
                data.date,
                data.finalResult,
                data.medicineImage,
                data.appointment,
                data.doctor,
                data.phone,
                id,
            ],
        };

        const result = await clientDB.query(query);
        return result.rowCount == 1;
    }

    static async updateStatus(id: string, status: boolean) {
        const query = {
            text: `UPDATE public."medicalResult"
            SET status=$1
            WHERE _id=$2`,
            values: [status, id],
        };
        const result = await clientDB.query(query);
        return result.rowCount == 1;
    }
}

class MedicineModel {
    static async findWithMedicalResult(medicalResultID: string) {
        const query = {
            text: `select * from public.medicine where public.medicine."medicalResult"=$1`,
            values: [medicalResultID],
        };
        const result = await clientDB.query(query);
        return result.rows;
    }
    static async insert(data: Medicine) {
        const query = {
            text: `INSERT INTO public.medicine(
                _id, "medicalResult", name, quantity, "isAfter", morning, afternoon, night)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
            values: [
                data._id,
                data.medicalResult,
                data.name,
                data.quantity,
                data.isAfter,
                data.morning,
                data.afternoon,
                data.night,
            ],
        };
        const result = await clientDB.query(query);
        return result.rowCount > 0;
    }
}

class MedicalExaminationContentModel {
    static async findById(id: string) {
        const query = {
            text: `SELECT _id, "medicalResult", name, result, image, tsv
            FROM public."medicalResultItem" where _id=$1`,
            values: [id],
        };
        const result = await clientDB.query(query);
        if (result.rowCount > 0) return result.rows[0];
        return [];
    }
    static async findWithMedicalResult(medicalResultID: string) {
        const query = {
            text: `SELECT _id, "medicalResult", name, result, image, tsv
            FROM public."medicalResultItem" where "medicalResult"=$1`,
            values: [medicalResultID],
        };
        const result = await clientDB.query(query);
        return result.rows;
    }

    static async insert(
        medicalResultID: string,
        data: MedicalExaminationContent
    ) {
        const query = {
            text: `INSERT INTO public."medicalResultItem"(
                _id, "medicalResult", name, result, image)
                VALUES ($1, $2, $3, $4, $5);`,
            values: [
                data._id,
                medicalResultID,
                data.name,
                data.result,
                data.image,
            ],
        };
        const result = await clientDB.query(query);
        if (result.rowCount > 0) return true;
        return false;
    }

    static async update(id: string, data: MedicalExaminationContent) {
        const query = {
            text: `UPDATE public."medicalResultItem"
            SET  name=$1, result=$2, image=$3
            WHERE _id=$4`,
            values: [data.name, data.result, data.image, id],
        };

        const result = await clientDB.query(query);
        return result.rowCount > 0;
    }
}

export {
    MedicalRecordModel,
    MedicalResultModel,
    MedicalExaminationContentModel,
    MedicineModel,
};
