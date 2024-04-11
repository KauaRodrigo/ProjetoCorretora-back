import {Column, HasMany, Model, Table} from "sequelize-typescript";
import Cliente from "./clientes.model";

@Table({
    tableName: 'seguradora'
})
export default class Seguradora extends Model {

    @Column
    nome: string

    @HasMany(() => Cliente)
    clientes: Cliente[]

}