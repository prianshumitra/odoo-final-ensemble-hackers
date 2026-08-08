import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/diligent_wombat';
    const conn = await mongoose.connect(connStr);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${(error as Error).message}`);
    console.warn(`Fallback mode active: API server will continue running and serve in-memory data if MongoDB is unreachable.`);
  }
};
