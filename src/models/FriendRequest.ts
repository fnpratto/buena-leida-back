import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

class FriendRequest extends Model {
  public id!: number;
  public senderId!: number;
  public receiverId!: number;
  public createdAt!: Date; 
}

FriendRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    receiverId: {
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
