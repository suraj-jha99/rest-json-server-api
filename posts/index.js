const express = require("express");
const router = express.Router();

const {sendAllPosts,sendPostById,createPost,deletePost,updatePost} = require("./controller.js");

// Middleware to ensure ID immutability
function makeIdImmutable(req, res, next) {
    const { id } = req.params;
    if (req.body.id && req.body.id !== id) {
      return res.status(400).json({ error: "ID mutation is not allowed" });
    }
    next();
  }

// GET route for all posts
router.get("/", sendAllPosts);
  
  // GET route for a post id
  router.get("/:id", sendPostById);
  
  // POST route
  router.post("/", createPost);
  
  // DELETE route for deleting a particular post with post id
  router.delete("/:id", makeIdImmutable, deletePost);
  
  // PUT route for updating a post with given post id : id mutation is not allowed 
  router.put("/:id", makeIdImmutable, updatePost);

module.exports = router;