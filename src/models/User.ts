import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { Group } from "./Group";
import Friendship from "./Friendship";

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public username!: string;
  public favouritegenders!: string;
  public profilePhoto?: string;
  public bio?: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    favouritegenders: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },

    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:
        "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fdefault.jpg?alt=media&token=100a1fe2-fd46-4fc5-9d11-e7b78ed946f5",
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "Bienvenido a mi perfil",
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: false,
    tableName: "users",
    hooks: {
      beforeUpdate: (user) => {
        if (user.changed("username")) {
          throw new Error("No se puede modificar el nombre de usuario.");
        }
      },
    },
  }
);

export default User;
