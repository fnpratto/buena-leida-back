import { Request, Response } from 'express';
import {Group, GroupUser} from '../models/Group';
import User from '../models/User'; 
import { Op } from 'sequelize';
import { QueryTypes } from 'sequelize';
import sequelize from "../config/db";
import { GroupDiscussion } from '../models/GroupDiscussion';
import { group } from 'console';


export const createGroup = async (req: Request, res: Response) => {
  const { name, description, topic, creatorId, genre } = req.body;

  try {
    if (!name || !description || !topic || !creatorId || !genre) {
        res.status(400).json({ message: 'Todos los campos son requeridos.' });
        return;
    }

    const existingGroup = await Group.findOne({ where: { name: { [Op.iLike]: name } } });
    if (existingGroup) {
     res.status(400).json({ message: 'Ya existe un grupo con ese nombre.' });
     return;
    }

    const creatorUser = await User.findByPk( creatorId );

    let membersCount = 1;
    const newGroup = await Group.create({
      name,
      description,
      topic,
      creatorId,
      genre,
      membersCount
    });

    const newGroupUser = await sequelize.models.GroupUser.create({
      groupId: newGroup.id,
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
  const { bio } = req.body;
  if (!groupId || !bio) {
    res.status(400).json({ message: "Group ID and a new bio are required." });
    return;
  }
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404).json({ message: "Group not found."});
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
  const { groupPhoto } = req.body;

  if (!groupId || !groupPhoto) {
    res.status(400).json({ message: "Group ID and a new photo are required." });
    return;
  }
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404).json({ message: "Group not found."});
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
  const { userId } = req.query;

  if (!groupId || !userId) {
    res.status(400).json({ message: "Group ID and User ID are required." });
    return;
  }
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404).json({ message: "Group not found."});
      return;
    }
    if (userId != group.creatorId as any){
      res.status(404).json({ message: "The user who wants to delete de group isnt the creator."});
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
  //console.log(`name: ${name}`);

  try {
    const queryOptions: any = {};

    if (name) {
      queryOptions.where = { name: { [Op.iLike]: `%${name}%` } };
      queryOptions.attributes = ["id", "photo", "name", "bio", "membersCount"] ;
    }
    const groups = await Group.findAll(queryOptions);

    if (groups.length === 0) {
      res.status(404).json({ message: "No groups found for that search" });
      return;
    }

    //for (let group in groups) {
    //  group = (group as Group);
    //  const {id} = group;
    //  const cantUsers = GroupUser.findAll( {where: {groupId : group.id}} )
    //}

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
      queryOptions.attributes = ["id", "photo", "name", "bio"];
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