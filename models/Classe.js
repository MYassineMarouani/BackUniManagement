const mongoose = require('mongoose');
const ClasseRole = new mongoose.Schema({
    nom: { type: String },
    GroupeEtudiants: { type: Array },
});

module.exports = mongoose.model('Classe', ClasseRole);