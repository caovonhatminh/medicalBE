import { Pool } from "pg";
const connect = () => {
    const clientPG = new Pool({
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        host: process.env.PG_HOST,
        port: parseInt(process.env.PG_PORT as string),
        database: process.env.PG_DATABASE,
    });

    return clientPG;
};
export default connect;
