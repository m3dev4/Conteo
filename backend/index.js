import express from 'express';
import { configDotenv } from 'dotenv';
import ConnectDb from './config/db/databse.js';
import path from 'path';

import userRoutes from './routes/userRoutes.js';
import categoriesRoutes from './routes/categoryRoutes.js';
import uploadRoute from './routes/uploadRoute.js';
import storyRoute from './routes/storyRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';

const app = express();

// Load environment variables
configDotenv();

// Connect to the database
ConnectDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000', // Votre frontend URL
    credentials: true, // Permettre l'envoi de cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  })
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/story', storyRoute)
app.use('/api/upload', uploadRoute);

// Serve static files from the uploads folder


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Conteo Backend 😊');
});

// 404 Error Handling
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// General Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
