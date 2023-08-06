const mongoose = require('mongoose');
const Reclamationrole = new mongoose.Schema({
    idUser: { type: String },
    Image: { type: String },
    Description: { type: String },
    date : {type:String},
    etat : {type:String},
    avis : {type:String}
});
module.exports = mongoose.model('Reclamation', Reclamationrole);