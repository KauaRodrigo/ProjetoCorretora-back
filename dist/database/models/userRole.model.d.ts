import { Model } from "sequelize-typescript";
import { User } from "./user.model";
import Roles from "./role.model";
export default class UserRole extends Model {
    userId: number;
    roleId: number;
    user: User;
    role: Roles;
}
