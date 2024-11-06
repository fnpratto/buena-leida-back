// src/models/ReadingState.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import Book from "./Book";

class ReadingState extends Model {
    public id!: number;
    public bookId!: number;
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
        status: {
            type: DataTypes.ENUM("quiero_leer'", "leyendo", "leido"), // Only three statuses
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "ReadingState",
    }
);

export default ReadingState;
