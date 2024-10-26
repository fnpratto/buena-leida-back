import { Request, Response } from "express";
import Book from "../models/Book";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const book = await Book.findByPk(id);

    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.json({
      title: book.title,
      author: book.author,
      coverimage: book.coverimage || "default-cover.jpg",
      publication_date: book.publication_date,
      genre: book.genre,
      summary: book.summary || "none",
      numberreviews: book.numberreviews || 0,
      averagerating: book.averagerating,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching book data", error });
  }
};


export const createBook = async (req: Request, res: Response) => {
  const { id,title, author, coverimage,publication_date, genre, summary, averagerating,numberreviews } = req.body;

  if (!id || !title || !author || !publication_date || !genre || !summary) {
    res.status(400).json({ message: "Title, author, publication date, genre, and summary are required." });
    return;
  }

  try {
    const newBook = await Book.create({
      id,
      title,
      author,
      coverimage: coverimage || "default-cover.jpg",
      publication_date,
      genre,
      summary,
      averagerating: averagerating || 0.0, 
      numberreviews: numberreviews || 0,
      
    })

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error during book creation:", error);
    res.status(500).json({ message: "Error creating book", error });
  }
};