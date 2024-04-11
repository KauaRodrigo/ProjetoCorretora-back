import {AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, NotNull, Table} from "sequelize-typescript";
import { StatusSinistro } from "../../enums/statusSinistro";
import { TipoSinistro } from "../../enums/tipoSinistros"
import Cliente from "./clientes.model";
import Seguradora from "./seguradora.model";

@Table({
    tableName: 'sinistros',
    paranoid: true
})
export default class Sinistro extends Model {
    @Column(DataType.BIGINT)
    codigo: number

    @Column
    placa: string

    @Column
    evento: string

    @Column
    terceiro: boolean

    @Column
    caminho: string

    @Column(DataType.ENUM(...Object.values(TipoSinistro)))
    tipo: TipoSinistro

    @Column(DataType.ENUM(...Object.values(StatusSinistro)))
    status: StatusSinistro

    @AllowNull
    @Column(DataType.DATE)
    deletedAt: Date

    @ForeignKey(() => Cliente)
    @Column({
        field: 'clienteId'
    } )
    clienteId: number

    @ForeignKey(() => Seguradora)
    @Column({
        field: 'seguradoraId'
    } )
    seguradoraId: number

    @BelongsTo(() => Cliente)
    cliente: Cliente

    @BelongsTo(() => Seguradora)
    seguradora: Seguradora
}