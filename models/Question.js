const mongoose = require('mongoose');
const QuestionRole = new mongoose.Schema({
    idUser: { type: String },
    Image: { type: String },
    Description: { type: String },
    date : {type:String}
});
module.exports = mongoose.model('Question', QuestionRole);