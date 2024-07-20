const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Configurar o banco de dados SQLite
const db = new sqlite3.Database('mydatabase.db');

// Criar tabelas no banco de dados
db.serialize(() => {
  db.run("DROP TABLE IF EXISTS users");  // Apagar tabela existente para garantir que será criada corretamente
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS carregamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT,
      composicao TEXT,
      vagoes INTEGER,
      destino TEXT,
      filial TEXT,
      volume REAL
    )
  `);
});

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Middleware para parsear JSON
app.use(express.json());

// Rota para registrar um novo usuário
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function(err) {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
      return;
    }
    res.status(201).json({ success: true, id: this.lastID });
  });
});

// Rota para login de usuário
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
      return;
    }
    if (row) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Usuário ou senha inválidos' });
    }
  });
});

// Rota para registrar um novo carregamento
app.post('/carregamentos', (req, res) => {
  const { data, composicao, vagoes, destino, filial, volume } = req.body;
  db.run("INSERT INTO carregamentos (data, composicao, vagoes, destino, filial, volume) VALUES (?, ?, ?, ?, ?, ?)",
    [data, composicao, vagoes, destino, filial, volume],
    function(err) {
      if (err) {
        res.status(500).json({ success: false, message: err.message });
        return;
      }
      res.status(201).json({ success: true, id: this.lastID });
    }
  );
});

// Rota para obter todos os carregamentos
app.get('/carregamentos', (req, res) => {
  db.all("SELECT * FROM carregamentos", [], (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
      return;
    }
    res.json(rows);
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
