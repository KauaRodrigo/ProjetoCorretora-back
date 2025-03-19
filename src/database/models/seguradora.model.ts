import {Column, HasMany, Model, Table} from "sequelize-typescript";
import Cliente from "./clientes.model";

@Table({
    tableName: 'seguradora',
    paranoid: true
})
export default class Seguradora extends Model {

    @Column
    nome: string

    @Column
    status: number

    @HasMany(() => Cliente)
    clientes: Cliente[]

}