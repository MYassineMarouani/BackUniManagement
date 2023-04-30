const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');

// Register admin
router.post('/register', async (req, res) => {
  const { login, password } = req.body;
  const admin = new Admin({ login, password });
  try {
    await admin.save();
    res.status(201).send(admin);
  } catch (err) {
    res.status(400).send(err);
  }
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
