import { Request, Response } from "express";
import Comment from "../models/DiscussionComment";
import Like from "../models/Like";
import { GroupDiscussion } from "../models/GroupDiscussion";
import User from "../models/User";
import {Group} from "../models/Group";

export const createComment = async (req: Request, res: Response) => {
  const { groupId, discussionId } = req.params;
  const { userId, text } = req.body;

  console.log("Se creó comentario en la discusión:", discussionId, "por:", userId);
  if (!text) {
    res.status(400).json({ message: "Debe ingresarse un texto en el comentario. " });
    return;
  }

  try {

    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404).json({ message: "El Grupo no existe." });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "El usuario no existe." });
      return;
    }

    const discussion = await GroupDiscussion.findByPk(discussionId);
    if (!discussion) {
      res.status(404).json({ message: "El tópico de discusión no existe." });
      return;
    }

    const comment = await Comment.create({
      userId,
      discussionId,
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "An error occurred while creating the comment.", error });
  }
};

export const getComments = async (req: Request, res: Response) => {
  const { groupId, discussionId } = req.params;

  if (!groupId || !discussionId) {
    res.status(400).json({ message: "El tópico y grupo de discusión es un parametro obligatorio." });
    return;
  }

  try {

    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404).json({ message: "No se encontró el grupo de discusión." });
      return;
    }

    const discussion = await GroupDiscussion.findOne({
      where: { discussionId, groupId },
    });
    if (!discussion) {
      res.status(404).json({ message: "No se encontró el tópico de discusión." });
      return;
    }

    // Falta catchear los casos donde el usuario que hizo el comentario ya no existe. 
    const comments = await Comment.findAll({
      where: { discussionId: discussionId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "name", "profilePhoto"],
        },
      ],
      attributes: ["commentId", "text", "userId", "createdAt"],
    });

    const commentIds = comments.map((comment) => comment.commentId);
    const likes = await Like.findAll({
      where: { reviewId: commentIds }, 
      attributes: ["reviewId", [sequelize.fn("COUNT", sequelize.col("reviewId")), "likeCount"]],
      group: ["reviewId"],
    });

    const commentsWithLikes = comments.map((comment) => {
      const likeData = likes.find((like) => like.reviewId === comment.commentId);
      return {
        ...comment.toJSON(),
        likeCount: likeData ? parseInt(likeData.likeCount, 10) : 0,
      };
    });


    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "An error occurred while fetching comments.", error });
  }
};

// Recordar que para reutilizar el modelo de Like sin modificar, reviewId apunta a commentId

export const likeComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  if (!commentId || !userId) {
    res.status(400).json({ message: "Comment ID and User ID are required." });
    return;
  }

  try {
    await Like.create({ userId, reviewId: commentId }); 

    res.status(200).json({ message: "Comment liked successfully." });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ message: "An error occurred while liking the comment.", error });
  }
};

// falta unlike 