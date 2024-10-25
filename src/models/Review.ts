import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Book from "./Book";

class Review extends Model {
  public id!: number;
  public iduser!: number;
  public ISBN!:number;
  public texto?: string;
  public likes!: number;
  public calificación!: number;
}

Review.belongsTo(Book, {
    foreignKey: 'ISBN',
  });

Review.init(
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
    ISBN: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    texto: {
      type: DataTypes.TEXT, 
      allowNull: true,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, 
    },
    calificación: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
    timestamps: false,
  }
);

export default Review;
