import {connectToDb, disconnectDb} from "../db/mongodb.memory.ts";
import mongoose from "mongoose";
import supertest from "supertest";
import {paths} from "../lib/routes/paths.ts";
import {StatusCodes} from "http-status-codes";
import {app} from "../lib/app.ts";
import {createTestUser, createTestUserAndGenerateToken} from "./testUtils/createUser.ts";
import {usersData} from "../lib/utils/usersData.ts";

describe('users', () => {

    beforeEach( () => connectToDb());
    afterEach( () => disconnectDb());

    describe('sign in', () => {
        test('WHEN existed username was sent SHOULD return the token', async () => {
           const expectedUserName= 'expectedTestUserName';
           const expectedToken = await createTestUserAndGenerateToken({ userName: expectedUserName });
           const expectedRoute = paths.signIn;
           const expectedRequestBody = { userName: expectedUserName };

           const actualResponse = await supertest(app).post(expectedRoute).send(expectedRequestBody);

           expect(actualResponse.status).toBe(StatusCodes.OK);
           expect(actualResponse.body.jwt).toEqual(expectedToken);
           expect(actualResponse.body.user).toEqual(expectedUserName);
        });
        test('WHEN not existed username was sent SHOULD return an error', async () => {
            const expectedUserName= 'expectedTestUserName';
            const expectedRoute = paths.signIn;
            const expectedRequestBody = { userName: expectedUserName }
            const expectedError = 'Not authorized';

            const actualResponse = await supertest(app).post(expectedRoute).send(expectedRequestBody);

            expect(actualResponse.status).toBe(StatusCodes.BAD_REQUEST);
            expect(actualResponse.body.message).toEqual(expectedError);
        });
        test('WHEN username was not sent SHOULD return an error', async () => {
            const expectedRoute = paths.signIn;
            const expectedError = 'Username should be sent';

            const actualResponse = await supertest(app).post(expectedRoute);

            expect(actualResponse.status).toBe(StatusCodes.BAD_REQUEST);
            expect(actualResponse.body.message).toEqual(expectedError);
        });
    });

    describe('token', () => {
        test('WHEN auth was not provided SHOULD return an error', async () => {
            const expectedRoute = paths.list;

            const actualResponse = await supertest(app).get(expectedRoute);

            expect(actualResponse.status).toBe(StatusCodes.UNAUTHORIZED)
        });
        test('WHEN token was provided SHOULD return OK', async () => {
            const expectedRoute = paths.list;
            const expectedToken = await createTestUserAndGenerateToken();

            const actualResponse = await supertest(app)
                .get(expectedRoute)
                .set('Authorization', `Bearer ${expectedToken}`);

            expect(actualResponse.status).toBe(StatusCodes.OK);
            expect(actualResponse.body.users).toHaveLength(6);
        });
        test('WHEN wrong token was provided SHOULD return an error', async () => {
            const expectedRoute = paths.list;
            const expectedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InVzZXI0IiwiaWF0IjoxNzE2ODI4ODI3LCJleHAiOjE3MTY4MzI0Mjd9.IsxBnoUmj5-ge-shlTGR1PgJykr5wN_wLCllXssb0Jo';

            const actualResponse = await supertest(app)
                .get(expectedRoute)
                .set('Authorization', `Bearer ${expectedToken}`);

            expect(actualResponse.status).toBe(StatusCodes.UNAUTHORIZED);
        });
    })

    describe('get', () => {
        test('WHEN correct id was sent SHOULD return user', async () => {
            const expectedId = new mongoose.Types.ObjectId();
            await createTestUser({
                _id: expectedId,
                userName: 'expectedUserName',
                firstName: 'expectedFirstName',
                lastName: 'expectedLastName',
            });
            const expectedResponseBody = {
                _id: expectedId.toString(),
                userName: 'expectedUserName',
                firstName: 'expectedFirstName',
                lastName: 'expectedLastName',
            };
            const expectedToken = await createTestUserAndGenerateToken();
            const expectedRoute = paths.userById.replace(':id', expectedId.toString());

            const actualResponse = await supertest(app)
                .get(expectedRoute)
                .set('Authorization', `Bearer ${expectedToken}`);

            expect(actualResponse.status).toBe(StatusCodes.OK);
            expect(actualResponse.body.user).toMatchObject(expectedResponseBody);
        });
        test('WHEN incorrect id was sent SHOULD return an error', async () => {
            const expectedId = new mongoose.Types.ObjectId();
            const expectedError = 'User does not exist';
            const expectedRoute = paths.userById.replace(':id', expectedId.toString());
            const expectedToken = await createTestUserAndGenerateToken();

            const actualResponse = await supertest(app)
                .get(expectedRoute)
                .set('Authorization', `Bearer ${expectedToken}`);

            expect(actualResponse.status).toBe(StatusCodes.NOT_FOUND);
            expect(actualResponse.body.message).toEqual(expectedError);
        });
    });

    describe('get all users', () => {
        test('SHOULD return list of users', async () => {
            const expectedUserData = {
                userName: 'expectedUserName',
                firstName: 'expectedFirstName',
                lastName: 'expectedLastName',
            };
            const expectedResponseBody = [expectedUserData, ...usersData];
            const expectedToken = await createTestUserAndGenerateToken(expectedUserData);
            const expectedRoute = paths.list;

            const actualResponse = await supertest(app)
                .get(expectedRoute)
                .set('Authorization', `Bearer ${expectedToken}`);

            expect(actualResponse.status).toBe(StatusCodes.OK);
            expect(actualResponse.body.users).toMatchObject(expectedResponseBody);
        });
    });

    describe('create', () => {
        test('WHEN new user data was sent SHOULD return user', async () => {
            const expectedUserData = {
                userName: 'expectedUserName',
                firstName: 'expectedFirstName',
                lastName: 'expectedLastName',
            };
            const expectedToken = await createTestUserAndGenerateToken();
            const expectedRoute = paths.createUser;
            const requestBody = { user: expectedUserData };

            const actualResponse = await supertest(app)
                .post(expectedRoute)
                .send(requestBody)
                .set('Authorization', `Bearer ${expectedToken}`);

            expect(actualResponse.status).toBe(StatusCodes.CREATED);
            expect(actualResponse.body.user).toMatchObject(expectedUserData);
        });
        test('WHEN duplicated userName was sent SHOULD return an error', async () => {
            const expectedError = 'A user with the same username already exists';
            const expectedUserData = {
                userName: 'DuplicatedUserName',
                firstName: 'FirstName',
                lastName: 'LastName',
            };
            await createTestUser({ userName: 'DuplicatedUserName' });
            const expectedToken = await createTestUserAndGenerateToken();
            const expectedRoute = paths.createUser;
            const requestBody = { user: expectedUserData };

            const actualResponse = await supertest(app)
                .post(expectedRoute)
                .send(requestBody)
                .set('Authorization', `Bearer ${expectedToken}`);

            expect(actualResponse.status).toBe(StatusCodes.BAD_REQUEST);
            expect(actualResponse.body.message).toEqual(expectedError);
        });
    });
});
