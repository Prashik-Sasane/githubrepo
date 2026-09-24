const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


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

public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(
      'https://openlibrary.org/subjects/fiction.json?limit=10'
    );

    const booksData = {};

    response.data.works.forEach((book, index) => {
      booksData[index + 1] = {
        author: book.authors && book.authors.length > 0
          ? book.authors[0].name
          : "Unknown",
        title: book.title,
        reviews: {}
      };
    });

    return res.status(200).json(booksData);

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});


// ==================== GET BOOK BY ISBN ====================

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(
      `https://openlibrary.org/isbn/${isbn}.json`
    );

    return res.status(200).json({
      isbn: isbn,
      title: response.data.title,
      authors: response.data.authors || []
    });

  } catch (error) {
    // Fall back to the local assignment database
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
      message: "Book not found"
    });
  }
});


// ==================== GET BOOKS BY AUTHOR ====================

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}`
    );

    const result = response.data.docs.slice(0, 10).map(book => ({
      author: author,
      title: book.title,
      reviews: {}
    }));

    return res.status(200).json(result);

  } catch (error) {
    // Fall back to local database
    const result = Object.values(books).filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );

    return res.status(200).json(result);
  }
});


// ==================== GET BOOKS BY TITLE ====================

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
    );

    const result = response.data.docs.slice(0, 10).map(book => ({
      author: book.author_name
        ? book.author_name[0]
        : "Unknown",
      title: book.title,
      reviews: {}
    }));

    return res.status(200).json(result);

  } catch (error) {
    // Fall back to local database
    const result = Object.values(books).filter(
      book => book.title.toLowerCase() === title.toLowerCase()
    );

    return res.status(200).json(result);
  }
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


module.exports.general = public_users;