import { Request, Response } from "express";
import ReadingState from "../models/ReadingState";
import Book from "../models/Book";

export const saveBookReadingState = async (req: Request, res: Response) => {
    const { bookId, status } = req.body;

    if (!bookId || !status) {
        res.status(400).json({ message: "Book ID and status are required." });
        return
    }

    try {
        const book = await Book.findByPk(bookId);
        if (!book) {
            res.status(404).json({ message: "Book not found." });
            return;
        }

        const existingReadingState = await ReadingState.findOne({ where: { bookId } });
        if (existingReadingState) {

            existingReadingState.status = status;
            await existingReadingState.save();
            res.status(200).json({ message: "Reading state updated successfully." });
            return;
        }

        const newReadingState = await ReadingState.create({ bookId, status });
        res.status(201).json(newReadingState);
        return
    } catch (error) {
        console.error("Error saving reading state:", error);
        res.status(500).json({ message: "An error occurred while saving the reading state." });
        return;
    }
};

export const getReadingStateForBook = async (req: Request, res: Response) => {
    const { bookId } = req.params;

    try {
        const readingState = await ReadingState.findOne({ where: { bookId } });
        if (!readingState) {
            res.status(404).json({ message: "Reading state not found for this book." });
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
    const { status } = req.params;

    if (!status) {
        res.status(400).json({ message: "Reading state status is required." });
        return;
    }

    try {
        const readingStates = await ReadingState.findAll({
            where: { status },
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