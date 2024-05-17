const notes = require('express').Router();
//helper functinos
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');

//GET route to display the notes on the left column database
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//POST route for making a new note
notes.post('/', (req, res) => {
    console.log(req.body)

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        }

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully`);
    } else {
        res.error('Error in adding note');
    }
})

//GET route for displaying single note on the right column
notes.get('/:id', (req, res) => {
    const noteID = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.id === noteID);
            return result.length > 0
                ? res.json(result)
                : res.json('No note with that ID')
        })
});


//DELETE route for removing notes
notes.delete('/:id', (req, res) => {
    const notesId = req.params.id;
    console.log(req.params)
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.id !== notesId);

            writeToFile('./db/db.json', result);

            res.json(`${notesId} has been deleted`);
        });
});

module.exports = notes;