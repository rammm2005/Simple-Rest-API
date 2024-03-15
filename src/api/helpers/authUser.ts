import express, { Request, Response, CookieOptions, NextFunction  } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../../db/server";
import { randomBytes } from 'crypto';
import { findAccountById, findAccountByUserId, findUserByEmail, findUserById, findUserByUsername } from "../user/v1/user.repository";
import { registerUser, registAccount } from "../user/v1/user.repository";
import { generateAccessToken } from "../libs/jwtUser";
import { User } from "@prisma/client";


const authUser = express.Router();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

async function generateSecureTokens(user: User) {
  const accessToken = jwt.sign({ userId: user.id }, accessTokenSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user.id }, refreshTokenSecret, { expiresIn: '7d' });

  return {
    accessToken,
    refreshToken,
  };
}


export async function Verify(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header required." });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme.toLowerCase() !== 'bearer') {
      return res.status(401).json({ message: "Invalid authorization header format." });
    }

    jwt.verify(token, accessTokenSecret, async (err: any, decoded: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: "Your Session has Expired. Please Login again." });
        } else {
          return res.status(401).json({ message: "Unauthorized access. Not Allowed" });
        }
      }

      const { id } = decoded;
      const users = req.user;

      const user = await findUserById(id);

      if (!user) {
        return res.status(401).json({ message: "Unauthorized access. Not Allowed" }); 
      }

      const safeUser = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      req.user = safeUser;
      next();
    });
  } catch (error) {
    console.error("Error during verification:", error);
    return res.status(500).json({ message: "Internal server error." }); 
  }
}



async function verifyRefreshToken(refreshToken: string) {
  try {
    const decodedToken = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload;

    if (typeof decodedToken !== 'object' || !decodedToken?.exp) {
      throw new Error('Invalid refresh token');
    }

    if (Date.now() >= decodedToken.exp * 1000) {
      throw new Error('Your Refresh token has Been expired');
    }

    return decodedToken.userId;
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    throw new Error('Invalid refresh token');
  }
}

async function comparePassword(hashedPassword: string, plainTextPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Internal server error");
  }
}



export async function generateRandomString(length: number = 32): Promise<string> {
  const randomBuffer = randomBytes(Math.ceil(length / 2));
  const randomString = randomBuffer.toString('hex').slice(0, length);

  return randomString;
}


authUser.post("/auth/register", async (req, res) => {
  try {
    const user = req.body;

    const { username, email, password } = user;
    const status = false;

    if (!username || !email || !password) {
      return res.status(401).json({
        status: 401,
        message: "Missing required fields. Please provide username, email, and password.",
      });
    }


    const isEmailAllReadyExist = await findUserByEmail(email);
    const isUserNameAllReadyExist = await findUserByUsername(username);

    if (isEmailAllReadyExist) {
      res.status(401).json({
        status: 401,
        message: "Email  AllReady Exits or In Use, Please Use different Email Address",
      });
      return;
    }

    if (isUserNameAllReadyExist) {
      res.status(401).json({
        status: 401,
        message: "Username AllReady In Use, Please Choose Different Username",
      });
      return;
    }


    const type = "Email";
    const provider = "Email Service";
    const providerAccountId = await generateRandomString(36);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await registerUser(username, email, hashedPassword, status);
    const userId = newUser.id;

    const newAccount = await registAccount(userId, type, provider, providerAccountId);

    res.status(200).json({
      status: 201,
      success: true,
      message: "Your Account Registered Successfull",
      user: newUser,
      account: newAccount,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

authUser.get("/v1/user", Verify, (req, res) => {
  res.status(200).json({
      status: "success",
      message: "Welcome to the your Dashboard!",
  });
});


authUser.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Account not found. Please check your email address."
      });
    }

    const isPasswordMatched = await comparePassword(user.password, password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Incorrect password. Please try again, Make sure your Password is correct."
      });
    }

    const { accessToken, refreshToken } = await generateSecureTokens(user);
    const account = await findAccountByUserId(user.id);

    if (!account) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Eror When Updating Account. Please try again."
      });
    }

    const updatedAccount = await prisma.account.update({
      where: { id: account.id },
      data: {
        provider: account?.provider,
        providerAccountId: account?.providerAccountId,
        type: account?.type,
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });

    let options: CookieOptions  = {
      maxAge: 20 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.cookie("SessionID", accessToken, options);
    return res.status(200).json({
      status: 200,
      success: true,
      account: updatedAccount,
      message: "Your Account Was Login successfully",
      token: accessToken
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "An error occurred during login. Please try again later."
    });
  }
});


authUser.post("auth/logout", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const user = await prisma.account.findFirst({ where: { access_token: token } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.account.update({ where: { id: user.id }, data: { access_token: null } });

    return res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


export default authUser;