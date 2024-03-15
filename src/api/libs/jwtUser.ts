import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
const accessToken = process.env.ACCESS_TOKEN_SECRET as string;
const refreshToken = process.env.REFRESH_TOKEN_SECRET as string;


export async function generateAccessToken(user: any) {
    if (accessToken) {
        return jwt.sign({ userId: user.id }, accessToken, {
            expiresIn: '5m',
        });
    }
}

export async function generateRefreshToken(user: User, jti: string) {
    if (refreshToken) {
        return jwt.sign({
            userId: user.id,
            jti
        }, refreshToken, {
            expiresIn: '8h',
        });
    }
}


export async function generateTokens(user: User, jti: string) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);

    return {
        accessToken,
        refreshToken,
    };
}


export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const user = req.body.user;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(' ')[1];
    const access_token = await generateAccessToken(user) as string;

    try {
        if (!token) { return res.status(403) } else {
            const decoded = await jwt.verify(token, access_token);

        }
        const decoded = await jwt.verify(token, access_token);
        if (typeof decoded === 'object' && 'username' in decoded) {
            req.user = decoded.username;
            next();
        } else {
            return res.status(403).json({ message: "Invalid token format" });
        }
    } catch (err: any) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: "Invalid token signature" });
        } else {
            console.error("Error during JWT verification:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
};




// type DecodedType = User | null | jwt.VerifyErrors;

// interface RequestWithBody extends Request {
//   newUserData?: DecodedType;
// }

// export const authentication = (req: RequestWithBody, res: Response, next: NextFunction) => {
//   const accessToken = process.env.ACCESS_TOKEN_SECRET;
//   const newUserData = req.body;
//   const authHeader = req.headers['authorization'];
//   if (authHeader) {
//     const token: string | undefined = authHeader && authHeader.split(' ')[1];
//     if (token === null) return res.status(401);

//     if (accessToken) {
//       jwt.verify(token, accessToken, (decoded, error) => {
//         if (error) res.sendStatus(403);
//         else req.newUserData = decoded;

//         next();
//       });
//     } else {
//       res.status(401).json({ error: "Can Process The Token From Envorment Request" });
//     }
//   }
// };