import { Request, Response } from "express";
import { Contact, searchById, searchByEmail, searchByPhoneNumber, insertContact, searchByLindedId } from "../models/contact";

interface requestInput {
    email?: string;
    phoneNumber?: string;
}

interface responseOutput {
    primaryContatctId: number,
    emails: string[],
    phoneNumbers: string[],
	secondaryContactIds: number[]
}

const indentify = async (req: Request, res: Response) => {
    try {
        // Get the email and phoneNumber from the request body.
        const { email, phoneNumber }: requestInput = req.body;

        // Check email and phoneNumber is not present
        if (!email && !phoneNumber)
            throw new Error("Email and Phone Number is missing.");

        // response data initialised
        let contact: responseOutput;

        // Have a email but phoneNumber is null
        if(email && !phoneNumber) {
            const emailContact = <Contact[]> await searchByEmail(email);

            // If no contacts with this email found then create a new one.
            if(!emailContact || emailContact.length == 0) {
                let newContact = <{insertId: number}> await insertContact(email, null, null, "primary");
                contact = {
                    primaryContatctId : newContact?.insertId,
                    emails: [email],
                    phoneNumbers: [],
                    secondaryContactIds: []
                }
            }
            else {
                const primeContact = (emailContact[0].linkPrecedence === "primary") ? emailContact[0] : (<Contact[]>await searchById(emailContact[0].linkedId!))[0];
                const secondaryContacts = <Contact[]>await searchByLindedId(primeContact.id);
                contact = {
                    primaryContatctId: primeContact.id,
                    emails: [],
                    phoneNumbers: [],
                    secondaryContactIds: []
                }
                if(primeContact.email)
                    contact.emails.push(primeContact.email);
                if(primeContact.phoneNumber)
                    contact.phoneNumbers.push(primeContact.phoneNumber);
                secondaryContacts.forEach(({id, email, phoneNumber}) => {
                    contact.secondaryContactIds.push(id);
                    if(email)
                        contact.emails.push(email);
                    if(phoneNumber)
                        contact.phoneNumbers.push(phoneNumber);
                });
            }
        }
        // Have a phoneNumber but not email
        else if(phoneNumber && !email) {
            const phoneContact = <Contact[]> await searchByPhoneNumber(phoneNumber);

            // If no contacts with this phoneNumber found then create a new one.
            if(!phoneContact || phoneContact.length == 0) {
                let newContact = <{insertId: number}> await insertContact(null, phoneNumber, null, "primary");
                contact = {
                    primaryContatctId : newContact?.insertId,
                    emails: [],
                    phoneNumbers: [phoneNumber],
                    secondaryContactIds: []
                }
            }
            else {
                const primeContact = (phoneContact[0].linkPrecedence === "primary") ? phoneContact[0] : (<Contact[]>await searchById(phoneContact[0].linkedId!))[0];
                const secondaryContacts = <Contact[]>await searchByLindedId(primeContact.id);
                contact = {
                    primaryContatctId: primeContact.id,
                    emails: [],
                    phoneNumbers: [],
                    secondaryContactIds: []
                }
                if(primeContact.email)
                    contact.emails.push(primeContact.email);
                if(primeContact.phoneNumber)
                    contact.phoneNumbers.push(primeContact.phoneNumber);
                secondaryContacts.forEach(({id, email, phoneNumber}) => {
                    contact.secondaryContactIds.push(id);
                    if(email)
                        contact.emails.push(email);
                    if(phoneNumber)
                        contact.phoneNumbers.push(phoneNumber);
                });
            }
        }
        // Both email and phoneNumber is defined
        else {

        }

        return res.status(201).json({ message: "Request received.", contact });
    } catch (error: any) {
        return res.status(error.statusCode).json({ message: error.message });
    }
}

export default indentify;