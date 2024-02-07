const fs = require("fs");

let data = {
  posts: [],
  authors: [],
};

const storeFilePath = "./store.json";

try {
  if (fs.existsSync(storeFilePath)) {
    const jsonData = fs.readFileSync(storeFilePath);
    data = JSON.parse(jsonData);
  }
} catch (err) {
  console.error("Error reading store file:", err);
}

module.exports = data;