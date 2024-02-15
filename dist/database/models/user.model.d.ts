import { Model } from "sequelize-typescript";
import Roles from "./role.model";
export declare class User extends Model {
    name: string;
    email: string;
    password: string;
    roles: Roles[];
}
