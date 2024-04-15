import {AllowNull, BelongsTo, Column, DataType, DeletedAt, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "./user.model";
import Sinistro from "./sinistro.model";

@Table({
    tableName: 'comments'
})
export default class Comments extends Model {
    @Column(DataType.TEXT)
    conteudo: string

    @ForeignKey(() => User)
    @Column({
        field: 'userId'
    })
    userId: number

    @ForeignKey(() => Sinistro)
    @Column({
        field: 'sinistroId'
    })
    sinistroId: number

    @BelongsTo(() => Sinistro)
    sinistro: Sinistro

    @BelongsTo(() => User)
    user: User

    @AllowNull
    @DeletedAt
    @Column
    deletedAt: Date
}