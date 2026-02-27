import express from 'express';
import pg from 'pg';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  user: process.env.PG_USER,
  host: 'localhost',
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD || '', // vide si pas de mdp
  port: 5432,
});

const app = express();
app.use(cors());
app.use(express.json());

// ---------- AUTHENTICATION ----------

// Inscription
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id, email, role',
      [email, hash]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Connexion
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Mot de passe incorrect' });
    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- QUIZ CRUD ----------

// Liste des quiz
app.get('/quiz', async (req, res) => {
  const result = await pool.query('SELECT * FROM quiz');
  res.json(result.rows);
});

// Ajouter quiz
app.post('/quiz', async (req, res) => {
  const { title, description } = req.body;
  const result = await pool.query(
    'INSERT INTO quiz(title, description) VALUES($1, $2) RETURNING *',
    [title, description]
  );
  res.json(result.rows[0]);
});

// Supprimer quiz
app.delete('/quiz/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM quiz WHERE id=$1', [id]);
  res.json({ deleted: true });
});

// Éditer quiz
app.put('/quiz/:id', async (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;
  const result = await pool.query(
    'UPDATE quiz SET title=$1, description=$2 WHERE id=$3 RETURNING *',
    [title, description, id]
  );
  res.json(result.rows[0]);
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));