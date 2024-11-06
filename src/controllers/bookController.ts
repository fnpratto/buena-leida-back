import { Request, Response } from "express";
import Book from "../models/Book";
import { Op } from "sequelize";

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
      oneStarCount: book.oneStarCount,
      twoStarCount: book.twoStarCount,
      threeStarCount: book.threeStarCount,
      fourStarCount: book.fourStarCount,
      fiveStarCount: book.fiveStarCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book data", error });
  }
};

export const getBookByAuthor = async (req: Request, res: Response) => {
  const { author } = req.params;

  try {
    const books = await Book.findAll({
      where: {
        author: {
          [Op.iLike]: `%${author}%`,
        },
      },
    });

    if (books.length === 0) {
      res.status(404).json({ message: "No books found for this author" });
      return;
    }

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book data", error });
  }
};

export const getBookByName = async (req: Request, res: Response) => {
  const { title } = req.params;

  try {
    const books = await Book.findAll({
      where: {
        title: {
          [Op.iLike]: `%${title}%`,
        },
      },
    });

    if (books.length === 0) {
      res.status(404).json({ message: "No books found with this title" });
      return;
    }

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book data", error });
  }
};

export const getBookByTitleAndAuthor = async (req: Request, res: Response) => {
  const { title, author } = req.params;

  try {
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${title}%`,
            },
          },
          {
            author: {
              [Op.iLike]: `%${author}%`,
            },
          },
        ],
      },
    });

    if (books.length === 0) {
      res
        .status(404)
        .json({ message: "No books found for this title or author" });
      return;
    }

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book data", error });
  }
};

export const createBook = async (bookData: any) => {
  const {
    id,
    title,
    author,
    coverimage,
    publication_date,
    genre,
    summary,
    averagerating,
    numberreviews,
  } = bookData;

  if (!id || !title || !author || !publication_date || !genre || !summary) {
    return { error: "Id, Title, Author, Publication Date, Genre, and Summary are required." };
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
      oneStarCount: 0,
      twoStarCount: 0,
      threeStarCount: 0,
      fourStarCount: 0,
      fiveStarCount: 0,
    });

    return { book: newBook };
  } catch (error) {
    console.error("Error during book creation:", error);
    return { error: "Error creating book", details: error };
  }
};

export const createBooks = async (req: Request, res: Response) => {
  const books = req.body;

  if (!Array.isArray(books)) {
    res.status(400).json({
      message: "An array of books is required.",
    });
    return;
  }

  const createdBooks = [];
  const failedBooks = [];

  for (const bookData of books) {
    const result = await createBook(bookData);
    if (result.book) {
      createdBooks.push(result.book);
    } else {
      failedBooks.push({ bookData, error: result.error, details: result.details });
    }
  }

  res.status(201).json({
    message: "Books processed",
    createdBooks,
    failedBooks,
  });
  return;
};



export const getRatingsCountByISBN = async (req: Request, res: Response) => {
  const { isbn } = req.params;

  if (!isbn) {
    res
      .status(400)
      .json({ message: "ISBN is required to fetch ratings count" });
    return;
  }

  try {
    const book = await Book.findOne({ where: { isbn } });

    if (!book) {
      res.status(404).json({ message: "El libro no existe" });
      return;
    }

    res.status(200).json({
      oneStarCount: book.oneStarCount,
      twoStarCount: book.twoStarCount,
      threeStarCount: book.threeStarCount,
      fourStarCount: book.fourStarCount,
      fiveStarCount: book.fiveStarCount,
      averagerating: book.averagerating,
    });
  } catch (error) {
    console.error("Error fetching ratings count:", error);
    res.status(500).json({ message: "Error fetching ratings count", error });
  }
};
