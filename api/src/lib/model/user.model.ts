import {Document, model, Model, Schema} from 'mongoose';

export type User = {
    userName: string,
    firstName: string,
    lastName: string,
};

type UserDoc = User & Document;

export const UserSchema = new Schema<UserDoc>(
    {
        userName: { type: String, required: true, unique: true, index: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    { versionKey: false }
);

export const UserModel: Model<UserDoc> = model('UserModel', UserSchema);