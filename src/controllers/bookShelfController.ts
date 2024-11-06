import { Request, Response } from "express";
import Book from "../models/Book";
import { Op } from "sequelize";
import { BookShelf, BookShelfBooks } from "../models/BookShelf";
import sequelize from "../config/db";

export const getUserBookshelves = async (req: Request, res: Response) => {
  const { id_usuario } = req.params;
  console.log(id_usuario);

  if (!id_usuario) {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  try {
    const bookshelves = await BookShelf.findAll({
      where: { id_usuario },
      include: [{ model: Book }],
    });

    if (bookshelves.length === 0) {
      res.status(404).json({ message: "No bookshelves found for this user." });
      return;
    }

    res.status(200).json(bookshelves);
  } catch (error) {
    console.error("Error retrieving user's bookshelves:", error);
    res.status(500).json({
      message: "An error occurred while retrieving bookshelves.",
      error,
    });
  }
};

export const createBookShelf = async (req: Request, res: Response) => {
  const { title, id_usuario } = req.body;

  if (!title || !id_usuario) {
    res.status(400).json({ message: "Title and user ID are required." });
    return;
  }

  try {
    // Check if a bookshelf with the same title already exists for the user
    const existingLibrary = await BookShelf.findOne({
      where: { title, id_usuario },
    });

    if (existingLibrary) {
      return res
        .status(409)
        .json({
          message: "A bookshelf with this title already exists for this user.",
        });
    }

    // Create the new bookshelf
    const newLibrary = await BookShelf.create({
      title,
      id_usuario,
      created_at: new Date(),
    });

    res.status(201).json(newLibrary);
  } catch (error) {
    console.error("Error during library creation:", error);
    res.status(500).json({ message: "Error creating library", error });
  }
};

export const addBookToBookshelf = async (req: Request, res: Response) => {
  console.log(req.body);
  const { bookshelfId, bookId } = req.body;

  if (!bookshelfId || !bookId) {
    res.status(400).json({ message: "Bookshelf ID and Book ID are required." });
    return;
  }

  try {
    const bookShelf = await BookShelf.findByPk(bookshelfId);
    const book = await Book.findByPk(bookId);

    if (!bookShelf || !book) {
      res.status(404).json({ message: "Bookshelf or Book not found" });
      return;
    }

    await sequelize.models.bookshelf_books.create({
      bookshelf_id: bookshelfId,
      book_id: bookId,
    });

    res.status(200).json({ message: "Book successfully added to bookshelf." });
  } catch (error) {
    console.error("Error adding book to bookshelf:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};

export const updateBookshelfFromBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { bookId } = req.params;
  const { bookshelfIds, userId } = req.body;

  // Validate the request body
  if (!bookshelfIds || !userId || !bookId) {
    res.status(400).json({
      message: "Bookshelf IDs, Book ID, and User ID are required.",
    });
  }

  console.log("Received bookshelf ids:", bookshelfIds);

  try {
    // 1. Get the existing bookshelf associations for the book
    const existingRelations = await BookShelfBooks.findAll({
      where: { bookId },
      attributes: ["bookshelfId"],
    });

    // 2. Extract the bookshelfIds from the existing relations
    const existingBookshelfIds = existingRelations.map(
      (relation: any) => relation.bookshelfId
    );

    // 3. Remove associations for bookshelves that are no longer part of the new list
    const shelvesToRemove = existingBookshelfIds.filter(
      (id) => !bookshelfIds.includes(id)
    );
    if (shelvesToRemove.length > 0) {
      await BookShelfBooks.destroy({
        where: {
          bookId,
          bookshelfId: shelvesToRemove,
        },
      });
      console.log("Removed associations for shelves:", shelvesToRemove);
    }

    // 4. Add associations for new bookshelves that the book is not already part of
    const shelvesToAdd = bookshelfIds.filter(
      (id: any) => !existingBookshelfIds.includes(id)
    );
    if (shelvesToAdd.length > 0) {
      const newRelations = shelvesToAdd.map((bookshelfId: any) => ({
        bookshelfId,
        bookId,
      }));

      await BookShelfBooks.bulkCreate(newRelations);
      console.log("Added associations for shelves:", shelvesToAdd);
    }

    // 5. Send the success response after processing
    res.status(200).json({ message: "Bookshelf updated successfully." });
  } catch (error) {
    console.error("Error updating bookshelf:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};

export const removeBookFromBookshelf = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { bookshelfId, bookId } = req.body;

  if (!bookshelfId || !bookId) {
    res.status(400).json({ message: "Bookshelf ID and Book ID are required." });
    return;
  }

  try {
    const bookshelf = await BookShelf.findByPk(bookshelfId);
    const book = await Book.findByPk(bookId);

    if (!bookshelf || !book) {
      res.status(404).json({ message: "Bookshelf or Book not found" });
      return;
    }
    console.log("Bookshelf ID:", bookshelfId, "Book ID:", bookId);

    // Confirm the association before deleting
    const existingBookInBookshelf = await BookShelfBooks.findOne({
      where: { bookshelfId, bookId },
    });

    if (existingBookInBookshelf) {
      await existingBookInBookshelf.destroy();
      res
        .status(200)
        .json({ message: "Book successfully removed from bookshelf." });
    } else {
      res
        .status(404)
        .json({ message: "Book was not associated with this bookshelf." });
    }
  } catch (error) {
    console.error("Error removing book from bookshelf: ", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};

export const getUserBookshelvesFromBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { bookId } = req.body;

  if (!userId || !bookId) {
    res.status(400).json({ message: "User ID and Book ID are required." });
    return;
  }

  try {
    const bookshelves = await BookShelf.findAll({
      where: { id_usuario: userId },
      include: [
        {
          model: Book,
          where: { id: bookId },
          through: { attributes: [] },
          attributes: [],
        },
      ],
      attributes: ["id", "title"],
    });

    if (bookshelves.length === 0) {
      res.status(404).json({ message: "No bookshelves found for the book." });
      return;
    }

    const bookshelvesData = bookshelves.map((bookshelf) => ({
      id: bookshelf.id,
      title: bookshelf.title,
    }));

    // Send the response
    res.status(200).json(bookshelvesData);
  } catch (error) {
    console.error("Error finding bookshelves for book: ", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};
