import { clientDB } from "..";

interface User {
    _id?: string;
    username?: string;
    password?: string;
    fullName?: string;
    avatar?: string;
    phone?: string;
    address?: string;
    birthday?: Date;
    role?: string;
}

class UserModel {
    static async findByUsername(username: string) {
        const query = {
            text: "select * from users where username=$1",
            values: [username],
        };

        const result = await clientDB.query(query);
        if (result.rowCount > 0) return result.rows[0];
        return null;
    }

    static async findAll() {
        const query = {
            text: "select * from users where role != 'ad'",
        };

        const result = await clientDB.query(query);
        return result.rows as User[];
    }

    static async findById(id: string) {
        const query = {
            text: "select * from users where _id=$1",
            values: [id],
        };

        const result = await clientDB.query(query);
        return result.rows[0] as User;
    }

    static async findLimit(limit: number | "all") {
        const query = {
            text: `select * from users limit $1`,
            values: [limit],
        };
        const result = await clientDB.query(query);
        return result.rows as User[];
    }

    static async insert(user: User) {
        const query = {
            text: 'INSERT INTO public.users(username, password, "fullName", avatar, phone, address, birthday, _id, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            values: [
                user.username,
                user.password,
                user.fullName,
                user.avatar,
                user.phone,
                user.address,
                user.birthday,
                user._id,
                user.role,
            ],
        };
        const result = await clientDB.query(query);
        return result;
    }

    static async insertBase(
        id: string,
        username: string,
        password: string,
        role: string
    ) {
        const query = {
            text: "INSERT INTO public.users(username, password, _id, role) VALUES ($1, $2, $3, $4)",
            values: [username, password, id, role],
        };
        const result = await clientDB.query(query);
        return result;
    }

    static async updatePass(id: string, password: string) {
        const query = {
            text: `UPDATE public.users
            SET "password"=$1
            WHERE _id=$2;`,
            values: [
                password,
                id,
            ],
        };

        const result = await clientDB.query(query);
        return result;
    }

    static async update(user: any) {
        const query = {
            text: `UPDATE public.users
            SET "fullName"=$1, avatar=$2, phone=$3, address=$4, birthday=$5, role=$6
            WHERE _id=$7;`,
            values: [
                user.fullName,
                user.avatar,
                user.phone,
                user.address,
                user.birthday,
                user.role,
                user._id,
            ],
        };

        const result = await clientDB.query(query);
        return result;
    }

    static async delete(_id: string) {
        const query = {
            text: `delete from public.users WHERE _id=$1;`,
            values: [_id],
        };

        const result = await clientDB.query(query);
        return result.rowCount === 1;
    }
}

export { User, UserModel };
