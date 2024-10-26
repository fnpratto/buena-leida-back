import Review from "./Review";
import Book from "./Book";

//Review.belongsTo(Book, { foreignKey: "isbn" });
//Book.hasMany(Review, { foreignKey: "isbn" });

export { Review, Book };
