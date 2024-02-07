const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 4000;
const authorRouter = require("./authors");
const postRouter = require("./posts");
const data = require("./database");
const storeFilePath = "./store.json";

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.on("finish", () => {
    fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2));
  });
  next();
});




//home route
app.get("/", (req, res) => {
  res.send("welcome to mock json api!");
});

app.use("/authors", authorRouter);
app.use("/posts", postRouter);

app.listen(port, () => {
  console.log(`server is running successfully on port ${port}.`);
});