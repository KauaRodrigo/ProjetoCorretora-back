import { Model } from "sequelize-typescript";
import { User } from "./user.model";
export default class Roles extends Model {
    name: string;
    users: User[];
}
