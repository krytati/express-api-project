import http from 'http';
import express  from "express";
import dotenv from "dotenv";
import router from "./routes/router.ts";
import {connectToDb, disconnectDb} from "../db/mongodb.memory.ts";

dotenv.config();
const app = express()
    .use('/', router)
    .on('close', disconnectDb);

const port = process.env.PORT;
const server = http.createServer(app);
const startServer = async () => {

    await connectToDb();
    server.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });
};

process.on('SIGINT', () => server.close(() => process.exit(0)));

server.on('close', function() {
    console.log('The server was successfully stopped ');
});

startServer().then( () => console.log('The server was successfully created') );