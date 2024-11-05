import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import bookShelfController from "./routes/bookShelfRoutes";
import cors from "cors";
import { BookShelf } from "./models/BookShelf";
import ReadingState from "./models/ReadingState";
import Book from "./models/Book";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "OPTIONS", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

BookShelf.belongsToMany(Book, { through: 'bookshelf_books', foreignKey: 'bookshelf_id' });
Book.belongsToMany(BookShelf, { through: 'bookshelf_books', foreignKey: 'book_id' });


ReadingState.belongsTo(Book, { foreignKey: "bookId" });
Book.hasOne(ReadingState, { foreignKey: "bookId" });

app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/reviews", reviewRoutes);
app.use("/bookshelf", bookShelfController);
app.use("/readingstate", require("./routes/readingStateRoutes").default);



// Sync the models with the database and start the server
sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to sync database:", error);
  });
