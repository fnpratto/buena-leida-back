import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public coverimage?: string;
  public publication_date!: Date;
  public genre!: string;
  public summary?: string;
  public averagerating!: number;
  public numberreviews!: number;
  public oneStarCount!: number;
  public twoStarCount!: number;
  public threeStarCount!: number;
  public fourStarCount!: number;
  public fiveStarCount!: number;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      defaultValue: "default-cover.jpg",
    },
    publication_date: {
      type: DataTypes.DATE,
      allowNull: false,
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
    numberreviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    oneStarCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    twoStarCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    threeStarCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    fourStarCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    fiveStarCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
