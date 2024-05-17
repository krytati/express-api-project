import express from "express";
import router from "./routes/router.ts";
import basicAuth from 'express-basic-auth';
import {authorizer, getUnauthorizedResponse} from "./auth.ts";

export const app = express()
    .use(basicAuth({
        authorizer: authorizer,
        unauthorizedResponse: getUnauthorizedResponse,
        authorizeAsync: true,
    }))
    .use(express.json())
    .use(express.urlencoded({ extended: true}))
    .use('/', router);
