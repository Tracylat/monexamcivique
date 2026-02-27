import express from 'express';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import { auth, isAdmin } from './middleware.js';

const router = express.Router();

// CRUD Quiz (admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.create({ title: req.body.title, description: req.body.description });
    res.status(201).json(quiz);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', auth, async (req, res) => {
  const quizzes = await Quiz.find().populate('questions');
  res.json(quizzes);
});

router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(quiz);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz supprimé' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CRUD Question (admin)
router.post('/:quizId/questions', auth, isAdmin, async (req, res) => {
  try {
    const question = await Question.create({
      quiz: req.params.quizId,
      text: req.body.text,
      choices: req.body.choices,
    });
    await Quiz.findByIdAndUpdate(req.params.quizId, { $push: { questions: question._id } });
    res.status(201).json(question);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/questions/:id', auth, isAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(question);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/questions/:id', auth, isAdmin, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question supprimée' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
