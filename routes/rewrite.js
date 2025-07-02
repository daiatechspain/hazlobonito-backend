const express = require('express');
const OpenAI = require("openai");
const db = require('../models/db');
const auth = require('../middleware/auth');

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/', auth, async (req, res) => {
  const { texto, estilo } = req.body;

  const prompt = `
Eres un asistente experto en comunicación escrita.

Tu tarea es reescribir el siguiente texto para que suene más profesional, claro y atractivo, según el estilo seleccionado por el usuario.

Estilo seleccionado: ${estilo}
Texto original:
${texto}

Devuelve solo el texto reescrito, sin explicaciones ni comentarios.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres un experto en redacción profesional." },
        { role: "user", content: prompt }
      ]
    });

    const rewritten = completion.choices[0].message.content.trim();
    db.saveHistory(req.user.id, texto, rewritten, estilo);

    res.json({ resultado: rewritten });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar texto con OpenAI' });
  }
});
router.get('/history', auth, (req, res) => {
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('./db.sqlite3');

  db.all(
    `SELECT original, rewritten, estilo, created_at FROM history WHERE user_id = ? ORDER BY created_at DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener el historial' });
      }
      res.json({ historial: rows });
    }
  );
});

module.exports = router;
