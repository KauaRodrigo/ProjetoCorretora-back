import {Column, Model, Table} from "sequelize-typescript";

@Table({
    tableName: 'endereco',
    timestamps: true
})
export default class Adress extends Model {
    @Column
    rua: string

    @Column
    bairro: string

    @Column
    complemento: string

    @Column
    numero: number



}