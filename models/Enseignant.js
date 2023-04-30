const mongoose = require('mongoose');
const EnseignantRole = new mongoose.Schema({
    email: { type: String },
    login: { type: String, unique: true },
    CIN: { type: String, unique: true },
    password: { type: String, unique: true },
    nom: { type: String },
    prenom: { type: String },
    Age: { type: Number },
    Image: { type: String },
    Telephone: { type: String },
});

module.exports = mongoose.model('Enseignant', EnseignantRole);