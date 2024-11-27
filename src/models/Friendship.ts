import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

class Friendship extends Model {
  public id!: number;
  public userid!: number;
  public friendid!: number;
  public createdAt!: Date;
}

Friendship.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    friendid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Friendship",
    tableName: "friendships",
    timestamps: true, 
  }
);

export default Friendship;
