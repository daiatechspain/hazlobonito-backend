// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models/db');

const authRoutes = require('./routes/auth');
const rewriteRoutes = require('./routes/rewrite');

const app = express();

// Configuración de CORS para permitir solicitudes desde tu frontend de Vercel
app.use(cors({
  origin: 'https://hazlobonito-frontend.vercel.app', // URL del frontend en Vercel
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rewrite', rewriteRoutes);

db.init();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
