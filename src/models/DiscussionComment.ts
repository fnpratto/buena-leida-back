import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Comment extends Model {
  public id!: number;
  public iduser!: number;
  public discussionId!: number;
  public texto!: string;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    iduser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discussionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "Comments",
    timestamps: false,
  }
);

export default Comment;
