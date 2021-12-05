import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { User } from "./SUser";

export interface AddInfoCreationAttributes {
  age: number;
  address: string;
  sex: boolean;
  hasPets: boolean;
  hasBadHabits: boolean;
  isStudent: boolean;
  hasJob: boolean;
  isMarried: boolean;
  phoneNumber: string;
  moreAbout: string;
}

@Table({ tableName: "additional_info", underscored: true })
export class AddInfo extends Model<AddInfo, AddInfoCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  age!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  address!: string;

  @Column({ type: DataType.STRING })
  sex!: string;

  @Column({ type: DataType.BOOLEAN })
  hasPets!: boolean;

  @Column({ type: DataType.BOOLEAN })
  hasBadHabits!: boolean;

  @Column({ type: DataType.BOOLEAN })
  isStudent!: boolean;

  @Column({ type: DataType.BOOLEAN })
  hasJob!: boolean;

  @Column({ type: DataType.BOOLEAN })
  isMarried!: boolean;

  @Column({ type: DataType.STRING, unique: true })
  phoneNumber!: string;

  @Column({ type: DataType.STRING(150) })
  moreAbout!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, unique: true })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
