const mongoose = require('mongoose');
const AdminRole = new mongoose.Schema({
    login: { type: String, unique: true },
    password: { type: String, unique: true },
    nom : {type:String },
    Image : {type:String}
});

module.exports = mongoose.model('Admin', AdminRole);