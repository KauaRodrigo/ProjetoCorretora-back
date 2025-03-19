import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import Sinistro from "./sinistro.model";
import Seguradora from "./seguradora.model";

@Table({    
    tableName: 'clientes',
    paranoid: true
})
export default class Cliente extends Model {
    @Column
    name: string

    @ForeignKey(() => Seguradora)
    @Column({
        field: 'seguradoraId'
    })
    seguradoraId: number

    @Column
    cpf: string

    @Column
    telefone: string

    @Column
    dataNascimento: Date

    @Column
    status: number

    @BelongsTo(() => Seguradora)
    seguradora: Seguradora

    @HasMany(() => Sinistro)
    sinistros: Sinistro[]
}