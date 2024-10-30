import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Like extends Model {
  public userId!: number;
  public reviewId!: number;
}

Like.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Like",
    tableName: "likes",
    timestamps: false,
  }
);

export default Like;