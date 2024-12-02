import { Request, Response } from 'express';
import {Group} from '../models/Group';
import User from '../models/User'; 
import { GroupDiscussion } from '../models/GroupDiscussion';


export const createGroupDiscussion = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const { name, creatorId } = req.body;
    if (!groupId || !name || !creatorId) {
      res.status(400).json({ message: "Group ID, name and creator ID are required." });
      return;
    }

    try {
        const user = await User.findByPk(creatorId);
        if (!user) {
            res.status(404).json({ message: "User not found."});
            return;
        }   
        const group = await Group.findByPk(groupId);
        if (!group) {
            res.status(404).json({ message: "Group not found." });
            return;
        }
        const newDiscussion = await GroupDiscussion.create({
            name,
            creatorId,
            groupId,
        });

        res.status(201).json(newDiscussion);
    } catch (error) {
        console.error("Error during library creation:", error);
        res.status(500).json({ message: 'Error creating library', error});
    }
};

export const getDiscussions = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    if (!groupId) {
      res.status(400).json({ message: "Group ID is required." });
      return;
    }
    try {
        const group = await Group.findByPk(groupId);
        if (!group) {
            res.status(404).json({ message: "Group not found." });
            return;
        };
        const discussions = await GroupDiscussion.findAll({
            where: {groupId: groupId},
            attributes: ["groupId", "discussionId", "name", "creatorId"]
        });
        if (discussions.length === 0){
            res.status(404).json({ message: "No discussions found for the group." });
            return;
        }
        const creatorUsersIds = discussions.map((discussion) => discussion.creatorId);

        const creatorUsers = await User.findAll({
          where: { id: creatorUsersIds },
          attributes: ["id", "username", "name", "profilePhoto"],
        });
        const discussionsWithCreator = discussions.map((discussion) => {
            const creatorUser = creatorUsers.find((user) => user.id === discussion.creatorId);
            return {
              discussionId: discussion.discussionId,
              groupId: discussion.groupId,
              name: discussion.name,
              creatorUser: creatorUser ? { 
                username: creatorUser.username, 
                name: creatorUser.name, 
                profilePhoto: creatorUser.profilePhoto 
              } : null,
            };
          });


        res.status(200).json(discussionsWithCreator);
    } catch (error) {
        console.error("Error getting group discussions:", error);
        res.status(500).json({
          message: "An error occurred while getting group discussions.",
          error,
        });
    }
};
    