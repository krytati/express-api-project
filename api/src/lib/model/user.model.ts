import {model, Model, Schema} from 'mongoose';

export type User = {
    userName: string,
    firstName: string,
    lastName: string,
};

export const UserSchema = new Schema<User>(
    {
        userName: {type: String, required: true, index: true },
        firstName: {type: String, required: true },
        lastName: {type: String, required: true },
    },
    { versionKey: false }
);

export const UserModel: Model<User> = model('UserModel', UserSchema);