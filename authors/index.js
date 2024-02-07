const express = require("express");
const router = express.Router();


const {updateAuthor,deleteAuthor,createAuthor,sendAuthorById,sendAllAuthors}  = require("./controller.js");

// Middleware to ensure ID immutability
function makeIdImmutable(req, res, next) {
  const { id } = req.params;
  if (req.body.id && req.body.id !== id) {
    return res.status(400).json({ error: "ID mutation is not allowed" });
  }
  next();
}

//GET authors 
router.get("/", sendAllAuthors);
  
// GET author info using author id
router.get("/:id", sendAuthorById);
  
// create a new author 
router.post("/", createAuthor);
  
//to delete a author
router.delete("/:id", makeIdImmutable, deleteAuthor);
  
// PUT route for updating author info like name and also update that all existing posts
router.put("/:id", makeIdImmutable, updateAuthor);

module.exports = router;