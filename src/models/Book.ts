import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Review from "./Review";

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
}


Book.hasMany(Review, {
  foreignKey: 'ISBN', 
  onDelete: 'CASCADE',
});


Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
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
    publication_date: {
      type:DataTypes.DATE,
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
    reviews: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    numberreviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      autoIncrement: true,
    }
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "books",
    timestamps: false,
  }
);

export default Book;
