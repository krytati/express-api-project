import {cleanDbData, connectToDb, disconnectDb} from "../db/mongodb.memory.ts";
import {prepareDb} from "../lib/utils/prepareDB.ts";
import {appPassword} from "../lib/auth.ts";
import {StatusCodes} from "http-status-codes";
import {paths} from "../lib/routes/paths.ts";
import mongoose from "mongoose";
import {UserModel} from "../lib/model/user.model.ts";
import supertest from "supertest";
import {app} from "../lib/app.ts";

describe('auth', () =>{
    beforeAll(() => connectToDb());

    afterEach(() => {
        cleanDbData();
        prepareDb();
    });

    afterAll(() => disconnectDb());

    const testData = [
        { user: 'user1', status: StatusCodes.OK },
        { user: 'user000', status: StatusCodes.UNAUTHORIZED },
    ];

    testData.forEach((dataSet) => {
        test(`${paths.userById} ${dataSet.user}`, async () => {
            const expectedId =  new mongoose.Types.ObjectId();
            const expectedUser = {
                _id: expectedId,
                userName: 'expectedUserName',
                firstName: 'expectedFirstName',
                lastName: 'expectedLastName',
            };
            await UserModel.create(expectedUser);
            const expectedRoute = paths.userById.replace(':id', expectedId.toString());
            const b64auth = Buffer.from(`${dataSet.user}:${appPassword}`).toString('base64');

            const actualResponse = await supertest(app)
                .get(expectedRoute)
                .set('Authorization', `basic ${b64auth}`);

            expect(actualResponse.status).toBe(dataSet.status);
        });
    });
});