import { Table, Column, Model, DataType, AllowNull, Unique, Default } from 'sequelize-typescript';

@Table({ tableName: 'member' })
export default class MemberModel extends Model<MemberModel> {
    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;

    @AllowNull(false)
    @Unique(true)
    @Column(DataType.STRING)
    nickName!: string;

    @Column(DataType.STRING)
    refreshToken!: string;
}