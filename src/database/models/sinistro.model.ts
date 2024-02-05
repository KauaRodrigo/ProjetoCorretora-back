import { Column, DataType, Model, Table } from "sequelize-typescript";
import { TipoSinistro } from "src/enums/tipoSinistros"

@Table({
    schema: 'frcorretora',
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
}