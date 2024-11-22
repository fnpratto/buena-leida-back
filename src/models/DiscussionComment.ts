import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Like from "./Like";

class Comment extends Model {
  public id!: number;
  public iduser!: number;
  public idreview!: number;
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
    idreview: {
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
    tableName: "comments",
    timestamps: false,
  }
);

Comment.hasMany(Like, {
  foreignKey: "reviewId", 
  constraints: false, 
});

export default Comment;
