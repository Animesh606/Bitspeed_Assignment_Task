import pool from "../db";

interface Contact {
    id: number;
    phoneNumber?: string;
    email?: string;
    linkedId?: number;
    linkPrecedence: "secondary" | "primary";
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

const searchById = (id: number) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT * FROM contact WHERE id = ? AND deletedAt IS NULL;`, [id], 
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
};

const searchByEmail = (email: string) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM contact WHERE email = ? AND deletedAt IS NULL;`, [email.toLowerCase()], 
        (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const searchByPhoneNumber = (phoneNumber: string) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT * FROM contact WHERE phoneNumber = ? AND deletedAt IS NULL;`, [phoneNumber],  
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
};

const searchByLindedId = (linkedId: number) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT * FROM contact WHERE linkedId = ? AND deletedAt IS NULL`, [linkedId],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
};

const insertContact = (email: string | null, phoneNumber: string | null, linkedId: number | null, linkPrecedence: "primary" | "secondary") => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO contact (phoneNumber, email, linkedId, linkPrecedence) VALUES (?, ?, ?, ?);`, [phoneNumber, email, linkedId, linkPrecedence],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
};

const updateContacts = (primeId: number, secondId: number) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE contact SET linkedId = ?, linkPrecedence = "secondary" WHERE (linkedId = ? OR id = ?) AND id != ?;`, [primeId, secondId, secondId, primeId],
            (err, result) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

export {
    Contact,
    searchById,
    searchByEmail,
    searchByPhoneNumber,
    searchByLindedId,
    insertContact,
    updateContacts
};