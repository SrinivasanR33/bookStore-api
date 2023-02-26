const Book = require("../models/Book");
const User = require("../models/User");
const ImageData = require("../models/image-modal");
const BookMapping = require("../models/BookMap");

const getAllMapping = async (req, res) => {
  // Get all notes from MongoDB
  const books = await BookMapping.find().lean();

  // If no notes
  if (!books?.length) {
    return res.status(400).json({ message: "No books found" });
  }

  res.json(books);
};

const createNewNote = async (req, res) => {
    const { bookName, username, email, dateOfReturn } = req.body;
  
    // Confirm data
    if (!bookName || !username || !email || !dateOfReturn) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    // Check for duplicate title
    const duplicate = await BookMapping.findOne({ bookName })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
  
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate book name" });
    }
  
    // Create and store the new user
    const note = await Book.create({
      bookName,
      username,
      email,
      dateOfReturn,
    });
  
    if (note) {
      // Created
      return res.status(201).json({ message: "New Book created" });
    } else {
      return res.status(400).json({ message: "Invalid book data received" });
    }
  };
