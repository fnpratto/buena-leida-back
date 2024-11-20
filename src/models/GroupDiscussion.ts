import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { Group } from "./Group";


class GroupDiscussion extends Model {
  public discussionId!: number;
  public name!: string;
  public creatorId!: number;
  public groupId!: number;
}

GroupDiscussion.init(
{
    discussionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Group,
            key: "groupId",
        },
    },
},
{
    sequelize,
    modelName: "GroupDiscussion",
    tableName: "groupDiscussions",
    timestamps: false,
}
);

export { GroupDiscussion};
