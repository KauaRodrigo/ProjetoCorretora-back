import { Column, DataType, Model, Table } from "sequelize-typescript";
import { StatusSinistro } from "../../enums/statusSinistro";
import { TipoSinistro } from "../../enums/tipoSinistros"

@Table({    
    tableName: 'sinistros'
})
export default class Sinistro extends Model {
    @Column(DataType.BIGINT)
    codigo: number

    @Column
    placa: string

    @Column
    nome: string

    @Column
    seguradora: string

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
}