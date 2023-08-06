const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const Etudiant = require('../models/Etudiant');
const Enseignant = require('../models/Enseignant');
const jwt = require('jsonwebtoken');
const payload = { id: 'myUserId' };
const secretKey = 'mySecretKey';


// Set up multer storage for handling image file uploads
const storage = multer.diskStorage({
    destination: './Images/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Create a multer instance for handling image file uploads
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('Image');

// Function to check the file type of image uploads
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check the extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check the mimetype
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
}


// Create a nodemailer transporter using your email service credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'marouanimedyassine@gmail.com',
        pass: 'kzgcopmmtuerwhpz'
    }
});
// register
router.post('/register', async (req, res) => {
    // Generate a random 4-character alphanumeric string for the login and password
    const login = Math.random().toString(36).substr(2, 4);
    const password = Math.random().toString(36).substr(2, 4);

    // Upload the image file and save its name to the database
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: 'Error uploading image', error: err });
        }
        const image = req.file.filename;

        // Create a new Etudiant object with the generated login and password
        const etudiant = new Etudiant({
            email: req.body.email,
            login,
            password,
            nom: req.body.nom,
            CIN : req.body.CIN,
            prenom: req.body.prenom,
            Age: req.body.Age,
            Classe: req.body.Classe,
            Image: image,
            Telephone: req.body.Telephone
        });

        try {
            // Save the new Etudiant object to the database
            await etudiant.save();

            // Send the login and password to the provided email address
            // await transporter.sendMail({
            //     from: 'your_email_address@gmail.com',
            //     to: req.body.email,
            //     subject: 'Registration successful',
            //     html: `<p>Your login is: ${login}</p><p>Your password is: ${password}</p>`
            // });

            res.status(200).json({ message: 'Registration successful' });
        } catch (error) {
            res.status(500).json({ message: 'Error registering Etudiant', error });
        }
    });
});
// login
router.post('/login', async (req, res) => {
    try {
      // Check if etudiant with provided email and password exists
      const etudiant = await Etudiant.findOne({
        login: req.body.login,
        password: req.body.password
      });
      if (!etudiant) {
        return res.status(401).send('Invalid user or password');
      }
  
      // If etudiant exists, create and return a JWT token
      const token = jwt.sign({ etudiantId: etudiant._id }, 'your_secret_key');
      res.send({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });

// modifier
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, login, password, nom, prenom, Age, Classe, Telephone } = req.body;

        const updatedEtudiant = await Etudiant.findByIdAndUpdate(
            id,
            { email, login, password, nom, prenom, Age, Classe, Telephone },
            { new: true }
        );

        if (!updatedEtudiant) {
            return res.status(404).json({ error: 'Etudiant not found' });
        }

        return res.status(200).json(updatedEtudiant);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});
// get by id 
router.get('/getbyid/:id', (req, res) => {
    let id = req.params.id;
    Etudiant.findOne({ _id: id }).then(
        (data) => {
            res.send(data);
        },
        (err) => {
            res.send(err);
        }
    );
})
// get etudiants by id classe
router.get('/getbyclasse/:id', async (req, res) => {
    try {
      const classeId = req.params.id;
      console.log('classeId:', classeId);
      const etudiants = await Etudiant.find({ Classe: classeId }).exec();
      console.log('etudiants:', etudiants);
      if (etudiants.length === 0) {
        return res.status(404).json({ error: 'No etudiants found for the specified classe ID.' });
      }
      return res.json(etudiants);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  });
  
  
// check if the id is from etudiant or enseignant 1 = student ; 2 = teacher
router.get('/getbyiduser/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
      // Run parallel queries to search for the user in both models
      const [etudiant, enseignant] = await Promise.all([
        Etudiant.findOne({ _id: id }),
        Enseignant.findOne({ _id: id })
      ]);
  
      // Check if the user was found in either model
      if (etudiant) {
        return res.json({ type: 1 });
      } else if (enseignant) {
        return res.json({ type: 2 });
      } else {
        return res.json({ type: 3 });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// get all
router.get('/getall', (req, res) => {
    Etudiant.find().then(
        (etudiant) => {
            res.send(etudiant)
        },
        (err) => {
            console.log(err);
        }
    )
});
// delete 
router.delete('/delete/:id', (req, res) => {
    id = req.params.id;
    Etudiant.findByIdAndDelete({ _id: id }).then(
        (deletedEtudiant) => {
            console.log(`Offre ${deletedEtudiant} deleted`);
            res.send(deletedEtudiant);
        },
        (err) => {
            res.send(err);
        }
    );
});
module.exports = router;
