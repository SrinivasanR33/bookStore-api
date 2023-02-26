const mongoose = require("mongoose");

const bookMapSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    bookName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
    },
    dateOfReturn: {
      type: String,
      require: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("bookMapping", bookMapSchema);
