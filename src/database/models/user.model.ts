import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import Roles from "./role.model";
import UserRole from "./userRole.model";

@Table({    
    tableName: 'users'
})
export class User extends Model {
    @Column
    name: string

    @Column
    email: string

    @Column
    password: string

    @Column(DataType.DATE)
    resetTokenExpires: Date

    @Column(DataType.TEXT)
    resetToken: string

    @BelongsToMany(() => Roles, () => UserRole)
    roles: Roles[];
}