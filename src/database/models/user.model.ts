import { BelongsToMany, Column, ForeignKey, Model, Table } from "sequelize-typescript";
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

    @BelongsToMany(() => Roles, () => UserRole)
    roles: Roles[];
}