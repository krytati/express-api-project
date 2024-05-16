import {cleanDbData, connectToDb, disconnectDb} from "../db/mongodb.memory.ts";
import mongoose from "mongoose";
import {UserModel} from "../lib/model/user.model.ts";
import {prepareDb} from "../lib/utils/prepareDB.ts";

describe('UserModel', () => {

    beforeAll(() => connectToDb());
    afterEach(() => {
        cleanDbData();
        prepareDb();
    });
    afterAll(() => disconnectDb());

    describe('find', () => {
        test('WHEN correct id was sent SHOULD return user document', async () => {
            const expectedId = new mongoose.Types.ObjectId();
            const expectedUser = {
                _id: expectedId,
                userName: 'user1',
                firstName: 'fname1',
                lastName: 'lname1',
            };
            await UserModel.create(expectedUser);

            const actualUser = await UserModel.findById(expectedId).lean();

            expect(actualUser).toMatchObject(expectedUser);
        });
        test('WHEN incorrect id was sent SHOULD return null', async () => {
            const expectedId = new mongoose.Types.ObjectId();

            const actualUser = await UserModel.findById(expectedId).lean();

            expect(actualUser).toBeNull();
        });
    });
});
