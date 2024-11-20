import { Request, Response } from 'express';
import {Group, GroupUsers} from '../models/Group';
import User from '../models/User'; 
import { Op } from 'sequelize';
import { QueryTypes } from 'sequelize';
import sequelize from "../config/db";
import { GroupDiscussion } from '../models/GroupDiscussion';
import { group } from 'console';


export const createGroup = async (req: Request, res: Response) => {
  const { name, bio, creatorId, genre } = req.body;

  try {
    if (!name || !bio || !creatorId || !genre) {
        res.status(400).json({ message: 'Todos los campos son requeridos.' });
        return;
    }

    const existingGroup = await Group.findOne({ where: { name: { [Op.iLike]: name } } });
    if (existingGroup) {
     res.status(400).json({ message: 'Ya existe un grupo con ese nombre.' });
     return;
    }

    const creatorUser = await User.findByPk( creatorId );
    if (!creatorUser){
      res.status(400).json({ message: 'Inexistent user.' });
      return;
    }

    let membersCount = 1;
    const newGroup = await Group.create({
      name,
      bio,
      creatorId,
      genre,
      membersCount
    });

    await sequelize.models.GroupUsers.create({
      groupId: newGroup.groupId,
      userId: creatorId
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
        where: { groupId: groupId },
        attributes: ['groupId', 'name', 'photo', 'creatorId', 'bio', 'genre'],
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
      include:[ 
        {
          model: User,
          as: "users",
          through: { attributes: [] },
          attributes: ["id", "username", "name", "profilePhoto"],
        },
      ]
    });

    if (!group) {
      res.status(404).json({ message: "Group not found." });
      return;
    }

    res.status(200).json(group.users);
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
      res.status(403).json({ message: "The user who wants to update the group bio isnt the creator."});
      return;
    }
    group.bio = bio;
    await group.save();

    res.json({ message: "Bio of group updated successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating bio.'});
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

export const getGroupsByName = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { sort } = req.query;

  try {
    const queryOptions: any = {};

    if (name) {
      queryOptions.where = { name: { [Op.iLike]: `%${name}%` } };
      queryOptions.attributes = ["groupId", "photo", "name", "bio", "membersCount"] ;
    }
    if (sort === "popularity") {
      queryOptions.order = [["membersCount", "DESC"]];
    }
    const groups = await Group.findAll(queryOptions);

    if (groups.length === 0) {
      res.status(404).json({ message: "No groups found for that search" });
      return;
    }

    res.json(groups);
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching group data", error });
  }
};

export const getGroupsByGenre = async (req: Request, res: Response) => {
  const { genre } = req.body;

  try {
    const queryOptions: any = {};

    if (genre) {
      queryOptions.where = {
        genre: { [Op.contains]: [genre] },
      };
      queryOptions.attributes = ["groupId", "photo", "name", "bio"];
    }

    const groups = await Group.findAll(queryOptions);

    if (groups.length === 0) {
      res.status(404).json({ message: "No groups found for that genre" });
      return;
    }

    res.json(groups);
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching group data", error });
  }
};

export const getAllGroupGenres = async (req: Request, res: Response) => {
  try {
    // Consulta directa a la base de datos usando Sequelize
    const result = await sequelize.query(
      `
      SELECT DISTINCT UNNEST(genre) AS genre
      FROM groups
      WHERE genre IS NOT NULL
      `,
      { type: QueryTypes.SELECT }
    );

    // Extraer los géneros en un array plano
    const genres = result.map((row: any) => row.genre);

    if (genres.length === 0) {
      res.status(404).json({ message: "No genres found" });
      return;
    }

    res.json(genres);

  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ message: "Error fetching genres", error });
  }
};