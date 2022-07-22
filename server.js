const fs = require("fs");
const express = require("express");
const path = require("path");
const notes = require("./db/db.json");
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;
const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET routes to connect to the html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/', (req, res) => res.json(notes));

// get note from db
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received to get notes`);
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});


// might try something with this
// const uuid = () => {
  // return Math.floor((1 + Math.random()) * 0x10000)
  // .toString(16)
  // .substring(1);
// };

