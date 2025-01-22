import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {prepareDb} from "../lib/utils/prepareDB.ts";

let mongoDb: MongoMemoryServer;

export const connectToDb = async (): Promise<void> => {
    mongoDb = await MongoMemoryServer.create();
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoDb.getUri());
    await prepareDb();
};

export const cleanDbData = async (): Promise<void> => {
    await mongoose.connection.db.dropDatabase();
};

export const disconnectDb = async (): Promise<void> => {
    await mongoose.disconnect();
    await mongoDb.stop();
};