import express from "express";
import {controller} from "../controllers/controller.ts";
import {paths} from "./paths.ts";

const router = express.Router();
router.get(paths.userById, controller.getUserById);

export default router;
