import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";

dotenv.config();

const app = express();

app.use(express.json());

// Register routes
app.use("/users", userRoutes);
app.use("/books", bookRoutes);

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
