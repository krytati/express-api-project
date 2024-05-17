import {cleanDbData, connectToDb, disconnectDb} from "../db/mongodb.memory.ts";
import mongoose from "mongoose";
import {UserModel} from "../lib/model/user.model.ts";
import supertest from "supertest";
import {paths} from "../lib/routes/paths.ts";
import {StatusCodes} from "http-status-codes";
import {prepareDb} from "../lib/utils/prepareDB.ts";
import {app} from "../lib/app.ts";

describe('users', () => {

    beforeAll(() => connectToDb());

    afterEach(() => {
        cleanDbData();
        prepareDb();
    });

    afterAll(() => disconnectDb());

    describe('get', () => {
        test('WHEN correct id was sent SHOULD return user', async () => {
            const expectedId = new mongoose.Types.ObjectId();
            const expectedUser = {
                _id: expectedId,
                userName: 'expectedUserName',
                firstName: 'expectedFirstName',
                lastName: 'expectedLastName',
            };
            await UserModel.create(expectedUser);
            const expectedRoute = paths.userById.replace(':id', expectedId.toString());

            const actualResponse = await supertest(app).get(expectedRoute);

            expect(actualResponse.status).toBe(StatusCodes.OK);
            expect(actualResponse.body.user).toEqual(JSON.stringify(expectedUser));
        });
        test('WHEN incorrect id was sent SHOULD return an error', async () => {
            const expectedId = new mongoose.Types.ObjectId();
            const expectedError = 'User does not exist';
            const expectedRoute = paths.userById.replace(':id', expectedId.toString());

            const actualResponse = await supertest(app).get(expectedRoute);

            expect(actualResponse.status).toBe(StatusCodes.NOT_FOUND);
            expect(actualResponse.body.message).toEqual(expectedError);
        });
    });
});
