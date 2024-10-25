import { Request, Response } from "express";
import Review from "../models/Review"; 
import Libro from "../models/Book"; 


export const createReview = async (req: Request, res: Response) => {
  const { ISBN, texto, iduser,calificación } = req.body; 

  if (!calificación || calificación < 1 || calificación > 5) {
    return res.status(400).json({ message: "La calificación es obligatoria y debe estar entre 1 y 5 estrellas" });
  }


  try {
    const newReview = await Review.create({
      ISBN,
      texto,
      likes: 0,
      calificación,
      iduser
    });

    const libro = await Libro.findByPk(ISBN);
    if (libro) {
      const totalReviews = libro.numberreviews + 1;
      const updatedRating = ((libro.averagerating * libro.numberreviews) + calificación) / totalReviews;

      await libro.update({
        cantidad_reseñas: totalReviews,
        promedio_calificación: updatedRating,
      });
    }

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error during review creation:", error);
    res.status(500).json({ message: "Error creating review", error });
  }
};


export const getReviewsByISBN = async (req: Request, res: Response) => {
  const { ISBN } = req.params;

  try {
    const reviews = await Review.findAll({ where: { ISBN } });

    if (reviews.length === 0) { 
      return res.status(404).json({ message: "No reviews found for this book" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};


export const deleteReview = async (req: Request, res: Response) => {
    const { id } = req.params; 
  
    try {
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      const ISBN = review.ISBN; 

      await review.destroy(); 

      await Libro.decrement('cantidad_reseñas', {
        by: 1,
        where: { ISBN },
      });
  
      res.status(204).send(); 
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Error deleting review", error });
    }
  };