import { Request, Response } from "express";
import Comment from "../models/DiscussionComment";
import Like from "../models/Like";
import { GroupDiscussion } from "../models/GroupDiscussion";
import User from "../models/User";
import {Group} from "../models/Group";

export const createComment = async (req: Request, res: Response) => {
  const { discussionId } = req.params;
  const { iduser, texto } = req.body;

  console.log("Se creó comentario en la discusión:", discussionId, "por:", iduser);
  if (!texto) {
    res.status(400).json({ message: "Debe ingresarse un texto en el comentario. " });
    return;
  }

  try {

    const discussion = await GroupDiscussion.findByPk(discussionId);
    if (!discussion) {
      res.status(404).json({ message: "El tópico de discusión no existe." });
      return;
    }

    const group = await Group.findByPk(discussion.groupId);
    if (!group) {
      res.status(404).json({ message: "El Grupo no existe." });
      return;
    }

    const user = await User.findByPk(iduser);
    if (!user) {
      res.status(404).json({ message: "El usuario no existe." });
      return;
    }

    const comment = await Comment.create({
      iduser,
      discussionId,
      texto,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "An error occurred while creating the comment.", error });
  }
};

export const getComments = async (req: Request, res: Response) => {
  const { discussionId } = req.params;

  if (!discussionId) {
    res.status(400).json({ message: "El tópico es un parametro obligatorio." });
    return;
  }

  try {
    const discussion = await GroupDiscussion.findOne({
      where: { discussionId },
    });
    if (!discussion) {
      res.status(404).json({ message: "No se encontró el tópico de discusión." });
      return;
    }

    const group = await Group.findByPk(discussion.groupId);
    if (!group) {
      res.status(404).json({ message: "No se encontró el grupo de discusión." });
      return;
    }

    const comments = await Comment.findAll({
      where: { discussionId: discussionId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ["id", "username", "name", "profilePhoto"],
        },
      ],
      attributes: ["id", "texto", "iduser", "createdAt"],
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "An error occurred while fetching comments.", error });
  }
};
