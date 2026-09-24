// ============================================================
// TASK 10-13 - AXIOS IMPLEMENTATIONS
// ============================================================

// Task 10 - Get all books using async/await with Axios
async function getAllBooks() {
  try {
    const response = await axios.get("http://localhost:5000/");
    return response.data;
  } catch (error) {
    throw new Error("Unable to retrieve all books");
  }
}


// Task 11 - Get book by ISBN using Promise with Axios
function getBookByISBN(isbn) {
  return axios
    .get(`http://localhost:5000/isbn/${encodeURIComponent(isbn)}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error("Unable to retrieve book by ISBN");
    });
}


// Task 12 - Get books by Author using async/await with Axios
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


// Task 13 - Get books by Title using async/await with Axios
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


// Export router
module.exports.general = public_users;

// Export Axios functions
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;