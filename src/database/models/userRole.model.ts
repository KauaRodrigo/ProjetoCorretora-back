import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import Roles from "./role.model";

@Table({    
    tableName: 'user_role'
})
export default class UserRole extends Model {
    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Roles)
    @Column
    roleId: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Roles)
    role: Roles;
}