import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import Book from "./Book";

class ReadingState extends Model {
    public id!: number;
    public bookId!: number;
    public userId!: number;
    public status!: string;
}

ReadingState.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        bookId: {
            type: DataTypes.INTEGER,
            references: {
                model: Book,
                key: "id",
            },
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("quiero_leer'", "leyendo", "leido"), 
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "ReadingState",
    }
);

export default ReadingState;
