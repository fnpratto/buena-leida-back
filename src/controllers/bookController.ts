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
      genre: book.genre,
      summary: book.summary || "none",
      reviews: book.reviews || [],
      averagerating: book.averagerating,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching book data", error });
  }
};


export const createBook = async (req: Request, res: Response) => {
  const { title, author, coverimage, genre, summary, averagerating, reviews } = req.body;

  try {
    const newBook = await Book.create({
      title,
      author,
      coverimage,
      genre,
      summary,
      averagerating,
      reviews,
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error during book creation:", error);
    res.status(500).json({ message: "Error creating book", error });
  }
};