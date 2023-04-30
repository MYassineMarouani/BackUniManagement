const mongoose = require('mongoose');
const AdminRole = new mongoose.Schema({
    login: { type: String, unique: true },
    password: { type: String, unique: true },
});

module.exports = mongoose.model('Admin', AdminRole);