import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedDatabase } from '../utils/seedData';

// Load environment variables
dotenv.config();

const runSeed = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fit-meals';
    await mongoose.connect(mongoURI);
    console.log('📦 Connected to MongoDB');

    // Run seeding
    await seedDatabase();

    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();