import { Request, Response } from "express";
import Book from "../models/Book";

export const getBooks = async (req: Request, res: Response) => {
  const books = await Book.findAll();
  res.json(books);
};

export const createBook = async (req: Request, res: Response) => {
  const { title, author } = req.body;
  const newBook = await Book.create({ title, author });
  res.json(newBook);
};
