const express = require("express");
const router = express.Router();
const multer = require("multer");
const notesController = require("../controller/bookController");
const verifyJWT = require("../middelware/verfiyjwt");
const storage = multer.memoryStorage();


const upload2 = multer({ storage: storage })
const upload = multer({
  limits: {
    fileSize: 5000000, // max file size 1MB=1000000 bytes
    storage: storage,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif"
    ) {
      cb(null, true);
     
    } else {
      cb(null, false);
      return cb(new Error("Only upload .png .jpeg .jpg .gif format !"));
    }
  },
});
// router.get("/:id", notesController.viewImage);
router.use(verifyJWT);
router.get("/:id", notesController.viewImage);

// router.post('/up', upload.single('uploadedFile'),notesController.UploadBooks);

  router.get("/",notesController.getAllNotes)
  router.post("/search",notesController.SearchBooks)
  router.post("/",notesController.createNewNote)
  router.put("/",notesController.updateNote)
  router.patch("/",notesController.deleteNote);

module.exports = router;
