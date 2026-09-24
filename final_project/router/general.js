const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register
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

// Get all books using Axios Promise
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});

// Get book by ISBN using Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get(
      `http://localhost:5000/isbn/${req.params.isbn}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});

// Get books by author using Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(req.params.author)}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Books not found"
    });
  }
});

// Get books by title using Axios
public_users.get('/title/:title', async function (req, res) {
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(req.params.title)}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Books not found"
    });
  }
});

// Get book review
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