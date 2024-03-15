import prisma from '../../../db/server';
import { User, Role, Account } from '@prisma/client';
import { hashToken } from "api/libs/hashToken";
import bcrypt from "bcrypt"
import { v4 } from 'uuid';
import jwt from "jsonwebtoken";
import { generateRandomString } from '../../helpers/authUser';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;





export const findUsers = async (): Promise<User[]> => {
    const users = await prisma.user.findMany();

    return users;
}

export const findUserById = async (id: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    return user;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    return user;
}

export const updateUserLogin = async (id: string, userData: User): Promise<User | null> => {
    const user = await prisma.user.update({
        where: {
            id,
        },
        data: {
            status: true,
        },
    })

    return user;
}


export const findUserPasswordByEmail = async (email: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    return user;
};



export const findUserByName = async (name: string): Promise<User | null> => {
    const user = await prisma.user.findFirst({
        where: {
            name,
        },
    });

    return user;
}

export const findUserByUsername = async (username: string): Promise<User | null> => {
    const user = await prisma.user.findFirst({
        where: {
            username: username,
        },
    });

    return user;
}


export const findAccountById = async (id: string): Promise<Account | null> => {
    const account = await prisma.account.findFirst({
        where: {
            id,
        },
    });

    return account;
}

export const insertUser = async (newUserData: User): Promise<User> => {
    const user = await prisma.user.create({
        data: {
            name: newUserData.name,
            username: newUserData.username,
            email: newUserData.email,
            password: newUserData.password,
            image: newUserData.image,
            status: false,
            Role: newUserData.Role,
        }
    });

    return user;
}


export const registerUser = async (username: string, email: string, password: string, status: false): Promise<User> => {
    const user = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: password,
            status: status,
        }
    });

    return user;
}


export const registAccount = async (userId: string, type: string, provider: string, providerAccountId: string): Promise<Account> => {
    const account = await prisma.account.create({
        data: {
            userId: userId,
            type: type,
            provider: provider,
            providerAccountId: providerAccountId,
        }
    });

    return account;
}

export const findAccountByUserId = async (userId: string): Promise<Account | null> => {
    const account = await prisma.account.findFirst({
        where: {
            userId,
        },
    });

    return account;
}



export const deleteUser = async (id: string): Promise<void> => {
    await prisma.user.delete({
        where: {
            id,
        }
    });
}


// type SignUpResponse = {
//     user: User;
//     account: Account;
// }


export const signUp = async (newUserData: User): Promise<{ user: User; account: Account }> => {
    const newUserDatastatus = false;


    if (!newUserData.email) {
        throw new Error('Email is required. Please provide an email address.');
    }

    const userEmail = await findUserByEmail(newUserData.email);

    if (!userEmail) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newUserData.password, saltRounds);
        const user = await prisma.user.create({
            data: {
                username: newUserData.username,
                email: newUserData.email,
                password: hashedPassword,
                status: newUserData.status,
                Role: "USER",
            },
        });

        const providerId = await generateRandomString(36);
        const account = await prisma.account.create({
            data: {
                userId: newUserData.id,
                type: 'Email',
                provider: 'Email Service',
                providerAccountId: providerId,
            }
        });

        return { user, account };
    } else {
        throw new Error("Email already exists. Please use a different email.");
    }
};


// export async function createAccount(newAccountData: Account, user: User): Promise<Account | undefined> {
//     if (accessTokenSecret) {
//         const userId = user.id;
//         const eccessToken = jwt.sign(accessTokenSecret, newAccountData.userId);
//         const providerAccountId = v4().toString();
//         const account = await prisma.account.create({
//             data: {
//                 userId,
//                 type: 'email',
//                 provider: 'email',
//                 providerAccountId,
//                 access_token: eccessToken,
//                 refresh_token: newAccountData.refresh_token,
//             },
//         });
//         return account;

//     } else {
//         console.error('ACCESS_TOKEN_SECRET environment variable not found');
//     }

// }


// export const addRefreshTokenToWhitelist = async (jti: string, refreshToken: string, userId: string, provider: string): Promise<Account> => {
//     const createRefreshToken = await prisma.account.create({
//         data: {
//             id: jti,
//             access_token: await hashToken(refreshToken || ''),
//             userId,
//         },
//     });

//     return createRefreshToken;
// }

export const updateUserById = async (id: string, userData: User): Promise<User | null> => {
    const updateUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            name: userData.name,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            image: userData.image,
            status: userData.status,
            Role: userData.Role,
        },
    });

    return updateUser;
}


