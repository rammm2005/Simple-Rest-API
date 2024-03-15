import dotenv from 'dotenv';

dotenv.config();

export const sessionConfig = {
    secret: process.env.SESSION_SECRET_TOKEN as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    },
};