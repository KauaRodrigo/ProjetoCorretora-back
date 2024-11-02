import {AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, NotNull, Table} from "sequelize-typescript";
import { StatusSinistro } from "../../common/enums/statusSinistro";
import { TipoSinistro } from "../../common/enums/tipoSinistros"
import Cliente from "./clientes.model";
import Adress from "./adress.model";

@Table({
    tableName: 'sinistros',
    paranoid: true
})
export default class Sinistro extends Model {
    @AllowNull(false)
    @Column(DataType.BIGINT)
    numeroApolice: number

    @Column
    placa: string

    @Column
    evento: string

    @AllowNull(false)
    @Column
    terceiro: boolean

    @Column({
        type: DataType.STRING,
        field: 'nome_terceiro',
        allowNull: false
    })
    nomeTerceiro: string

    @AllowNull(false)
    @Column(DataType.ENUM(...Object.values(TipoSinistro)))
    tipo: TipoSinistro

    @Column(DataType.ENUM(...Object.values(StatusSinistro)))
    status: StatusSinistro
    
    @Column(DataType.DATE)
    deletedAt: Date

    @Column({
        type: DataType.DATE
    })
    dataOcorrencia: Date

    @Column({        
        type: DataType.INTEGER
    })
    numeroSinistro: number

    @Column({
        field: 'observacoes',
        type: DataType.STRING
    })
    observacoes

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