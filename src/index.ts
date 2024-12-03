import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import groupRoutes from "./routes/groupRoutes";
import groupDiscussionRoutes from "./routes/groupDiscussionRoutes";
import bookShelfController from "./routes/bookShelfRoutes";
import cors from "cors";
import { BookShelf } from "./models/BookShelf";
import ReadingState from "./models/ReadingState";
import Book from "./models/Book";
import User from "./models/User";
import { Group } from "./models/Group";
import { GroupDiscussion } from "./models/GroupDiscussion";
import friendshipRoutes from "./routes/friendshipRoutes";
import Friendship from "./models/Friendship";  
import Comment from "./models/DiscussionComment";
import friendRequestRoutes from "./routes/friendRequestRoutes";
import FriendRequest from "./models/FriendRequest";
import homeRoutes from "./routes/homeRoutes";

dotenv.config();

const app = express();

const corsOptions = cors({
  origin: ["https://buena-leida-ui.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PATCH", "OPTIONS", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
})

app.use(corsOptions);
app.options("*", corsOptions);

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
  through: "GroupUsers",
  foreignKey: "userId",
  otherKey: "groupId",
  as: "groups",
});

User.belongsToMany(User, {
  through: Friendship,
  as: "friends",
  foreignKey: "userid",
  otherKey: "friendid",
});

Group.belongsToMany(User, {
  through: "GroupUsers",
  foreignKey: "groupId",
  otherKey: "userId",
  as: "users",
});

ReadingState.belongsTo(Book, { foreignKey: "bookId" });
Book.hasOne(ReadingState, { foreignKey: "bookId" });

Group.hasMany(GroupDiscussion, {
  foreignKey: "groupId",
  as: "discussions",
  onDelete: "CASCADE",
});

GroupDiscussion.belongsTo(Group, {
  foreignKey: "groupId",
  as: "group",
});

User.hasMany(Friendship, { foreignKey: "userid" });
User.hasMany(Friendship, { foreignKey: "friendid" });
Friendship.belongsTo(User, { foreignKey: 'userid', as: 'User' });   
Friendship.belongsTo(User, { foreignKey: 'friendid', as: 'Friend' }); 
FriendRequest.belongsTo(User, { foreignKey: 'receiverid'});  


Comment.belongsTo(User, { foreignKey: 'iduser', as: 'user' });
User.hasMany(Comment, { foreignKey: 'iduser', as: 'comments' });

app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/reviews", reviewRoutes);
app.use("/bookshelf", bookShelfController);
app.use("/readingstate", require("./routes/readingStateRoutes").default);
app.use("/groups", groupRoutes);
app.use("/discussions", groupDiscussionRoutes);
app.use("/friendships", friendshipRoutes);
app.use("/friend-requests", friendRequestRoutes);
app.use("/home", homeRoutes);

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
