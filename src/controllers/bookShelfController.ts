import { Request, Response } from "express";
import Book from "../models/Book"; 
import { Op } from "sequelize";

import { BookShelf } from '../models/BookShelf'; 

export const createBookShelf = async (req: Request, res: Response) => {
  const { title, id_usuario } = req.body;

  if (!title || !id_usuario ) {
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
    const bookshelf = await BookShelf.findByPk(bookshelfId);
    const book = await Book.findByPk(bookId);

    if (!bookshelf || !book) {
      res.status(404).json({ message: "Bookshelf or Book not found" });
      return;
    }
    await (bookshelf as any).addBook(book); 

    res.status(200).json({ message: "Book successfully added to bookshelf." });
  } catch (error) {
    console.error("Error adding book to bookshelf:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
    return;
  }
};
