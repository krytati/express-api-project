import basicAuth from "express-basic-auth";
import {UserModel} from "./model/user.model.ts";

export const appPassword = 'reallyStrongPassword';
const checkUser = async (name: string): Promise<boolean> => {
    try {
        const user = await UserModel.exists({ userName: name });
        return !!user;
    } catch (error) {
        return false;
    }
};

export const authorizer = async (username: string, password: string, authorize: any)  => {
    const userMatches = await checkUser(username);
    const passwordMatches = basicAuth.safeCompare(password, appPassword);
    return authorize(null, userMatches && passwordMatches);
};

export const getUnauthorizedResponse = (req: basicAuth.IBasicAuthedRequest)=> {
    return req.auth ? { message: 'Credentials are invalid' } : { message: 'No credentials provided' }
};