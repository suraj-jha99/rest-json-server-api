const data = require("../database.js");

const sendAllPosts = (req, res) => {
  console.log(data.posts);
  res.json(data.posts);
};

const sendPostById = (req, res) => {
  const post = data.posts.find((post) => post.id == req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
};

const createPost = (req, res) => {
  const { id, title, author, authorId, views, reviews } = req.body;
  if (!id || !title || !author || !views || !reviews) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (data.posts.find((post) => post.id == req.body.id)) {
    return res.status(400).json({ error: "id already exists" });
  }

  //create new post
  const newPost = { id, title, author, authorId, views, reviews };
  data.posts.push(newPost);

  const fullname = author.split(" "); //get first name and last name
  console.log(fullname[1]);

  let authIdx = data.authors.findIndex((auth) => auth.id == authorId);

  if (authIdx == -1) {
    data.authors.push({
      id: authorId,
      first_name: fullname[0],
      last_name: fullname[1],
      posts: [parseInt(id)],
    });
  } else {
    data.authors[authIdx].posts.push(parseInt(id));
  }

  res.status(201).json(newPost);
};

const deletePost = (req, res) => {
  const index = data.posts.findIndex((post) => post.id == req.params.id);

  if (index == -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  //find the authorId of the given post
  const authId = data.posts[index].authorId;

  //find the authorsIdx in the data.authors array
  const aidx = data.authors.findIndex((author) => author.id == authId);

  //fint the postsIdx in the posts array of author
  const pidx = data.authors[aidx].posts.findIndex(
    (post) => post == req.params.id
  );
  data.authors[aidx].posts.splice(pidx, 1);

  data.posts.splice(index, 1);
  res.status(204).end();
};

const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, authorId, author, views, reviews } = req.body;

  const index = data.posts.findIndex((post) => post.id == id);
  if (index == -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  // Update only the provided fields
  if (title) {
    data.posts[index].title = title;
  }

  if (authorId) {
    const fullname = author.split(" ");

    let authorname = data.posts[index].authorId;

    if (authorId != authorname) {
      let aidx = data.authors.findIndex((auth) => auth.id == authorname);
      let pidx = data.authors[aidx].posts.findIndex((post) => post == id);
      data.authors[aidx].posts.splice(pidx, 1);

      authorname = authorId;
      let naidx = data.authors.findIndex((auth) => auth.id == authorname);
      if (naidx == -1) {
        data.authors.push({
          id: authorname,
          first_name: fullname[0],
          last_name: fullname[1],
          posts: [parseInt(id)],
        });
      } else {
        data.authors[naidx].posts.push(parseInt(id));
      }

      data.posts[index].author = author;
      data.posts[index].authorId = authorname;
    }
  }

  if (views !== null) {
    data.posts[index].views = views;
  }

  if (reviews !== null) {
    data.posts[index].reviews = reviews;
  }

  res.json(data.posts[index]);
};

module.exports = {
  sendAllPosts,
  sendPostById,
  createPost,
  deletePost,
  updatePost,
};
