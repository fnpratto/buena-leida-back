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
    