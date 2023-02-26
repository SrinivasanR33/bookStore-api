require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const { logger, logEvents } = require("./middelware/logger");
const errorHandler = require("./middelware/errorHandler");
const cors = require("cors");
const multer = require("multer");
const Router = express.Router();
const corsOptions = require("./config/coreOptions");
const connectDB = require("./config/dbConn");
const ImageData = require("./models/image-modal");
const mongoose = require("mongoose");
const Book = require("./models/Book");

const create = require("./controller/bookController");

const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.get("/upload/:id", async (req, res) => {
  try {
    const result = await Book.findById(req.params.id);
    // res.set({
    //   "Content-Type": "image/jpeg",
    // });
    // console.log(result.bookName)
    return res.status(200).json(result.photo);
  } catch (err) {
    res.status(400).send(err);
  }
});
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/books", require("./routes/bookRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
