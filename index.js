const express = require("express");
const app = express();
const { initializeDatabase } = require("./db/db.connect");
// const fs = require("fs");
const Books = require("./models/books.models");

initializeDatabase();

// const jsonData = fs.readFileSync("books.json", "utf-8");
// const booksData = JSON.parse(jsonData);

app.use(express.json());

// function seedData() {
//   try {
//     for (const bookData of booksData) {
//       const newBook = new Books({
//         title: bookData.title,
//         author: bookData.author,
//         publishedYear: bookData.publishedYear,
//         genre: bookData.genre,
//         language: bookData.language,
//         country: bookData.country,
//         rating: bookData.rating,
//         summary: bookData.summary,
//         coverImageUrl: bookData.coverImageUrl,
//       });

//       newBook.save();
//     }
//   } catch (error) {
//     console.log("Error seeding the data", error);
//   }
// }

// seedData();

app.get("/books", async (req, res) => {
  try {
    const book = await Books.find();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Error occured while fetching data." });
  }
});


async function createBooks(newBook){
  try{
    const book = new Books(newBook)
    const saveBook = await book.save()
    return saveBook
  } catch(error){
    throw error
  }
}

app.post("/books", async (req, res) => {
  try{
    const savedBooks = await createBooks(req.body)
    res.status(201).json({message: "Book added successfully.", book: savedBooks})
  } catch(error){
    res.status(500).json({error: "Failed to add book."})
  }
})

// Find all the books from database

async function readAllBooks(){
  try{
    const allBooks = await Books.find()
    return allBooks
  } catch (error){
    console.log(error)
  }
}

app.get("/books", async (req, res) => {
  try{
    const books = await readAllBooks()
    if(books.length != 0){
      res.json(books)
    } else{
      res.status(404).json({error: "No books found"})
    }
  } catch (error){
    res.status(500).json({error: "Failed to fetch books data"})
  }
})

// Find book details by it's title

async function readBooksByTitle(bookTitle){
  try{
    const bookByTitle = await Books.find({title: bookTitle})
    return bookByTitle
  } catch (error){
    console.log(error)
  }
}

app.get("/books/:bookTitle", async (req, res) => {
  try{
    const books = await readBooksByTitle(req.params.bookTitle)
    if(books.length != 0){
      res.json(books)
    } else{
      res.status(404).json({error: "No Book found"})
    }
  } catch (error){
    res.status(500).json({error: "Failed to fetch book data"})
  }
})

// find book details by it's author

async function readBooksByAuthor(bookAuthor){
  try{
    const bookByAuthor = await Books.find({author: bookAuthor})
    return bookByAuthor
  } catch(error){
    console.log(error)
  }
}

app.get("/books/authorName/:bookAuthor", async (req, res) => {
  try{
    const books = await readBooksByAuthor(req.params.bookAuthor)
    if(books.length != 0){
      res.json(books)
    } else{
      res.status(404).json({error: "No book found"})
    }
  } catch (error){
    res.status(500).json({error: "Failed to fetch book data"})
  }
})

// find book details by genre

async function readBooksByGenre(bookGenre){
  try{
    const books = await Books.find({genre: bookGenre})
    return books
  } catch (error){
    console.log(error)
  }
}

app.get("/books/genre/:bookGenre", async (req, res) => {
  try{
    const books = await readBooksByGenre(req.params.bookGenre)
    if(books.length != 0){
      res.json(books)
    } else{
      res.status(404).json({error: "No book found"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to fetch book data"})
  }
})

// find book details by released year

async function readBooksByReleasedYear(bookReleasedYear){
  try{
    const books = await Books.find({publishedYear: bookReleasedYear})
    return books
  } catch (error){
    console.log(error)
  }
}

app.get("/books/publishedYear/:releasedYear", async (req, res) => {
  try{
    const books = await readBooksByReleasedYear(req.params.releasedYear)
    if(books.length != 0){
      res.json(books)
    } else{
      res.status(404).json({error: "No book found"})
    }
  } catch (error){
    res.status(500).json({error: "Failed to fetch book data"})
  }
})

// update book's rating with the help of it's id

async function readBooksById(bookId, dataToUpdate){
  try{
    const updatedBook = await Books.findByIdAndUpdate(bookId, dataToUpdate, {new: true})
    return updatedBook
  } catch (error){
    console.log("Error in updating book rating", error)
  }
}

app.post("/books/:bookId", async (req, res) => {
  try{
    const updatedBook = await readBooksById(req.params.bookId, req.body)
    if(updatedBook){
      res.status(200).json({message: "Book data updated successfully.", updatedBook: updatedBook})
    } else{
      res.status(404).json({error: "Book not found"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to update book data."})
  }
})

// Update book details by it's title

async function readAllBooksByTitle(bookTitle, dataToUpdate){
  try{
    const book = await Books.findOneAndUpdate({title: bookTitle}, dataToUpdate, {new: true})
    return book
  } catch(error){
    console.log("Error in updating Book data.", error)
  }
}

app.post("/books/title/:bookTitle", async (req, res) => {
  try{
    const book = await readAllBooksByTitle(req.params.bookTitle, req.body)
    if(book){
      res.status(200).json({message: "Book update successfully", book: book})
    } else{
      res.status(404).json({error: "Book not found"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to update book data."})
  }
})

// Delete a book with the help of book id

async function readAllBooksById(bookId){
  try{
    const deletedBook = await Books.findByIdAndDelete(bookId)
    return deletedBook
  } catch(error){
    console.log(error)
  }
}

app.delete("/books/:bookId", async (req, res) => {
  try{
    const deletedBook = await readAllBooksById(req.params.bookId)
    if(deletedBook){
      res.status(200).json({message: "Book deleted successfully."})
    } 
  } catch(error){
    res.status(500).json({error: "Failed to delete book."})
  }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on  ${PORT}`);
});
