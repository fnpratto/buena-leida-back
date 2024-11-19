import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import User from "./User";

class Group extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public topic!: string;
  public creatorId!: number;
  public bio!: string;
  public photo!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public genre!: string; 
}

Group.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      defaultValue: 'Este es un nuevo grupo.',
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: 'default-group-photo.jpg', // Ruta a la foto predeterminada.
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genre: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'Group',
    tableName: 'groups',
  }
);


const GroupUser = sequelize.define("GroupUser", {
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: "id",
    },
    onDelete: "CASCADE",
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
    allowNull: false,
  },
});

export { Group, GroupUser };
