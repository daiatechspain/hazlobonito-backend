require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models/db');

const authRoutes = require('./routes/auth');
const rewriteRoutes = require('./routes/rewrite');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/rewrite', rewriteRoutes);

db.init();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
