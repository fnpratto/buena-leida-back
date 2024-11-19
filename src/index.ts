import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import groupRoutes from "./routes/groupRoutes";
import groupDiscussionRoutes from "./routes/groupDiscussionRoutes"
import bookShelfController from "./routes/bookShelfRoutes";
import cors from "cors";
import { BookShelf } from "./models/BookShelf";
import ReadingState from "./models/ReadingState";
import Book from "./models/Book";
import User from "./models/User";
import {Group} from "./models/Group";
import { GroupDiscussion } from "./models/GroupDiscussion";

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

BookShelf.belongsToMany(Book, {
  through: "BookShelfBooks",
  foreignKey: "bookshelfId",
  otherKey: "bookId",
});

Book.belongsToMany(BookShelf, {
  through: "BookShelfBooks",
  foreignKey: "bookId",
  otherKey: "bookshelfId",
});

User.belongsToMany(Group, {
  through: "UserGroups", 
  foreignKey: "userId", 
  otherKey: "groupId",  
});

Group.belongsToMany(User, {
  through: "UserGroups", 
  foreignKey: "groupId", 
  otherKey: "userId",    
});

ReadingState.belongsTo(Book, { foreignKey: "bookId" });
Book.hasOne(ReadingState, { foreignKey: "bookId" });

Group.hasMany(GroupDiscussion, {
  foreignKey: "id"
});

GroupDiscussion.belongsTo(Group, {
  foreignKey: "id"
});


app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/reviews", reviewRoutes);
app.use("/bookshelf", bookShelfController);
app.use("/readingstate", require("./routes/readingStateRoutes").default);
app.use('/groups', groupRoutes);
app.use('/discussions', groupDiscussionRoutes);


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
