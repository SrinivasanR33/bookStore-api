const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const noteSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    photo: {
      type: Buffer,
    },
    authorName: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      required: true,
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

noteSchema.plugin(AutoIncrement, {
  inc_field: "bookId",
  id: "ticketNums",
  start_seq: 500,
});

module.exports = mongoose.model("Book", noteSchema);
