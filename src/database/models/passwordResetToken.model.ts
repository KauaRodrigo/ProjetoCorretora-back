import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'passwordResetToken',    
    timestamps: true,
    paranoid: true        
})
export default class PasswordResetTokenModel extends Model<PasswordResetTokenModel> {         

    @Column(DataType.TEXT)
    token: string

    @Column(DataType.DATE)
    limitDate: Date    

} 