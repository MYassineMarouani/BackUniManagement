const mongoose = require('mongoose');
const NoteRole = new mongoose.Schema({
    notesurV: { type: Number },
    idMatiere: { type: String },
    idEtudiant: { type: String},
    Type: { type: String }
});

module.exports = mongoose.model('Note', NoteRole);