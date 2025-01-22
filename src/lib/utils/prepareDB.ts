import {UserModel} from "../model/user.model.ts";
import {usersData} from "./usersData.ts";

export const prepareDb = () => UserModel.insertMany(usersData);