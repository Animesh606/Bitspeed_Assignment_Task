const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME || 'test';
const db_port = parseInt(process.env.DB_PORT!, 10);

export {
    db_host,
    db_user,
    db_password,
    db_name,
    db_port
}