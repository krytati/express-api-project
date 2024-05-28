import {Request, Response} from "express";
import {UserModel} from "../model/user.model.ts";
import {StatusCodes} from "http-status-codes";
import {generateToken} from "../auth.ts";
export const controller = {
    async signIn(request: Request, response: Response) {
        const userName = request.body.userName;
        if (!userName) {
            response.status(StatusCodes.BAD_REQUEST).send({ message: 'Username should be sent' });
            return;
        }
        try {
            const token = await generateToken( { userName: userName });
            response.send( { user: userName, jwt: token });
        } catch (err) {
            response.status(StatusCodes.BAD_REQUEST).send({ message: getText(err) });
        }
    },
    async list(request: Request, response: Response) {
        try {
            const users = await UserModel.find().lean();
            users.sort((a, b) => a.userName.localeCompare(b.userName) )
            response.send( { users: users });
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST).send({ message: `BD error: ${getText(error)}` });
        }
    },
    async getUserById(request: Request, response: Response) {
        const userId = request.params.id;
        if (!userId) {
            response.status(StatusCodes.BAD_REQUEST).send({ message: 'User id should be sent' });
            return;
        }
        try {
            const user = await UserModel.findById(userId).lean();
            if (!user) {
                response.status(StatusCodes.NOT_FOUND).send({ message: 'User does not exist' });
            } else {
                response.send( { user: user });
            }
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST).send({ message: `BD error: ${getText(error)}` });
        }
    },
    async createUser(request: Request, response: Response) {
        const user = request.body?.user;
        if (!user) {
            response.status(StatusCodes.BAD_REQUEST).send({ message: 'Empty user' });
            return;
        }
        try {
            const existedUser = await UserModel.exists({ userName: user.userName });
            if (existedUser) {
                response.status(StatusCodes.BAD_REQUEST).send(
                    { message: 'A user with the same username already exists' }
                );
            }
            const newUser = await UserModel.create(user);
            response.status(StatusCodes.CREATED).send( { user: newUser });
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST).send({ message: `BD error: ${getText(error)}` });
        }
    },
}

const getText = (err: any): string => err.message ?? '';