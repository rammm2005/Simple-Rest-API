import { findUsers, findUserById, findUserByEmail, updateUserById, deleteUser, insertUser, findUserByName, findUserByUsername } from "./user.repository";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";



export const getAllUsers = async (): Promise<User[]> => {

    const users = await findUsers();

    if (users.length === 0) {
        throw new Error('No User found !')
    }

    return users;
}

export const getUserById = async (id: string): Promise<User | null> => {

    const user = await findUserById(id)

    if (!user) {
        // return res.status(400).send({ msg: "Sorry user Doesn't exits" });
        throw Error('User is Not Found or Does Not Exist !');
    }

    return user;
}

// export const createUser = async (newUserData: User): Promise<User | null> => {
//     const { name, username, email } = newUserData;

//     if (name || username || email) {
//         const findByName = await findUserByName(name || '');
//         const findByUsename = await findUserByUsername(username || '');
//         const findyByEmail = await findUserByEmail(email || '');

//         if (findByName) {
//             throw Error('Name already exists, Must be Change');
//         } else if (findyByEmail) {
//             throw Error('Email already exists, Please use Diffrent Email Address');
//         } else if (findByUsename) {
//             throw Error('Username already exists, Please Change your Username');
//         }
//     }

//     const user = await insertUser(newUserData);
//     return user;
// };

// export const SignUp = async (newUserData: User): Promise<User | null> => {
//     let { password, username, email } = newUserData;
//     password = await bcrypt.hash(newUserData.password, 12);

//     if (username || email) {
//         const findByUsename = await findUserByUsername(username || '');
//         const findyByEmail = await findUserByEmail(email || '');


//         if (findyByEmail) {
//             throw Error('Email already exists, Please use Diffrent Email Address');
//         } else if (findByUsename) {
//             throw Error('Username already exists, Please Change your Username');
//         } else if (!password) {
//             throw Error('Password is Required, Please Field your Password');
//         }
//     }

//     const user = await insertUser(newUserData);
//     return user;
// }



export const deteleUserById = async (id: string): Promise<void> => {
    try {
        await getUserById(id);

        await deleteUser(id);
    } catch (error) {
        throw error;
    }

};

export const putUserById = async (id: string, userData: User): Promise<User | null> => {
    try {
        await getUserById(id);

        const user = await updateUserById(id, userData);
        return user;
    } catch (error) {
        throw error;
    }

}

export const patchUserById = async (id: string, userData: User): Promise<User | null> => {
    try {
        await getUserById(id);

        const user = await updateUserById(id, userData);
        return user;
    } catch (error) {
        throw error;
    }

}