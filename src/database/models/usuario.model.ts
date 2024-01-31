import { Column, Model, Table } from "sequelize-typescript";

@Table({
    schema: 'frcorretora',
    tableName: 'usuarios'  
})
export class Usuarios extends Model {
    @Column
    name: string

    @Column
    email: string

    @Column
    password: string
}