import { Request, Response } from "express";
import Book from "../models/Book";
import Review from "../models/Review";
import Like from "../models/Like";
import User from "../models/User";
import { where } from "sequelize";

export const rateBook = async (req: Request, res: Response) => {
  const { isbn, calification, iduser } = req.body;

  console.log("Rating book with ISBN:", isbn, "by user ID:", iduser);

  if (!calification || calification < 1 || calification > 5) {
    res.status(400).json({
      message:
        "La calificación es obligatoria y debe estar entre 1 y 5 estrellas",
    });
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
        iduser,
      },
    });

    if (existingReview) {
      const oldCalification = existingReview.calification;

      console.log(oldCalification);

      existingReview.calification = calification;
      await existingReview.save();

      if (oldCalification === 1) book.oneStarCount -= 1;
      else if (oldCalification === 2) book.twoStarCount -= 1;
      else if (oldCalification === 3) book.threeStarCount -= 1;
      else if (oldCalification === 4) book.fourStarCount -= 1;
      else if (oldCalification === 5) book.fiveStarCount -= 1;

      if (calification === 1) book.oneStarCount += 1;
      else if (calification === 2) book.twoStarCount += 1;
      else if (calification === 3) book.threeStarCount += 1;
      else if (calification === 4) book.fourStarCount += 1;
      else if (calification === 5) book.fiveStarCount += 1;

      const updatedRating =
        (book.averagerating * book.numberreviews -
          oldCalification +
          calification) /
        book.numberreviews;

      await book.update({
        averagerating: updatedRating,
        oneStarCount: book.oneStarCount,
        twoStarCount: book.twoStarCount,
        threeStarCount: book.threeStarCount,
        fourStarCount: book.fourStarCount,
        fiveStarCount: book.fiveStarCount,
      });

      res.status(200).json(existingReview);
      return;
    }

    const newReview = await Review.create({
      isbn,
      likes: 0,
      calification,
      iduser,
    });

    const totalReviews = book.numberreviews + 1;
    const updatedRating =
      (book.averagerating * book.numberreviews + calification) / totalReviews;

    switch (calification) {
      case 1:
        book.oneStarCount += 1;
        break;
      case 2:
        book.twoStarCount += 1;
        break;
      case 3:
        book.threeStarCount += 1;
        break;
      case 4:
        book.fourStarCount += 1;
        break;
      case 5:
        book.fiveStarCount += 1;
        break;
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
      requestData: { isbn, calification, iduser },
    });
    res.status(500).json({
      message: "Error creating review",
      error: err.message,
      requestData: { isbn, calification, iduser },
    });
  }
};
export const createReview = async (req: Request, res: Response) => {
  const { isbn, texto, iduser, calification } = req.body;

  console.log(
    "Creating or updating review for ISBN:",
    isbn,
    "by user ID:",
    iduser
  );

  if (!calification || calification < 1 || calification > 5) {
    res.status(400).json({
      message:
        "La calificación es obligatoria y debe estar entre 1 y 5 estrellas",
    });
    return;
  }

  try {
    const id = isbn;
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

    // Check if the review already exists
    const existingReview = await Review.findOne({
      where: {
        isbn,
        iduser,
      },
    });

    if (existingReview) {
      // Update the existing review
      existingReview.texto = texto;
      existingReview.calification = calification;
      await existingReview.save();

      // Update the book's statistics only if the rating changed
      const oldCalification = existingReview.calification;
      if (oldCalification !== calification) {
        const totalReviews = book.numberreviews; // Keep the same total reviews

        const updatedRating =
          (book.averagerating * totalReviews - oldCalification + calification) /
          totalReviews;

        // Adjust the star count
        if (oldCalification === 1) book.oneStarCount -= 1;
        else if (oldCalification === 2) book.twoStarCount -= 1;
        else if (oldCalification === 3) book.threeStarCount -= 1;
        else if (oldCalification === 4) book.fourStarCount -= 1;
        else if (oldCalification === 5) book.fiveStarCount -= 1;

        if (calification === 1) book.oneStarCount += 1;
        else if (calification === 2) book.twoStarCount += 1;
        else if (calification === 3) book.threeStarCount += 1;
        else if (calification === 4) book.fourStarCount += 1;
        else if (calification === 5) book.fiveStarCount += 1;

        await book.update({
          averagerating: updatedRating,
          oneStarCount: book.oneStarCount,
          twoStarCount: book.twoStarCount,
          threeStarCount: book.threeStarCount,
          fourStarCount: book.fourStarCount,
          fiveStarCount: book.fiveStarCount,
        });
      }

      res.status(200).json(existingReview); // Respond with the updated review
      return;
    }

    // Create a new review if it doesn't exist
    const newReview = await Review.create({
      isbn,
      texto,
      likes: 0,
      calification,
      iduser,
    });

    const totalReviews = book.numberreviews + 1;
    const updatedRating =
      (book.averagerating * book.numberreviews + calification) / totalReviews;

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
    console.error("Error during review creation or update:", error);
    res
      .status(500)
      .json({ message: "Error creating or updating review", error });
  }
};

