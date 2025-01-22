import {UserModel} from "./model/user.model.ts";
import jwt from "jsonwebtoken";

type Payload = { userName: string };

export const appSecret = 'reallyStrongPassword';
export const algorithm = 'HS256';

export const generateToken = async (payload: Payload): Promise<string> => {
    const userMatches = await checkUser(payload.userName);
    if (userMatches) {
        return jwt.sign(
            payload,
            appSecret,
            { expiresIn: '1h', algorithm: algorithm}
        );
    } else {
        throw { message: 'Not authorized' };
    }
};

const checkUser = async (name: string): Promise<boolean> => {
    try {
        const user = await UserModel.exists({ userName: name });
        return !!user;
    } catch (error) {
        return false;
    }
};