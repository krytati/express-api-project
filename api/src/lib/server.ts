import dotenv from "dotenv";
import {connectToDb, disconnectDb} from "../db/mongodb.memory.ts";
import {app} from "./app.ts";

const startServer = async () => {
    try {
        await connectToDb();
        dotenv.config();
        const port = process.env.PORT;
        app.listen(port, () => console.log(`http://localhost:${port}`));
    } catch(err) {
        console.log(err);
    }
};

process.on("SIGINT", async() => {
    await disconnectDb();
    console.log('The server was successfully stopped ');
    process.exit();
});

startServer().then( () => console.log('The server was successfully created') );