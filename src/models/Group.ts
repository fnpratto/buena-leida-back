import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import User from "./User";

class Group extends Model {
  public groupId!: number;
  public name!: string;
  public bio!: string;
  public creatorId!: number;
  public photo!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public genre!: string; 
  public membersCount! : number;
  public users?: User[];
}

Group.init(
  {
    groupId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    },
    membersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'Group',
    tableName: 'groups',
  }
);


const GroupUsers = sequelize.define("GroupUsers", {
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: "groupId",
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

export { Group, GroupUsers };
