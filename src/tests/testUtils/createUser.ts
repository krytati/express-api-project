import {UserModel} from "../../lib/model/user.model.ts";
import mongoose from "mongoose";
import {generateToken} from "../../lib/auth.ts";
import {randomInt} from "crypto";

export const createTestUser = async (
    {
        _id,
        userName,
        firstName,
        lastName,
    }: {
        _id?: mongoose.Types.ObjectId,
        userName?: string,
        firstName?: string,
        lastName?: string,
    } = {}
) => {
    const expectedId = new mongoose.Types.ObjectId();
    const randomPart = randomInt(1000);
    const expectedUser = {
        _id: _id ?? expectedId,
        userName: userName ?? ('expectedUserName_' + randomPart),
        firstName: firstName ?? ('expectedFirstName_' + randomPart),
        lastName: lastName ?? ('expectedLastName_' + randomPart),
    };
    return await UserModel.create(expectedUser);
};

export const createTestUserAndGenerateToken = async (
    data: {
        _id?: mongoose.Types.ObjectId,
        userName?: string,
        firstName?: string,
        lastName?: string,
    } = {}
) => {
   const user = await createTestUser(data);
   return generateToken({ userName: user.userName });
}