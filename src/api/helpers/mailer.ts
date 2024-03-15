import nodemailer from 'nodemailer';
import express from 'express';
import bodyParser from "body-parser";
import * as crypto from 'crypto';
import { hashToken } from 'api/libs/hashToken';

const router = express.Router();
const service = process.env.SERVICE_EMAIL as string;
const user = process.env.SERVICE_USERNAME as string;
const password = process.env.SERVICE_PASSWORD as string;
router.use(bodyParser.urlencoded({ extended: false }));

const transporter = nodemailer.createTransport({
    service: service,
    auth: {
        user: user,
        pass: password,
    },
});


router.post('/send-verification-email', (req, res) => {
    const email = req.body.email;
    const token = crypto.randomBytes(32).toString('hex');
    
    const mailOptions = {
        from: 'Tour Agency',
        to: email,
        subject: 'Confirm your email address',
        text: `Click on this link to verify your email: http://locahost:3000/auth/verify?token=${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending verification email.');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Verification email sent.');
        }
    });
});
