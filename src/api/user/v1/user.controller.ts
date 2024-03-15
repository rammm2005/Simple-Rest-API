import express from "express";
import { getAllUsers, getUserById, deteleUserById, patchUserById, putUserById } from "./user.service";
// import { createAccount } from "./user.repository";
import { signUp } from "./user.repository";
const userController = express.Router();
import { generateRandomString } from "../../helpers/authUser";
import { generateAccessToken } from "../../libs/jwtUser";




userController.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await getUserById(userId);
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).send("Unexpected error occurred.");
        }
    }

});





// userController.post('/', async (req, res) => {

//     try {
//         const newUserData = req.body;

//         if (accessTokenSecret) {
//             const eccessToken = jwt.sign(newUserData, accessTokenSecret);
//             // console.log(eccessToken);
//             const user = await createUser(newUserData);
//             res.status(201).send({ msg: "New User Successfully Created !", data: user, eccessToken });
//         } else {
//             console.error('ACCESS_TOKEN_SECRET environment variable not found');
//         }

//     } catch (error) {
//         if (error instanceof Error) {
//             return res.status(400).send({ error: error.message });
//         } else {
//             res.status(500).send("Unexpected error occurred.");
//         }
//     }
// });


userController.post('/', async (req, res) => {
    try {
        const {newUserData} = req.body;
        // console.log(eccessToken);
        const user = await signUp(newUserData);
        console.log(user);
        res.status(201).send({ msg: "Your Account Successfully Created, Please Check your Email to Activated your Account !", data: { user} });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).send({ error: error.message });
        } else {
            res.status(500).send("Unexpected error occurred.");
        }
    }

});


userController.delete("/:userId", async (req, res) => {

    try {
        const id = req.params.userId;

        await deteleUserById(id);

        res.status(200).send("User Deleted Successfull !");
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).send({ error: error.message });
        } else {
            res.status(500).send("Unexpected error occurred.");
        }
    }

});


userController.put("/:userId", async (req, res) => {
    const id = req.params.userId;
    const userData = req.body;

    try {

        if (!(userData.name && userData.username && userData.email && userData.password && userData.image && userData.status && userData.Role)) {
            return res.status(400).send({ msg: "Some Field is Missing !" });
        }

        const putUser = await patchUserById(id, userData);

        res.status(200).send({
            msg: "The User Data Updated Successful !",
            data: putUser,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).send({ error: error.message });
        } else {
            res.status(500).send("Unexpected error occurred.");
        }
    }

});


userController.patch("/:userId", async (req, res) => {
    const id = req.params.userId;
    const userData = req.body;

    try {
        const updateUser = await patchUserById(id, userData);

        res.status(200).send({
            msg: "User Updated Successful !",
            data: updateUser,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).send({ error: error.message });
        } else {
            res.status(500).send("Unexpected error occurred.");
        }
    }
});


userController.get("/", async (req, res) => {
    const users = await getAllUsers();

    res.send(users);
});

export default userController;