export const getReviewsByISBN = async (req: Request, res: Response) => {
  const { isbn } = req.params;
  const { iduser } = req.query;

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

    // Fetch users based on the iduser from the reviews
    const userIds = reviews.map((review) => review.iduser);
    const users = await User.findAll({
      where: {
        id: userIds,
      },
    });

    const userMap = users.reduce((acc, user) => {
      acc[user.id] = {
        username: user.username,
        profilePhoto: user.profilePhoto || "",
      };
      return acc;
    }, {} as Record<number, { username: string; profilePhoto: string }>);

    let likedReviews: any[] = [];
    if (iduser) {
      likedReviews = await Like.findAll({
        where: {
          userId: Number(iduser),
          reviewId: reviews.map((review) => review.id),
        },
      });
    }

    const response = reviews.map((review) => {
      const isLiked = likedReviews.some((like) => like.reviewId === review.id);
      const user = userMap[review.iduser]; // Get the user details from the userMap
      return {
        ...review.toJSON(),
        liked: isLiked,
        user: {
          username: user ? user.username : null,
          profilePhoto: user ? user.profilePhoto : null,
        },
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

export const getReviewsByUserId = async (req: Request, res: Response) => {
  const { iduser } = req.params;

  if (!iduser) {
    res.status(400).json({ message: "User ID is required to fetch reviews" });
    return;
  }

  console.log("Fetching reviews for user ID:", iduser);

  try {
    const reviews = await Review.findAll({
      where: {
        iduser: iduser,
      },
    });

    if (reviews.length === 0) {
      res.status(404).json({ message: "No reviews found for this user" });
      return;
    }

    const detailedReviews = await Promise.all(
      reviews.map(async (review) => {
        const book = await Book.findOne({ where: { id: review.isbn } });

        return {
          reviewId: review.id,
          content: review.texto,
          likes: review.likes,
          calification: review.calification,
          book: book
            ? {
                id: book.id,
                title: book.title,
                author: book.author,
                coverImage: book.coverimage,
              }
            : null,
        };
      })
    );

    res.status(200).json(detailedReviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ message: "Error fetching user reviews", error });
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
      res
        .status(404)
        .json({ message: "No review found for this book by the user" });
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

  console.log(
    "Deleting review with ID from book:",
    isbn,
    "by user ID:",
    iduser
  );

  if (!isbn) {
    res.status(400).json({ message: "ID is required to fetch review" });
    return;
  }

  if (!iduser) {
    res
      .status(400)
      .json({ message: "User ID from user is required to fetch review" });
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

    const book = await Book.findOne({ where: { id: isbn } });
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    const totalReviews = book.numberreviews - 1;

    const updateFields: any = {
      numberreviews: totalReviews,
    };

    if (review.calification === 1) {
      updateFields.oneStarCount = book.oneStarCount - 1;
    } else if (review.calification === 2) {
      updateFields.twoStarCount = book.twoStarCount - 1;
    } else if (review.calification === 3) {
      updateFields.threeStarCount = book.threeStarCount - 1;
    } else if (review.calification === 4) {
      updateFields.fourStarCount = book.fourStarCount - 1;
    } else if (review.calification === 5) {
      updateFields.fiveStarCount = book.fiveStarCount - 1;
    }

    if (totalReviews === 0) {
      updateFields.averagerating = 0;
    } else {
      const totalRating =
        (book.averagerating * book.numberreviews - review.calification) /
        totalReviews;
      updateFields.averagerating = totalRating;
    }

    await book.update(updateFields);
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

    const book = await Book.findOne({ where: { id: id_book } });
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    const totalReviews = book.numberreviews - 1;

    const updateFields: any = {
      numberreviews: totalReviews,
    };

    if (review.calification === 1) {
      updateFields.oneStarCount = book.oneStarCount - 1;
    } else if (review.calification === 2) {
      updateFields.twoStarCount = book.twoStarCount - 1;
    } else if (review.calification === 3) {
      updateFields.threeStarCount = book.threeStarCount - 1;
    } else if (review.calification === 4) {
      updateFields.fourStarCount = book.fourStarCount - 1;
    } else if (review.calification === 5) {
      updateFields.fiveStarCount = book.fiveStarCount - 1;
    }

    if (totalReviews === 0) {
      updateFields.averagerating = 0;
    } else {
      const totalRating =
        (book.averagerating * book.numberreviews - review.calification) /
        totalReviews;
      updateFields.averagerating = totalRating;
    }

    await book.update(updateFields);
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

    console.log(
      "Toggling like for review ID:",
      reviewId,
      "by user ID:",
      iduser
    );

    if (!iduser) {
      res.status(400).json({ error: "User ID is required." });
      return;
    }

    const review = await Review.findByPk(reviewId);
    if (!review) {
      res.status(404).json({ error: "Review not found." });
      return;
    }

    const existingLike = await Like.findOne({
      where: { userId: Number(iduser), reviewId },
    });

    if (existingLike) {
      await existingLike.destroy();
      review.likes = Math.max(0, review.likes - 1);
      await review.save();

      res.status(200).json({
        message: "Review unliked.",
        liked: false,
        likes: review.likes,
      });
      return;
    } else {
      await Like.create({ userId: Number(iduser), reviewId });
      review.likes += 1;
      await review.save();

      res.status(200).json({
        message: "Review liked.",
        liked: true,
        likes: review.likes,
      });
      return;
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error toggling like.", error });
    return;
  }
};

export const createMultipleReviews = async (req: Request, res: Response) => {
  const reviews = req.body.reviews;

  if (!Array.isArray(reviews)) {
    res.status(400).json({ message: "Se espera un array de reseñas" });
    return;
  }

  const responses = [];

  for (const review of reviews) {
    const { isbn, texto, iduser, calification } = review;

    if (!calification || calification < 1 || calification > 5) {
      responses.push({
        isbn,
        iduser,
        message: "La calificación es obligatoria y debe estar entre 1 y 5 estrellas",
        status: 400,
      });
      continue;
    }

    try {
      const id = isbn;
      const book = await Book.findOne({ where: { id } });
      if (!book) {
        responses.push({ isbn, iduser, message: "El libro no existe", status: 404 });
        continue;
      }

      const user = await User.findByPk(iduser);
      if (!user) {
        responses.push({ isbn, iduser, message: "El usuario no existe", status: 404 });
        continue;
      }

      const existingReview = await Review.findOne({ where: { isbn, iduser } });
      if (existingReview) {
        const oldCalification = existingReview.calification;

        existingReview.texto = texto;
        existingReview.calification = calification;
        await existingReview.save();

        if (oldCalification !== calification) {
          const totalReviews = book.numberreviews;
          const updatedRating = 
            (book.averagerating * totalReviews - oldCalification + calification) /
            totalReviews;

          updateStarCounts(book, oldCalification, calification);

          await book.update({
            averagerating: updatedRating,
            oneStarCount: book.oneStarCount,
            twoStarCount: book.twoStarCount,
            threeStarCount: book.threeStarCount,
            fourStarCount: book.fourStarCount,
            fiveStarCount: book.fiveStarCount,
          });
        }

        responses.push({ isbn, iduser, review: existingReview, status: 200 });
      } else {
        const newReview = await Review.create({
          isbn,
          texto,
          likes: 0,
          calification,
          iduser,
        });

        const totalReviews = book.numberreviews + 1;
        const updatedRating = 
          (book.averagerating * book.numberreviews + calification) /
          totalReviews;

        book.numberreviews = totalReviews;
        updateStarCounts(book, 0, calification);

        await book.update({
          numberreviews: totalReviews,
          averagerating: updatedRating,
          oneStarCount: book.oneStarCount,
          twoStarCount: book.twoStarCount,
          threeStarCount: book.threeStarCount,
          fourStarCount: book.fourStarCount,
          fiveStarCount: book.fiveStarCount,
        });

        responses.push({ isbn, iduser, review: newReview, status: 201 });
      }
    } catch (error) {
      console.error("Error during review creation or update:", error);
      responses.push({
        isbn,
        iduser,
        message: "Error creating or updating review",
        error,
        status: 500,
      });
    }
  }

  res.status(207).json(responses);
};

const updateStarCounts = (book: any, oldRating: number, newRating: number) => {
  if (oldRating === 1) book.oneStarCount -= 1;
  else if (oldRating === 2) book.twoStarCount -= 1;
  else if (oldRating === 3) book.threeStarCount -= 1;
  else if (oldRating === 4) book.fourStarCount -= 1;
  else if (oldRating === 5) book.fiveStarCount -= 1;

  if (newRating === 1) book.oneStarCount += 1;
  else if (newRating === 2) book.twoStarCount += 1;
  else if (newRating === 3) book.threeStarCount += 1;
  else if (newRating === 4) book.fourStarCount += 1;
  else if (newRating === 5) book.fiveStarCount += 1;
};
