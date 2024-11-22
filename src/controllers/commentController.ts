import { Request, Response } from 'express';
import Comment from '../models/Comment';
import User from "../models/User";
import Review from '../models/Review';


export const createComment = async (req: Request, res: Response) => {
    const { idreview, iduser, texto } = req.body;
  
    if (!texto) {
        res.status(400).json({ message: "El comentario no puede estar vacio" });
        return;
    }
  
    try {
        const review = await Review.findByPk(idreview);
        if (!review) {
            res.status(404).json({ message: "La review no existe" });
            return;
        }

        const user = await User.findByPk(iduser);
        if (!user) {
            res.status(404).json({ message: "El usuario no existe" });
            return;
        }

        const comment = await Comment.create({
            texto,
            iduser,
            idreview
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Error creating comment", error });
    }
};

export const getCommentsOfIdReview = async (req: Request, res: Response) => {
    const { idreview } = req.body;

    console.log(req.body);
  
    try {
        const comments = await Comment.findAll( { where: { idreview} });

        if (comments.length === 0) {
            res.status(404).json({ message: "No hay comentarios para esta review" });
            return;
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error getting comments of review:", error);
        res.status(500).json({ message: "Error getting comments of review", error });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    const { idComment, idUser } = req.params;
  
    try {
        const comment = await Comment.findByPk(idComment);
        if (!comment) {
            res.status(404).json({ message: "El comentario no existe" });
            return;
        }

        if (comment.iduser !== Number(idUser)) {
            res.status(403).json({ message: "No puedes borrar un comentario que no es tuyo" });
            return;
        }

        await comment.destroy();

        res.status(204).json();
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Error deleting comment", error });
    }
}