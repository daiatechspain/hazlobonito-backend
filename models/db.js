const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite3');

module.exports = {
  init() {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
      );
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        original TEXT,
        rewritten TEXT,
        estilo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  getUserByEmail(email, callback) {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], callback);
  },

  getUserById(id, callback) {
    db.get(`SELECT * FROM users WHERE id = ?`, [id], callback);
  },

  createUser(name, email, password, callback) {
    db.run(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, password],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  },

  saveHistory(userId, original, rewritten, estilo) {
    db.run(
      `INSERT INTO history (user_id, original, rewritten, estilo) VALUES (?, ?, ?, ?)`,
      [userId, original, rewritten, estilo]
    );
  }
};
