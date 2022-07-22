const fs = require("fs");
const express = require("express");
const path = require("path");
const note = require("./db/db.json");
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;
const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET routes to connect to the html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/', (req, res) => res.json(note));

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

