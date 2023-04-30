const express = require('express');
const Question = require('../models/Question');
const router = express.Router();
const Etudiant = require('../models/Etudiant');
const Enseignant = require('../models/Enseignant');

// ajout d'une question
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

router.post('/add', upload.single('image'), (req, res) => {
  const { idUser, Description } = req.body;
  const imagePath = req.file ? req.file.filename : null;
  const question = new Question({
    idUser,
    Description,
    Image: imagePath
  });

  question.save((err, saved) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    console.log(saved);
    return res.send(saved);
  });
});


// get all
router.get('/getall', async (req, res) => {
    try {
      const questions = await Question.find();
      res.json(questions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
});
// get question by id user 
router.get('/getbyid/:idUser', async (req, res) => {
    try {
      const idUser = req.params.idUser;
  
      // Run parallel queries to search for the user in both models
      const [etudiant, enseignant] = await Promise.all([
        Etudiant.findOne({ _id: idUser }),
        Enseignant.findOne({ _id: idUser })
      ]);
  
      // Check if the user was found in either model
      if (etudiant) {
        // User is an Etudiant, get their questions
        const questions = await Question.find({ idUser: etudiant._id });
        return res.json(questions);
      } else if (enseignant) {
        // User is an Enseignant, get their questions
        const questions = await Question.find({ idUser: enseignant._id });
        return res.json(questions);
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;
