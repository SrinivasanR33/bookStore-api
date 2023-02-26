const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    image: {
      type: Buffer,
      required: true,
    },
    bookName: { type: String },
  },
  {
    timestamps: true,
  }
);
// imageSchema.methods.toJSON = function () {
//   const result = this.toObject;
//   delete result.image;
//   return result;
// };
// var Image = ;
module.exports = mongoose.model("Image", imageSchema);
