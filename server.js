require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models/db');

const authRoutes = require('./routes/auth');
const rewriteRoutes = require('./routes/rewrite');

const app = express();

// ✅ CONFIGURACIÓN CORS PARA PERMITIR VERCEL
app.use(cors({
  origin: 'https://hazlobonito-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/rewrite', rewriteRoutes);

// Inicializar base de datos
db.init();

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
