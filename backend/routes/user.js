import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();
const localUsers = [];

const isMongoConnected = () => mongoose.connection.readyState === 1;

const registerHandler = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    if (isMongoConnected()) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: 'Email déjà utilisé' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashed, name });
      return res.status(201).json({
        message: 'Inscription réussie',
        user: { email: user.email, name: user.name, role: user.role },
      });
    }

    const existingLocal = localUsers.find((u) => u.email === email);
    if (existingLocal) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const localUser = {
      id: `local_${Date.now()}`,
      email,
      password: hashed,
      name,
      role: 'user',
      isPremium: false,
    };
    localUsers.push(localUser);
    return res.status(201).json({
      message: 'Inscription réussie (mode local)',
      user: { email: localUser.email, name: localUser.name, role: localUser.role },
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (isMongoConnected()) {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Utilisateur introuvable' });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ error: 'Mot de passe incorrect' });
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
      return res.json({ token, user: { email: user.email, name: user.name, role: user.role, isPremium: user.isPremium } });
    }

    const user = localUsers.find((u) => u.email === email);
    if (!user) return res.status(400).json({ error: 'Utilisateur introuvable (mode local)' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Mot de passe incorrect' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    return res.json({
      token,
      user: { email: user.email, name: user.name, role: user.role, isPremium: user.isPremium },
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// Inscription
router.post('/register', registerHandler);
router.post('/signup', registerHandler);
router.get('/signup', (_req, res) => {
  res.status(200).json({
    message: "Endpoint d'inscription actif. Utilisez une requete POST sur /signup ou /api/user/register.",
  });
});

// Connexion
router.post('/login', loginHandler);

export default router;
