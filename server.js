const fs = require("fs");
const express = require("express");
const path = require("path");


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

// post request for new note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text, id } = req.body;
// if there is a title and text, a unique id is generateds
  if (req.body) {
    const newNotes = {
      title,
      text,
      id: uuid()
    };
    // obtain existing notes
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
    // Convert string into JSON object
    const parsedNotes = JSON.parse(data);

    // Add a new note
    parsedNotes.push(newNotes);

    // Write updated notes back to the file
    fs.writeFile(
      './db/db.json',
      JSON.stringify(parsedNotes, null, 4),
      (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info('Successfully updated notes!')
    );
  }
});
    console.log(newNotes);

    // return the new note to user
    const response = {
      status: 'success',
      body: newNotes,
    };
    console.log(response);
    res.status(201).json(response);
    } else {
    res.status(500).json('Error in posting note');
    }

});
   
    // delete notes
  app.delete('/api/notes/:id', (req, res) => {
    const idValue = req.params.id;
    fs.readFile(path.join(__dirname, './db/db.json'), "utf8", (err, note) => {
      if (err) throw err;
      let notes = JSON.parse(note);
      const newNotes = notes.filter((note) => note.id !== idValue);
      res.send(newNotes);
  
      fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(newNotes, null, 2), (err) => {
        if (err) throw err;
      })
    });
  });


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

  