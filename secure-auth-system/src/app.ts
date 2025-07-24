import express from 'express';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import { authRoutes } from './routes/authRoutes';
import { rateLimitMiddleware } from './middlewares/rateLimitMiddleware';
import { validationMiddleware } from './middlewares/validationMiddleware';
import { authMiddleware } from './middlewares/authMiddleware';
import { roleMiddleware } from './middlewares/roleMiddleware';
import { config } from './config/index';

const app = express();

// Middleware setup
app.use(json());
app.use(rateLimitMiddleware);
app.use(validationMiddleware);

// Routes setup
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(config.databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

// Start the server
const PORT = config.port || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});