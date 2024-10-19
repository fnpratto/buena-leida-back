import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public username!: string;
  public favouritegenders!: string;
  public fotoPerfil?: string; 
  public biografia?: string;  
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    fotoPerfil: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    biografia: {
      type: DataTypes.TEXT, 
      allowNull: true, 
    },
  }, 
  {
    sequelize,
    modelName: "User",
//    timestamps: false,
    tableName: "users",
    hooks: {
      beforeUpdate: (user) => {
        if (user.changed('username')) {
          throw new Error("No se puede modificar el nombre de usuario.");
        }
      },
    },
  }
);

export default User;
