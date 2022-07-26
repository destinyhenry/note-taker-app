let noteName;
let noteContent;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteName = document.querySelector('.note-title');
  noteContent = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Display an element
const show = (element) => {
  element.style.display = 'inline';
};

// Hide an element
const hide = (element) => {
  element.style.display = 'none';
};

// currentNote is used to keep track of the note in the textarea
let currentNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderCurrentNote = () => {
  hide(saveNoteBtn);

  if (currentNote.id) {
    noteName.setAttribute('readonly', true);
    noteContent.setAttribute('readonly', true);
    noteName.value = currentNote.title;
    noteContent.value = currentNote.text;
  } else {
    noteName.removeAttribute('readonly');
    noteContent.removeAttribute('readonly');
    noteName.value = '';
    noteContent.value = '';
  }
};
// saving new note and rendering it with other notes
const handleNoteSave = () => {
  const newNote = {
    title: noteName.value,
    text: noteContent.value,
  };


  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderCurrentNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (currentNote.id === noteId) {
    currentNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderCurrentNote();
  });
};

// renders and displays current note
const handleNoteView = (e) => {
  e.preventDefault();
  currentNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderCurrentNote();
};

// the note box is empty and allows for a new entry
const handleNewNoteView = (e) => {
  currentNote = {};
  renderCurrentNote();
};

// save button appears when both note name and content are entered.
const handleRenderSaveBtn = () => {
  if (!noteName.value.trim() || !noteContent.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteName.addEventListener('keyup', handleRenderSaveBtn);
  noteContent.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
