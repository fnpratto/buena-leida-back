import { Request, Response } from "express";
import Book from "../models/Book";
import { Op } from "sequelize";
import { BookShelf, BookShelfBooks } from '../models/BookShelf';
import sequelize from "../config/db";


export const getUserBookshelves = async (req: Request, res: Response) => {
  const { id_usuario } = req.params;

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
    res.status(500).json({ message: "An error occurred while retrieving bookshelves.", error });
  }
};

export const createBookShelf = async (req: Request, res: Response) => {
  const { title, id_usuario } = req.body;

  if (!title || !id_usuario) {
    res.status(400).json({ message: "Title and user ID are required." });
    return;
  }

  try {
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

export const updateBookshelfFromBook = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const { bookshelfIds, userId } = req.body; 
  // bookshelfIds es un vector de los ids que vamos a modificar

  // if (!Array.isArray(bookshelfIds)) {
  //   return res.status(400).json({ error: 'El campo bookshelfIds debe ser un array.' });
  // }

  if (!bookshelfIds || !userId || !bookId) {
    res.status(400).json({ message: "Bookshelf IDs and Book ID and User ID are required." });
    return;
  }
  try {
    for (let i = 0; i < bookshelfIds.length; i++){
      const bookshelf = await BookShelf.findByPk(bookshelfIds[i]);
      const book = await Book.findByPk(bookId);
  
      if (!bookshelf || !book) {
        res.status(404).json({ message: "Bookshelf or Book not found" });
        return;
      }
      const relation_exists = await BookShelfBooks.findOne({
        where: {
          bookId: bookId,
          bookshelfId: bookshelfIds[i]
        }
      });
      if (relation_exists){
        await BookShelfBooks.destroy({ where: { bookId, bookshelfIds } });
      } else {
        await (BookShelfBooks as any).addBook(book);
      }
    }
    res.status(200).json({ message: "Book bookshelfs succesfully updated." });
  } catch (error) {
    console.error("Error updating bookshelf:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
    return;
  }
};

export const removeBookFromBookshelf = async (req: Request, res: Response) => {
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
    
    const existingBookInBookshelf = await BookShelfBooks.findOne({ where: {bookshelfId: bookshelfId, bookId: bookId} });
    if (existingBookInBookshelf) {
      await BookShelfBooks.destroy({where: { bookId: bookId, bookshelfId: bookshelfId}})
    }

    res.status(200).json({ message: "Book successfully removed from bookshelf." });

  } catch (error) {
    console.error("Error removing book from bookshelf: ", error);
    res.status(500).json({ message: "An unexpected error occurred." });
    return;
  }
}

export const getUserBookshelvesFromBook = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { bookId } = req.body;
  if (!userId || !bookId) {
    res.status(400).json({ message: "User ID and Book ID are required." });
    return;
  }
  try {
    const bookshelves = await BookShelf.findAll({
      where: { userId: userId },
      include: {
        model: BookShelfBooks,
        where: { bookId: bookId },
        attributes: []
      }
    });
    if (bookshelves.length === 0) {
      res.status(404).json({ message: "No bookshelves found for the book."});
      return;
    }
    let bookshelvesNamesFromUser = bookshelves.map(bookshelf => bookshelf.title);
    return res.status(200).json(bookshelvesNamesFromUser) as any
  } catch (error) {
    console.error("Error removing book from bookshelf: ", error);
    res.status(500).json({ message: "An unexpected error occurred." });
    return;
  }
}



