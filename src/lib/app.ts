import express from "express";
import router from "./routes/router.ts";
import {algorithm, appSecret} from "./auth.ts";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import {paths} from "./routes/paths.ts";

const getTokenFromHeader = (req: JWTRequest) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
};

export const app = express()
    .use(express.json())
    .use(express.urlencoded({ extended: true}))
    .use(expressjwt({
        secret: appSecret,
        algorithms: [algorithm],
        getToken: getTokenFromHeader,
    }).unless({ path: [paths.signIn] }))
    .use('/', router);
