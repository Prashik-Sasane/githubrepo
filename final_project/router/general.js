const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ==================== LOGIN ====================

public_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    user => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }

  const token = jwt.sign(
    { username: username },
    "secretkey",
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    message: "Login successful",
    token: token
  });
});


// ==================== REGISTER ====================

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User successfully registered"
  });
});


// ==================== GET ALL BOOKS ====================

public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});


// ==================== GET BOOK BY ISBN ====================

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// ==================== GET BOOKS BY AUTHOR ====================

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const result = Object.values(books).filter(
    book => book.author.toLowerCase() === author.toLowerCase()
  );

  return res.status(200).json(result);
});


// ==================== GET BOOKS BY TITLE ====================

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const result = Object.values(books).filter(
    book => book.title.toLowerCase() === title.toLowerCase()
  );

  return res.status(200).json(result);
});


// ==================== GET BOOK REVIEWS ====================

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// ============================================================
// TASK 11 - AXIOS ASYNC/AWAIT IMPLEMENTATIONS
// ============================================================

// Retrieve all books using Axios
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    throw new Error("Unable to retrieve all books");
  }
}


// Retrieve book details by ISBN using Axios
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(
      `http://localhost:5000/isbn/${encodeURIComponent(isbn)}`
    );

    return response.data;
  } catch (error) {
    throw new Error("Unable to retrieve book by ISBN");
  }
}


// Retrieve books by author using Axios
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );

    return response.data;
  } catch (error) {
    throw new Error("Unable to retrieve books by author");
  }
}


// Retrieve books by title using Axios
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );

    return response.data;
  } catch (error) {
    throw new Error("Unable to retrieve books by title");
  }
}


module.exports.general = public_users;

// Export Axios functions for Task 11
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;