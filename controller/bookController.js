const Book = require("../models/Book");
const User = require("../models/User");
const ImageData = require("../models/image-modal");

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = async (req, res) => {
  // Get all notes from MongoDB
  const books = await Book.find().lean();

  // If no notes
  if (!books?.length) {
    return res.status(400).json({ message: "No books found" });
  }

  // Add username to each note before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  // const notesWithUser = await Promise.all(notes.map(async (note) => {
  //     const user = await User.findById(note.user).lean().exec()
  //     return { ...note, username: user.username }
  // }))

  res.json(books);
};

// @desc Create new note
// @route POST /notes
// @access Private
const viewImage= async (req, res) => {
  try {
    const result = await Book.findById(req.params.id);
    res.set({
      "Content-Type": "image/jpeg",
    });
    res.status(200).send(result.photo);
  } catch (err) {
    res.status(400).send(err);
  }
};
const createNewNote = async (req, res) => {
  const { bookName, page, authorName, photo } = req.body;

  // Confirm data
  if (!bookName || !page || !authorName || !photo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate title
  const duplicate = await Book.findOne({ bookName })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate book name" });
  }

  // Create and store the new user
  const note = await Book.create({
    bookName,
    page,
    authorName,
    photo,
  });

  if (note) {
    // Created
    return res.status(201).json({ message: "New Book created" });
  } else {
    return res.status(400).json({ message: "Invalid book data received" });
  }
};
const UploadBooks = async (req, res) => {
  const body = {
    image: req.file.buffer,
    bookName: req.body.fileTitle,
  };
  const image = new ImageData(body);
  // image.image = req.file.buffer;
  // const newDta = dataUpload.dataUpload(body);

  await image
    .save()
    .then((book) => {
      return res.json({ file: req.file, data: book }).status(200);
    })
    .catch((err) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, error: "Book not in the list" });
      }
    });
};
const SearchBooks = async (req, res) => {
  const body = req.body;
  if(!body?.bookName){
    await Book
    .find({}, (err, books) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, error: "Book not in the list" });
      }
      if (!books.length) {
        return res
          .status(404)
          .json({ success: false, error: "Page not found" });
      }
      
      return res.status(200).json({ success: true, data: books });
    })
    .catch((err) => console.log(err));
  }else{
  await Book
    .find({ bookName: { $regex: body.bookName, $options: "i" } }, (err, books) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, error: "Book not in the list" });
      }
      if (!books.length) {
        return res
          .status(404)
          .json({ success: false, error: "Page not found" });
      }
      return res.status(200).json({ success: true, data: books });
    })
    .catch((err) => console.log(err));
  }
};
// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = async (req, res) => {
  const { id, bookName, page, authorName, isActive } = req.body;

  // Confirm data
  if (
    !id ||
    !bookName ||
    !page ||
    !authorName ||
    typeof isActive !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm note exists to update
  const note = await Book.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Book not found" });
  }

  // Check for duplicate title
  const duplicate = await Book.findOne({ bookName })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate book name" });
  }

  note.bookName = bookName;
  note.page = page;
  note.authorName = authorName;
  note.isActive = isActive;

  const updatedNote = await note.save();

  res.json(`'${updatedNote.bookName}' updated`);
};

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Book ID required" });
  }

  // Confirm note exists to delete
  const note = await Book.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Book not found" });
  }

  const result = await note.deleteOne();

  const reply = `Book '${result.bookName}' with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
  UploadBooks,
  SearchBooks,
  viewImage,
};
