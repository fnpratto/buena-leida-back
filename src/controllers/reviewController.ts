import { Request, Response } from "express";
import { Review, Book } from "../models";
import Like from "../models/Like";
import User from "../models/User";
import { where } from "sequelize";


export const rateBook = async (req: Request, res: Response) => {
  const { isbn, calification, iduser } = req.body;

  console.log("Rating book with ISBN:", isbn, "by user ID:", iduser);

  if (!calification || calification < 1 || calification > 5) {
    res.status(400).json({ message: "La calificación es obligatoria y debe estar entre 1 y 5 estrellas" });
    return;
  }

  try {
    const book = await Book.findOne({ where: { id: isbn } });
    if (!book) {
      res.status(404).json({ message: "El libro no existe", isbn });
      return;
    }

    const user = await User.findByPk(iduser);
    if (!user) {
      res.status(404).json({ message: "El usuario no existe", iduser });
      return;
    }

    const existingReview = await Review.findOne({
      where: {
        isbn,
        iduser
      }
    });

    if (existingReview) {
      res.status(400).json({ message: "El usuario ya ha reseñado este libro" });
      return;
    }


    const newReview = await Review.create({
      isbn,
      likes: 0,
      calification,
      iduser
    });

    const totalReviews = book.numberreviews + 1;
    const updatedRating = ((book.averagerating * book.numberreviews) + calification) / totalReviews;

    switch (calification) {
      case 1: book.oneStarCount += 1; break;
      case 2: book.twoStarCount += 1; break;
      case 3: book.threeStarCount += 1; break;
      case 4: book.fourStarCount += 1; break;
      case 5: book.fiveStarCount += 1; break;
    }

    await book.update({
      numberreviews: totalReviews,
      averagerating: updatedRating,
      oneStarCount: book.oneStarCount,
      twoStarCount: book.twoStarCount,
      threeStarCount: book.threeStarCount,
      fourStarCount: book.fourStarCount,
      fiveStarCount: book.fiveStarCount,
    });

    res.status(201).json(newReview);
  } catch (error) {
    const err = error as Error;
    console.error("Error during review creation:", {
      message: err.message,
      stack: err.stack,
      requestData: { isbn, calification, iduser }
    });
    res.status(500).json({
      message: "Error creating review",
      error: (error as Error).message,
      requestData: { isbn, calification, iduser }
    });
  }
};

export const createReview = async (req: Request, res: Response) => {
  const { isbn, texto, iduser, calification } = req.body;

  console.log("Creating review for ISBN:", isbn, "by user ID:", iduser);

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

    const existingReview = await Review.findOne({
      where: {
        isbn,
        iduser
      }
    });

    if (existingReview) {
      res.status(400).json({ message: "El usuario ya ha reseñado este libro" });
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

    if (calification === 1) book.oneStarCount += 1;
    else if (calification === 2) book.twoStarCount += 1;
    else if (calification === 3) book.threeStarCount += 1;
    else if (calification === 4) book.fourStarCount += 1;
    else if (calification === 5) book.fiveStarCount += 1;

    await book.update({
      numberreviews: totalReviews,
      averagerating: updatedRating,
      oneStarCount: book.oneStarCount,
      twoStarCount: book.twoStarCount,
      threeStarCount: book.threeStarCount,
      fourStarCount: book.fourStarCount,
      fiveStarCount: book.fiveStarCount,
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

export const getMyReviewByISBN = async (req: Request, res: Response) => {
  const { isbn } = req.params;
  const { iduser } = req.query; // !!

  if (!isbn) {
    res.status(400).json({ message: "ISBN is required to fetch review" });
    return;
  }

  if (!iduser) {
    res.status(400).json({ message: "User ID is required to fetch review" });
    return;
  }

  console.log("Fetching review for ISBN:", isbn, "by user ID:", iduser);

  try {
    const reviews = await Review.findAll({
      where: {
        isbn,
        iduser: iduser,
      },
    });

    if (!reviews) {
      res.status(404).json({ message: "No review found for this book by the user" });
      return;
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Error fetching review", error });
  }
};

export const deleteMyReview = async (req: Request, res: Response) => {
  const { isbn } = req.params;
  const { iduser } = req.params; // !!

  console.log("Deleting review with ID from book:", isbn, "by user ID:", iduser);


  if (!isbn) {
    res.status(400).json({ message: "ID is required to fetch review" });
    return;
  }

  if (!iduser) {
    res.status(400).json({ message: "User ID from user is required to fetch review" });
    return;
  }

  try {

    if (!iduser) {
      res.status(400).json({ message: "User ID is required." });
      return;
    }

    const review = await Review.findOne({ where: { isbn, iduser } });
    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }
    console.log("ISBN:", isbn);

    await review.destroy();

    await Book.decrement('numberreviews', {
      where: { id: isbn },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review", error });
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
    const id_book = review.isbn;
    console.log("ISBN:", id_book);

    await review.destroy();

    await Book.decrement('numberreviews', {
      where: { id: id_book },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review", error });
  }
};


export const toggleLike = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.id;
    const iduser = req.params.iduser;

    console.log("Toggling like for review ID:", reviewId, "by user ID:", iduser);

    if (!iduser) {
      res.status(400).json({ error: 'User ID is required.' });
      return;
    }

    const review = await Review.findByPk(reviewId);
    if (!review) {
      res.status(404).json({ error: 'Review not found.' });
      return;
    }

    const existingLike = await Like.findOne({
      where: { userId: Number(iduser), reviewId }
    });

    if (existingLike) {
      await existingLike.destroy();
      review.likes = Math.max(0, review.likes - 1);
      await review.save();

      res.status(200).json({
        message: 'Review unliked.',
        liked: false,
        likes: review.likes
      });
      return;
    } else {
      await Like.create({ userId: Number(iduser), reviewId });
      review.likes += 1;
      await review.save();

      res.status(200).json({
        message: 'Review liked.',
        liked: true,
        likes: review.likes
      });
      return;
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error toggling like.", error });
    return;
  }
};