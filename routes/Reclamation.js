const express = require('express');
const Reclamation = require('../models/Reclamation');
const router = express.Router();
// ajout d'une question
const multer = require('multer');
const path = require('path');
const Etudiant = require('../models/Etudiant');
const Enseignant = require('../models/Enseignant');
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
const moment = require('moment');
// add reclamation
router.post('/add', upload.single('image'), (req, res) => {
  const { idUser, Description  , avis  } = req.body;
  const imagePath = req.file ? req.file.filename : null;
  const date = moment().format('DD/MM/YYYY [at] HH:mm');
  const etat = 'en cours'; 
  const reclamation = new Reclamation({
    idUser,
    Description,
    Image: imagePath,
    date , 
    etat , 
    avis
  });

  reclamation.save((err, saved) => {
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
      const reclamations = await Reclamation.find();
      res.json(reclamations);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
});

// update reclamation
const nodemailer = require('nodemailer');

router.put('/update/:id', async (req, res) => {
  const id = req.params.id;
  const { idUser, Image, Description, date, etat, avis } = req.body;

  try {
    const updatedReclamation = await Reclamation.findByIdAndUpdate(
      id,
      { idUser, Image, Description, date, etat, avis },
      { new: true }
    );

    if (!updatedReclamation) {
      console.error(`Could not find Reclamation with ID ${id}`);
      return res.status(404).send(`Could not find Reclamation with ID ${id}`);
    }

    // Find the user by idUser and send an email
    const user = await Etudiant.findById(updatedReclamation.idUser)

    if (!user) {
      console.error(`Could not find User with ID ${idUser}`);
      return res.status(404).send(`Could not find User with ID ${idUser}`);
    }

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      // Configure your email provider's SMTP settings
      // For example, if using Gmail, refer to Nodemailer documentation for Gmail SMTP settings
      service: 'gmail',
      auth: {
        user: 'reclamationiteamuniversity@gmail.com',
        pass: 'gmyhjptvekwwchbr',
      },
    });

    // Define the email options
    const mailOptions = {
      from: 'reclamationiteamuniversity@example.com',
      to: user.email, // Use the user's email
      subject: 'Bonjour ',
      text: 'Consulter la nouvelle etat de votre reclamation.',
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send(error);
      }
      console.log('Email sent:', info.response);
      return res.send(updatedReclamation);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
});


  // get reclamations by id user
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
        const reclamations = await Reclamation.find({ idUser: etudiant._id });
        return res.json(reclamations);
      } else if (enseignant) {
        // User is an Enseignant, get their questions
        const reclamations = await Reclamation.find({ idUser: enseignant._id });
        return res.json(reclamations);
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});
 // delete question
router.delete('/delete/:id', (req, res) => {
    id = req.params.id;
    Reclamation.findByIdAndDelete({ _id: id }).then(
        (deletedReclamation) => {
            console.log(`Reclamation ${deletedReclamation} deleted`);
            res.send(deletedReclamation);
        },
        (err) => {
            res.send(err);
        }
    );
  }); 
 // get by id
 router.get('/getbyiddet/:id', (req, res) => {
  let id = req.params.id;
  Reclamation.findOne({ _id: id }).then(
      (data) => {
          res.send(data);
      },
      (err) => {
          res.send(err);
      }
  );
})
  

module.exports = router;