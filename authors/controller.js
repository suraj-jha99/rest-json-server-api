const data = require("../database.js");

const sendAllAuthors = (req, res) => {
  console.log(data.authors);
  res.json(data.authors);
};

const sendAuthorById = (req, res) => {
  const author = data.authors.find((author) => author.id == req.params.id);
  if (!author) {
    return res.status(404).json({ error: "Author not found" });
  }
  res.json(author);
};

const createAuthor = (req, res) => {
  const { id, first_name, last_name, posts } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (data.authors.find((author) => author.id == id)) {
    return res.status(400).json({ error: "id already exists" });
  }
  const newAuthor = { id, first_name, last_name, posts };
  data.authors.push(newAuthor);
  res.status(201).json(newAuthor);
};

const deleteAuthor = (req, res) => {
  const index = data.authors.findIndex((author) => author.id == req.params.id);
  if (index == -1) {
    return res.status(404).json({ error: "Author not found" });
  }

  data.authors[index].posts.forEach((post) => {
    let pidx = data.posts.findIndex((p) => p.id == post);
    data.posts.splice(pidx, 1);
  });

  data.authors.splice(index, 1);
  res.status(204).end();
};

const updateAuthor = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name } = req.body;

  // if(data.posts.find(post => post.id == req.body.id)){
  //     return res.status(400).json({ error: 'id already exists' });
  // }
  const index = data.authors.findIndex((post) => post.id == id);
  if (index == -1) {
    return res.status(404).json({ error: "Author not found" });
  }
  // Update only the provided fields
  if (first_name) {
    data.authors[index].first_name = first_name;
    data.authors[index].posts.forEach((post) => {
      let pidx = data.posts.findIndex((p) => p.id == post);
      data.posts[pidx].author =
        data.authors[index].first_name + data.authors[index].last_name;
    });
  }
  if (last_name) {
    data.authors[index].last_name = last_name;
    data.authors[index].posts.forEach((post) => {
      let pidx = data.posts.findIndex((p) => p.id == post);
      data.posts[pidx].author =
        data.authors[index].first_name + data.authors[index].last_name;
    });
  }
  res.json(data.authors[index]);
};

module.exports = {
    updateAuthor,
    deleteAuthor,
    createAuthor,
    sendAuthorById,
    sendAllAuthors
};

