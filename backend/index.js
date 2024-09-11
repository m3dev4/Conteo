import express from 'express';
import { configDotenv } from 'dotenv';
import ConnectDb from './config/db/databse.js';
import path from 'path';

import userRoutes from './routes/userRoutes.js';
import categoriesRoutes from './routes/categoryRoutes.js';
import storiesRoutes from './routes/storyRoute.js';
import uploadRoute from './routes/uploadRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

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
    origin: 'http://localhost:3000', // Change this as needed
  })
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/upload', uploadRoute);

// Serve static files from the uploads folder
const __dirname = path.resolve();  // Correction du nom de variable
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

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
