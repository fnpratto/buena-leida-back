import { Request, Response } from "express";
import { Review, Book } from "../models";
import User from "../models/User";


export const createReview = async (req: Request, res: Response) => {
  const { isbn, texto, iduser,calification } = req.body; 

  if (!calification || calification < 1 || calification > 5) {
    res.status(400).json({ message: "La calificación es obligatoria y debe estar entre 1 y 5 estrellas" });
    return;
  }


  try {
    const id = isbn
    const book = await Book.findOne({ where: { id } });
    if (!book) {
      res.status(404).json({ message: "El libro no existe" });
      return;
    }

    const user = await User.findByPk(iduser);
    if (!user) {
      res.status(404).json({ message: "El usuario no existe" });
      return;
    }

    const newReview = await Review.create({
      isbn,
      texto,
      likes: 0,
      calification,
      iduser
    });

    const totalReviews = book.numberreviews + 1;
    const updatedRating = ((book.averagerating * book.numberreviews) + calification) / totalReviews;

    await book.update({
      cantidad_reseñas: totalReviews,
      promedio_calification: updatedRating,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error during review creation:", error);
    res.status(500).json({ message: "Error creating review", error });
  }
};


export const getReviewsByISBN = async (req: Request, res: Response) => {
  const { isbn } = req.params;

  if (!isbn) {
    res.status(400).json({ message: "ISBN is required to fetch reviews" });
    return;
  }

  console.log("Fetching reviews for ISBN:", isbn); 

  try {
    const reviews = await Review.findAll({ where: { isbn } });

    if (reviews.length === 0) { 
      res.status(404).json({ message: "No reviews found for this book" });
      return;
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
        res.status(404).json({ message: "Review not found" });
        return;
      }
  
      const isbn = review.isbn; 

      await review.destroy(); 

      await Book.decrement('cantidad_reseñas', {
        by: 1,
        where: { isbn },
      });
  
      res.status(204).send(); 
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Error deleting review", error });
    }
  };