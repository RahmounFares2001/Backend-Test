import express from 'express';
import cors from 'cors';
import bookingRoutes from './routes/bookingRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { rateLimiter } from './middlewares/rateLimiter.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rate limit 
app.use(rateLimiter);

// Routes
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler 
app.use(errorHandler);

export default app;