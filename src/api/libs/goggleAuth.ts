import { Strategy } from 'passport-google-oauth2';
import prisma from '../../db/server';
import { findAccountById, findUserByEmail } from '../user/v1/user.repository';
import { hashToken } from './hashToken';
import express, { Request, Response, response, CookieOptions } from 'express';
import session from 'express-session';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sessionConfig } from './sessionConfig';
import { getUserById } from '../user/v1/user.service';



const app = express();
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());


const clientId = process.env.GOOGLE_CLIENT_ID as string;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
const callbackUri = process.env.GOOGLE_CALLBACK_URL as string;

export const googleStrategy = new Strategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: callbackUri,
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value;
    const id = profile.id?.[0]?.value;


    if (!email) {
        return done(new Error('Email not provided by Google'), null);
    }

    try {
        const existingUser = await findUserByEmail(email);
        const exitsAccount = await findAccountById(id);

        if (existingUser && exitsAccount) {
            const sessionState = uuidv4();

            const account = await prisma.account.update({
                where: {
                    id: exitsAccount.id,
                },
                data: {
                    userId: existingUser.id,
                    type: exitsAccount.type,
                    provider: exitsAccount.provider,
                    providerAccountId: exitsAccount.id,
                    id_token: profile.id_token,
                    scope: profile.scope,
                    refresh_token: await hashToken(refreshToken || ''),
                    access_token: accessToken,
                    session_state: sessionState,
                },
            });


            await prisma.user.update({
                where: { id: existingUser.id },
                data: { image: profile.picture.url },
            });

    
            return done(null, { existingUser, account });
        }

        // Create new user and account
        const hashedPassword = await bcrypt.hash('google_password', 10);
        let userName = profile.displayName || '';
        if (!userName) {
            console.warn('User profile did not provide a name. Using a default.');
            userName = 'Unnamed User';
        }
        const user = await prisma.user.create({
            data: {
                email,
                username: userName,
                password: hashedPassword,
                image: profile.picture,
                status: true,
            },
        });

        const sessionState = uuidv4();

        const accountData = await prisma.account.create({
            data: {
                userId: user.id,
                type: 'google',
                provider: profile.provider,
                providerAccountId: profile.id,
                id_token: profile.id_token,
                scope: profile.scope,
                refresh_token: await hashToken(refreshToken || ''),
                access_token: accessToken,
                session_state: sessionState,
            },
        });

        return done(null, { user, accountData });
    } catch (error) {
        console.error('Error creating account:', error);
        return done;
    }

});


export const Logout = async (req: Request, res: Response) => {
    try {
        await req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).send('Error Processing Logout');
                return;
            }

            res.redirect('/');
        });

        // const userId = req.params.id;

        // const getUserId = await getUserById(userId);

        // if (getUserId) {
        //     await prisma.user.update({
        //         where: { id: userId },
        //         data: { status: false }
        //     });
        // } else {
        //     console.warn('User ID not found in session for logout status update');
        // }
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('Internal Server Error');
    }
};
