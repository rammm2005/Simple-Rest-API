import express, { CookieOptions } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import dotenv from 'dotenv';
import cors from "cors";
import passport from "passport";
import session from 'express-session';
import { sessionConfig } from "./api/libs/sessionConfig";

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(cors({
    credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log('🛢️ Express Server API Running in : ' + server.address() + PORT);
});




// Router Request
import tourController from "./api/tour/v1/tour.controller";
app.use("/tours", tourController);

import userController from "./api/user/v1/user.controller";
app.use("/users", userController);



// User Authentication
import { Logout, googleStrategy } from "./api/libs/goggleAuth";
app.get('/auth/logout', Logout);
if (googleStrategy) {
    app.get('/', passport.authenticate(googleStrategy));
    app.get('/auth/google/callback', passport.authenticate(googleStrategy), (req, res) => {
        let successRedirect = '/';
        let failureRedirect = '/login';


        if (successRedirect) {
            return res.send({ msg: 'Success!, Redireting Successfully', successRedirect }).status(200);
        }

        return res.send({ msg: 'Error When Redirecting', failureRedirect }).status(401);
    });

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user: undefined, done) {
        done(null, user);
    });
} else {
    app.use("/users", userController);
}

import authUser from "./api/helpers/authUser";

app.use(authUser);


console.log("hellow Typescipt");