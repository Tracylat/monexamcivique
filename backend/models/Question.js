import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  text: { type: String, required: true },
  choices: [{ text: String, isCorrect: Boolean }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Question', questionSchema);
