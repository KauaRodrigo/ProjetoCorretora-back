import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import Sinistro from "./sinistro.model";

@Table({
    tableName: 'endereco',
    timestamps: true
})
export default class Adress extends Model {
    @Column(DataType.BIGINT)
    cep: number

    @Column
    cidade: string

    @Column
    estado: string

    @Column
    rua: string

    @Column
    bairro: string

    @HasMany(() => Sinistro)
    sinistros: Sinistro[]
}