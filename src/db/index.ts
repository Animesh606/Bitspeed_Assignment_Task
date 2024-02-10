import mysql from "mysql2";
import { db_host, db_name, db_password, db_port, db_user } from "../config";

const pool =  mysql.createPool({
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_name,
    port: db_port
});

export default pool;