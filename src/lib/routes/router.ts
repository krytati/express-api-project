import express from "express";
import {controller} from "../controllers/controller.ts";
import {paths} from "./paths.ts";

const router = express.Router()
    .post(paths.signIn, controller.signIn)
    .get(paths.list, controller.list)
    .get(paths.userById, controller.getUserById)
    .post(paths.createUser, controller.createUser);

export default router;
