import {AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { StatusSinistro } from "../../enums/statusSinistro";
import { TipoSinistro } from "../../enums/tipoSinistros"
import Cliente from "./clientes.model";
import Adress from "./adress.model";

@Table({
    tableName: 'sinistros',
    paranoid: true
})
export default class Sinistro extends Model {
    @AllowNull(false)
    @Column(DataType.BIGINT)
    codigo: number

    @Column
    placa: string

    @Column
    evento: string

    @AllowNull(false)
    @Column
    terceiro: boolean

    @Column
    caminho: string

    @AllowNull(false)
    @Column(DataType.ENUM(...Object.values(TipoSinistro)))
    tipo: TipoSinistro

    @Column(DataType.ENUM(...Object.values(StatusSinistro)))
    status: StatusSinistro
    
    @Column(DataType.DATE)
    deletedAt: Date

    @Column({
        field: 'data_ocorrencia',
        type: DataType.DATE
    })
    dataOcorrencia: Date


    @ForeignKey(() => Cliente)
    @Column({
        field: 'clienteId'
    } )
    clienteId: number

    @ForeignKey(() => Adress)
    @Column({
        field: 'enderecoId'
    })
    enderecoId: number

    @BelongsTo(() => Cliente)
    cliente: Cliente

    @BelongsTo(() => Adress)
    endereco: Cliente
}