import { DataTypes, Model  } from "sequelize";
import sequelize from "../config/db";
import Book from './Book';

class BookShelf extends Model {
  public id!: number;
  public title!: string;
  public id_usuario!: number;
  public created_at?: Date;
}

BookShelf.init(
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
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BookShelf",
    tableName: "bookshelf",
    timestamps: false,
  }
);

const BookShelfBooks = sequelize.define('BookShelfBooks', {
  bookshelfId: {
    type: DataTypes.INTEGER,
    references: {
      model: BookShelf,
      key: 'id',
    },
  },
  bookId: {
    type: DataTypes.INTEGER,
    references: {
      model: Book,
      key: 'id',
    },
  }
});

BookShelf.belongsToMany(Book, { through: BookShelf, foreignKey: 'id' });
Book.belongsToMany(BookShelf, { through: BookShelf , foreignKey: 'id' });


export { BookShelf, BookShelfBooks };

