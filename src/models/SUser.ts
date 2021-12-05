import {
  BeforeCreate,
  Column,
  DataType,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";
import differenceInMinutes from "date-fns/difference_in_minutes";
import { generatePasswordHash } from "../utils";
import { AddInfo } from "./SAddInfo";

export type TUser = typeof User;

export interface UserCreationAttributes {
  email: string;
  fullname: string;
  password: string;
}

@Table({ tableName: "user", underscored: true })
export class User extends Model<User, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  fullname!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email!: string;

  @Column({ type: DataType.STRING })
  avatar!: string;

  @Column({ type: DataType.STRING, unique: true })
  password!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  confirmed!: boolean;

  @Column({ type: DataType.STRING })
  confirm_hash!: string;

  @Column({ type: DataType.STRING, defaultValue: new Date().toUTCString() })
  last_seen!: string;

  @Column({ type: DataType.VIRTUAL })
  get isOnline() {
    return differenceInMinutes(new Date().toISOString(), this.last_seen) < 5;
  }

  @BeforeCreate
  static async generatePassword(user: User) {
    user.password = (await generatePasswordHash(user.password)) as string;
    user.confirm_hash = (await generatePasswordHash(
      new Date().toString()
    )) as string;
  }

  @HasOne(() => AddInfo)
  info: AddInfo;
}
