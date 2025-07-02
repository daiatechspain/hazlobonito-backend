const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const router = express.Router();

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  db.getUserByEmail(email, (err, user) => {
    if (user) return res.status(400).json({ error: 'El email ya está registrado' });

    const hash = bcrypt.hashSync(password, 10);
    db.createUser(name, email, hash, (err, userId) => {
      if (err) return res.status(500).json({ error: 'Error creando usuario' });

      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '2h' });
      res.json({ token });
    });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.getUserByEmail(email, (err, user) => {
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  });
});

module.exports = router;
