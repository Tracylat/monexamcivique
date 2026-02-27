import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/monexamencivique');
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('Erreur connexion MongoDB: démarrage en mode local sans MongoDB.');
  }
};

export default connectDB;
