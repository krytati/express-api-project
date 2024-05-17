import {cleanDbData, connectToDb, disconnectDb} from "../db/mongodb.memory.ts";
import mongoose, {set} from "mongoose";
import {UserModel} from "../lib/model/user.model.ts";
import supertest from "supertest";
import {paths} from "../lib/routes/paths.ts";
import {StatusCodes} from "http-status-codes";
import {prepareDb} from "../lib/utils/prepareDB.ts";
import {app} from "../lib/app.ts";
import {appPassword} from "../lib/auth.ts";

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
            const b64auth = Buffer.from(`user1:${appPassword}`).toString('base64');

            const actualResponse = await supertest(app).get(expectedRoute).set('Authorization', `basic ${b64auth}`);

            expect(actualResponse.status).toBe(StatusCodes.OK);
            expect(actualResponse.body.user).toEqual(JSON.stringify(expectedUser));
        });
        test('WHEN incorrect id was sent SHOULD return an error', async () => {
            const expectedId = new mongoose.Types.ObjectId();
            const expectedError = 'User does not exist';
            const expectedRoute = paths.userById.replace(':id', expectedId.toString());
            const b64auth = Buffer.from(`user1:${appPassword}`).toString('base64');

            const actualResponse = await supertest(app).get(expectedRoute).set('Authorization', `basic ${b64auth}`);

            expect(actualResponse.status).toBe(StatusCodes.NOT_FOUND);
            expect(actualResponse.body.message).toEqual(expectedError);
        });
    });

    describe('get', () => {
        test('WHEN new user data was sent SHOULD return user', async () => {
            const expectedUserData = {
                userName: 'expectedUserName',
                firstName: 'expectedFirstName',
                lastName: 'expectedLastName',
            };

            const b64auth = Buffer.from(`user1:${appPassword}`).toString('base64');

            const expectedRoute = paths.createUser;
            const requestBody = {
                user: expectedUserData
            };

            const actualResponse = await supertest(app)
                .post(expectedRoute)
                .send(requestBody)
                .set('Authorization', `basic ${b64auth}`);

            expect(actualResponse.status).toBe(StatusCodes.CREATED);
            expect(actualResponse.body.user).toMatchObject(expectedUserData);
        });
        test('WHEN duplicated userName was sent SHOULD return an error', async () => {
            const expectedError = 'A user with the same user name already exists';
            const expectedUserData = {
                userName: 'user4',
                firstName: 'expectedFirstName',
                lastName: 'expectedLastName',
            };
            const b64auth = Buffer.from(`user1:${appPassword}`).toString('base64');
            const expectedRoute = paths.createUser;
            const requestBody = {
                user: expectedUserData
            };

            const actualResponse = await supertest(app)
                .post(expectedRoute)
                .send(requestBody)
                .set('Authorization', `basic ${b64auth}`);

            expect(actualResponse.status).toBe(StatusCodes.BAD_REQUEST);
            expect(actualResponse.body.message).toEqual(expectedError);
        });
    });
});
