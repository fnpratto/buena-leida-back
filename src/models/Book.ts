import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public coverimage?: string;
  public genre!: string;
  public summary?: string;
  public averagerating!: number;
  public reviews?: string[]; 
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coverimage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "default-cover.jpg"
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    averagerating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    reviews: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "books",
    timestamps: false,
  }
);

export default Book;
