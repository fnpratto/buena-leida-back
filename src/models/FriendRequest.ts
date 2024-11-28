import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

class FriendRequest extends Model {
  public id!: number;
  public senderid!: number;
  public receiverid!: number;
  public createdAt!: Date; 
}

FriendRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    senderid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    receiverid: {
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
    modelName: "FriendRequest",
    tableName: "friend_requests",
    timestamps: true, 
  }
);

export default FriendRequest;
