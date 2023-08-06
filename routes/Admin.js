const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');

// Register admin
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
const moment = require('moment');
router.post('/register', upload.single('image'), (req, res) => {
  const { login, password , nom} = req.body;
  const imagePath = req.file ? req.file.filename : null;
  const admin = new Admin({
    login,
    password,
    nom,
    Image: imagePath
  });

  admin.save((err, saved) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    console.log(saved);
    return res.send(saved);
  });
});




// Login admin
const jwt = require('jsonwebtoken');
const secret = 'your-secret-key';

router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const admin = await Admin.findOne({ login });
    if (!admin) {
      return res.status(401).send('Invalid login credentials');
    }
    if (admin.password !== password) {
      return res.status(401).send('Invalid password credentials');
    }
    // Generate JWT token without expiration
    const token = jwt.sign({ adminId: admin._id }, secret);
    res.status(200).send({ token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/getbyid/:id', (req, res) => {
  let id = req.params.id;
  Admin.findOne({ _id: id }).then(
      (data) => {
          res.send(data);
      },
      (err) => {
          res.send(err);
      }
  );
})

module.exports = router;
