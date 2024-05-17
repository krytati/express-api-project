import {Request,Response} from "express";
import {UserModel} from "../model/user.model.ts";
import {StatusCodes} from "http-status-codes";
export const controller = {
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
                response.send( { user: JSON.stringify(user) });
            }
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST).send('BD error');
        }
    },
    async createUser(request: Request, response: Response) {
        const user = request.body?.user;
        if (!user) {
            response.status(StatusCodes.BAD_REQUEST).send({ message: 'Empty user' });
            return;
        }
        try {
            const existedUser = await UserModel.findOne({ userName: user.userName }).lean();
            if (existedUser) {
                response.status(StatusCodes.BAD_REQUEST).send(
                    { message: 'A user with the same user name already exists' }
                );
            }
            const newUser = await UserModel.create(user);
            response.status(StatusCodes.CREATED).send( { user: newUser });
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST).send({ message: 'BD error' });
        }
    },
}