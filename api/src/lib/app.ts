import express from "express";
import router from "./routes/router.ts";

export const app = express().use('/', router);