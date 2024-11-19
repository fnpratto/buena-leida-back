import { Request, Response } from 'express';
import {Group, GroupUser} from '../models/Group';
import User from '../models/User'; 
import { Op } from 'sequelize';
import sequelize from "../config/db";
import { GroupDiscussion } from '../models/GroupDiscussion';


export const createGroup = async (req: Request, res: Response) => {
  const { name, description, topic, creatorId } = req.body;

  try {
    if (!name || !description || !topic || !creatorId) {
        res.status(400).json({ message: 'Todos los campos son requeridos.' });
        return;
    }

    const existingGroup = await Group.findOne({ where: { name: { [Op.iLike]: name } } });
    if (existingGroup) {
     res.status(400).json({ message: 'Ya existe un grupo con ese nombre.' });
     return;
    }

    const newGroup = await Group.create({
      name,
      description,
      topic,
      creatorId,
    });

    res.status(201).json({ message: 'Grupo creado exitosamente.', group: newGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el grupo.' });
  }
};

export const getGroupInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
    const { groupId } = req.params;
  
    try {
      const group = await Group.findOne({
        where: { id: groupId },
        attributes: ['id', 'name', 'bio', 'photo', 'creatorId', 'description', 'topic'],
      });
  
      if (!group) {
        res.status(404).json({ message: 'Grupo no encontrado.' });
        return;
      }
  
      res.status(200).json({ group });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener la información del grupo.' });
    }
  };


export const getGroupMembers = async (req: Request, res: Response) => {
  const { groupId } = req.params;

  if (!groupId) {
    res.status(400).json({ message: "Group ID is required." });
    return;
  }

  try {
    const group = await Group.findByPk(groupId, {
      include: {
        model: User,
        through: { attributes: [] },
        attributes: ["id", "username", "realName", "profilePhoto"], // Adjust fields as needed
      },
    });

    if (!group) {
      res.status(404).json({ message: "Group not found." });
      return;
    }

    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los miembros del grupo.' });
  }
};
  

export const updateGroupBio = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const { bio, creatorId } = req.body;
  if (!groupId || !bio || !creatorId) {
    res.status(400).json({ message: "Group ID, creator ID and a new bio are required." });
    return;
  }
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404).json({ message: "Group not found."});
      return;
    }
    if (creatorId != group.creatorId as any){
      res.status(403).json({ message: "The user who wants to update the group biography isnt the creator."});
      return;
    }
    group.bio = bio;
    await group.save();

    res.json({ message: "Bio of group updated successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating biography.'});
  }
};


export const updateGroupPhoto = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const { groupPhoto, creatorId } = req.body;

  if (!groupId || !groupPhoto || !creatorId) {
    res.status(400).json({ message: "Group ID, creator ID and a new photo are required." });
    return;
  }
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404).json({ message: "Group not found."});
      return;
    }
    if (creatorId != group.creatorId as any){
      res.status(403).json({ message: "The user who wants to update the photo group isnt the creator."});
      return;
    }
    group.photo = groupPhoto;
    await group.save();

    res.json({ message: "Photo of group updated successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating the group photo.'});
  }
};

export const removeGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const { creatorId } = req.body;

  if (!groupId) {
    res.status(400).json({ message: "Group ID is required." });
    return;
  }
  if (!creatorId) {
    res.status(400).json({ message: "User ID is required." });
    return;
  }
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404).json({ message: "Group not found."});
      return;
    }
    if (creatorId != group.creatorId as any){
      res.status(403).json({ message: "The user who wants to delete the group isnt the creator."});
      return;
    }
    await group.destroy();
    res.json({ message: "Group deleted succesfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting the group.'});
  }
};