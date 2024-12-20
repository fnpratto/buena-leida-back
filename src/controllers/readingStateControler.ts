import { Request, Response } from "express";
import ReadingState from "../models/ReadingState";
import Book from "../models/Book";

export const saveBookReadingState = async (req: Request, res: Response) => {
    const { bookId, status, userId} = req.body;

    if (!bookId || !status || !userId) {
        res.status(400).json({ message: "Book ID, user ID and status are required." });
        return
    }

    try {
        const book = await Book.findByPk(bookId);
        if (!book) {
            res.status(404).json({ message: "Book not found." });
            return;
        }

        const existingReadingState = await ReadingState.findOne({ where: { bookId,userId  } });
        if (existingReadingState) {

            existingReadingState.status = status;
            await existingReadingState.save();
            res.status(200).json({ message: "Reading state updated successfully." });
            return;
        }

        const newReadingState = await ReadingState.create({ bookId, status,userId});
        res.status(201).json(newReadingState);
        return
    } catch (error) {
        console.error("Error saving reading state:", error);
        res.status(500).json({ message: "An error occurred while saving the reading state." });
        return;
    }
};

export const getReadingStateForBook = async (req: Request, res: Response) => {
    const { bookId,userId  } = req.params;

    try {
        const readingState = await ReadingState.findOne({ where: { bookId,userId } });
        if (!readingState) {
            res.status(404).json({ message: "Reading state not found for this book and user." });
            return;
        }
        res.status(200).json(readingState);
        return;
    } catch (error) {
        console.error("Error retrieving reading state:", error);
        res.status(500).json({ message: "An error occurred while retrieving the reading state." });
        return;
    }
};



export const getBooksByReadingState = async (req: Request, res: Response) => {
    const { status,userId } = req.params;

    if (!status||!userId) {
        res.status(400).json({ message: "User ID and Reading state status is required." });
        return;
    }

    try {
        const readingStates = await ReadingState.findAll({
            where: { status,userId },
        });

        if (readingStates.length === 0) {
            res.status(404).json({ message: "No books found with this reading state." });
            return;
        }

        const bookIds = readingStates.map((readingState) => readingState.bookId);

        const books = await Book.findAll({
            where: {
                id: bookIds,
            },
        });

        res.status(200).json(books);
        return;
    } catch (error) {
        console.error("Error retrieving books by reading state:", error);
        res.status(500).json({ message: "An error occurred while retrieving the books.", error });
        return;
    }
};

export const removeBookReadingState = async (req: Request, res: Response) => {
    const { bookId, userId} = req.body;

    if (!bookId || !userId) {
        res.status(400).json({ message: "Book ID and user ID are required." });
        return
    }
    try {
        const book = await Book.findByPk(bookId);
        if (!book) {
            res.status(404).json({ message: "Book not found." });
            return;
        }
        const existingReadingState = await ReadingState.findOne({ where: { bookId,userId  } });
        if (!existingReadingState) {
            res.status(404).json({ message: "The book doesn't have a reading state" });
            return;
        }
        await existingReadingState.destroy();
        res.status(200).json("Reading state succesfully removed.");
        return
    } catch (error) {
        console.error("Error removing reading state:", error);
        res.status(500).json({ message: "An error occurred while removing the reading state." });
        return;
    }
};