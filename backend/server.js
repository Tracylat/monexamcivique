// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.js';
import connectDB from './models/connect.js';
import userRoutes from './routes/user.js';
import quizRoutes from './routes/quiz.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const allowedOrigins = new Set(configuredOrigins);
    const isLocalhost = typeof origin === 'string' && /^https?:\/\/localhost:\d+$/.test(origin);
    const isVercelPreview = typeof origin === 'string' && origin.endsWith('.vercel.app');

    if (!origin || allowedOrigins.has(origin) || isLocalhost || isVercelPreview) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Important : pour les webhooks Stripe, il faut du raw body
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/', userRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/payment', paymentRoutes);

// Route santé
app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API backend Mon Examen Civique',
    endpoints: ['/health', '/api/user/register', '/api/user/login', '/api/quiz', '/api/payment'],
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📝 Webhooks Stripe: http://localhost:${PORT}/api/payment/webhook`);
});
