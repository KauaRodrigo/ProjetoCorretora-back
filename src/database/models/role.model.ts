import { BelongsToMany, Column, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import UserRole from "./userRole.model";

@Table({
    schema: 'frcorretora',
    tableName: 'roles'
})
export default class Roles extends Model {
    @Column
    name: string

    @BelongsToMany(() => User, () => UserRole)
    users: User[];
}