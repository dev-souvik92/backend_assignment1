const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publishedYear: {
    type: Number,
  },
  genre: [String],
  language: String,
  country: String,
  rating: Number,
  summary: String,
  coverImageUrl: String,
});

const Book = mongoose.model("Book", booksSchema);

module.exports = Book;
