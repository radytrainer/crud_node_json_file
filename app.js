const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
app.listen(port);
app.use(express.json());
app.use(express.urlencoded());

// Get data from database.json
let posts = JSON.parse(fs.readFileSync("database.json"));

app.get("/api", (req, res) => {
  res.json({ success: true, message: "API is working" });
});
// Get all data
app.get("/api/posts", (req, res) => {
  res.json({ success: true, posts: posts });
});
// Get single data
app.get("/api/posts/:id", (req, res) => {
  let id = req.params.id;
  let post = posts.find((post) => post.id == id);
  if (post !== undefined) {
    res.json({ success: true, post: post });
  } else {
    res.status(404).send({ success: false, post: undefined });
  }
});
// Create new data
app.post("/api/posts", (req, res) => {
  let lastIndex = 0;
  let lastId = 0;
  if (posts.length > 0) {
    lastIndex = posts.length - 1;
    lastId = posts[lastIndex].id;
  }
  let newId = lastId + 1;
  let post = {
    id: newId,
    title: req.body.title,
    description: req.body.description,
  };
  posts.push(post);
  fs.writeFileSync("database.json", JSON.stringify(posts));
  res.status(200).send({ success: true, post: post });
});
// Delete data
app.delete("/api/posts/:id", (req, res) => {
  let id = req.params.id;
  let index = posts.findIndex((post) => post.id == id);
  if (index !== -1) {
    posts.splice(index, 1);
    fs.writeFileSync("database.json", JSON.stringify(posts));
    res.json({ success: true, post: "Post deleted successfully" });
  } else {
    res.json({ success: false, post: "Post not found" });
  }
});

// Update data
app.put("/api/posts/:id", (req, res) => {
  let id = req.params.id;
  let index = posts.findIndex((post) => post.id == id);
  if (index !== -1) {
    let post = posts[index];
    post.title = req.body.title;
    post.description = req.body.description;
    fs.writeFileSync("database.json", JSON.stringify(posts));
    res.status(200).send({ success: true, post: post });
  } else {
    res.status(404).send({success: false, post:"Post id not found"});
  }
});
