const mongoose = require('mongoose');
const ReponseRole = new mongoose.Schema({
    idUser: { type: String },
    idQuestion: { type: String },
    Image: { type: String },
    Description: { type: String },
});

module.exports = mongoose.model('Reponse', ReponseRole);