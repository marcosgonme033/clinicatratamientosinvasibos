import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sessions', sessionRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Log configuration (sin exponer password)
    console.log('\n📋 Server Configuration:');
    console.log(`   PORT: ${process.env.PORT || 5050}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   DB_HOST: ${process.env.DB_HOST}`);
    console.log(`   DB_NAME: ${process.env.DB_NAME}`);
    console.log(`   DB_USER: ${process.env.DB_USER}`);
    console.log(`   CORS_ORIGIN: ${process.env.CORS_ORIGIN}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✓ Set' : '✗ Missing'}\n`);
    
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Cannot start server without database connection');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Health check: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
