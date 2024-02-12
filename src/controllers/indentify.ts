import { Request, Response } from "express";
import { Contact, searchById, searchByEmail, searchByPhoneNumber, insertContact, searchByLindedId, updateContacts } from "../models/contact";

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

        // response data initialised
        let contact: responseOutput;

        // Check email and phoneNumber both is not present
        if (!email && !phoneNumber)
            throw new Error("Email and Phone Number is missing.");

        // Have a email but phoneNumber is null
        else if(email && !phoneNumber) {
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
                    if(id !== primeContact.id)
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
                    if(id !== primeContact.id)
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
            const emailContact = <Contact[]> await searchByEmail(email!);
            const phoneContact = <Contact[]> await searchByPhoneNumber(phoneNumber!);

            // If both not found in old dataset
            if(emailContact.length == 0 && phoneContact.length == 0) {
                const newContact = <{insertId: number}> await insertContact(email!, phoneNumber!, null, "primary");
                contact = {
                    primaryContatctId: newContact.insertId,
                    emails: [email!],
                    phoneNumbers: [phoneNumber!],
                    secondaryContactIds: []
                }
            }
            // If Both email and phoneNumber is present
            else if(emailContact.length > 0 && phoneContact.length > 0){
                const primeEmailContact = (emailContact[0].linkPrecedence === "primary") ? emailContact[0] : (<Contact[]> await searchById(emailContact[0].linkedId!))[0];
                const primePhoneContact = (phoneContact[0].linkPrecedence === "primary") ? phoneContact[0] : (<Contact[]> await searchById(phoneContact[0].linkedId!))[0];

                let primeContact = (primeEmailContact.createdAt < primePhoneContact.createdAt) ? primeEmailContact : primePhoneContact;
                if(primeEmailContact !== primePhoneContact) {
                    if(primeEmailContact.createdAt < primePhoneContact.createdAt) {
                        await updateContacts(primeEmailContact.id, primePhoneContact.id);
                    }
                    else {
                        await updateContacts(primePhoneContact.id, primeEmailContact.id);
                    }
                }
                contact = {
                    primaryContatctId: primeContact.id,
                    emails: (primeContact.email) ? [primeContact.email] : [],
                    phoneNumbers: (primeContact.phoneNumber) ? [primeContact.phoneNumber] : [],
                    secondaryContactIds: []
                }

                const secondaryContacts = <Contact[]> await searchByLindedId(primeContact.id);
                secondaryContacts.forEach(({ id, email, phoneNumber }) => {
                    if(id !== primeContact.id)
                        contact.secondaryContactIds.push(id);
                    if(email)
                        contact.emails.push(email);
                    if(phoneNumber)
                        contact.phoneNumbers.push(phoneNumber);
                });
            }
            // If just email or just phoneNumber Found
            else {
                let primeContact: Contact;
                if(emailContact.length > 0)
                    primeContact = (emailContact[0].linkPrecedence === "primary") ? emailContact[0] : (<Contact[]> await searchById(emailContact[0].linkedId!))[0];
                else 
                    primeContact = (phoneContact[0].linkPrecedence === "primary") ? phoneContact[0] : (<Contact[]> await searchById(phoneContact[0].linkedId!))[0];

                await insertContact(email!, phoneNumber!, primeContact.id, "secondary");
                const secondaryContacts = <Contact[]> await searchByLindedId(primeContact.id);
                contact = {
                    primaryContatctId: primeContact.id,
                    emails: (primeContact.email) ? [primeContact.email] : [],
                    phoneNumbers: (primeContact.phoneNumber) ? [primeContact.phoneNumber] : [],
                    secondaryContactIds: []
                }
                secondaryContacts.forEach(({ id, email, phoneNumber }) => {
                    if(id !== primeContact.id)
                        contact.secondaryContactIds.push(id);
                    if(email)
                        contact.emails.push(email);
                    if(phoneNumber)
                        contact.phoneNumbers.push(phoneNumber);
                })
            }
        }

        contact.emails = Array.from(new Set(contact.emails));
        contact.phoneNumbers = Array.from(new Set(contact.phoneNumbers));

        return res.status(201).json({ contact });
    } catch (error: any) {
        console.log(error);
        return res.status(error.statusCode).json({ message: error.message });
    }
}

export default indentify;