import { Request, Response } from 'express';
import {Group, GroupUser} from '../models/Group';
import User from '../models/User'; 
import { Op } from 'sequelize';
import sequelize from "../config/db";


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
  