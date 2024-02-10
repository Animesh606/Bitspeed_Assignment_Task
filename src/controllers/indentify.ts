import { Request, Response } from "express";
import pool from "../db";
import { PoolConnection } from "mysql2";

interface requestInput {
    email?: string,
    phoneNumber?: string
}

interface Contact {
    id: Number,                   
    phoneNumber?: String,
    email?: String,
    linkedId?: Number,
    linkPrecedence: "secondary"|"primary",
    createdAt: Date,            
    updatedAt: Date,              
    deletedAt?: Date
}

const getContact = async ({email, phoneNumber} : requestInput) => {

}

const indentify = async (req: Request, res: Response) => {
    try {
        // Get the email and phoneNumber from the request body.
        const { email, phoneNumber } : requestInput = req.body;

        // Check email and phoneNumber is not present
        if (!email && !phoneNumber)
            throw new Error('Email and Phone Number is missing.');
        
        const contact = await getContact({email, phoneNumber});

        console.log(contact);
        
        return res.status(201).json({ message: "Request received.", contact});

    } catch (error: any) {
        return res.status(error.statusCode).json({ message: error.message });
    }
}

export default indentify;