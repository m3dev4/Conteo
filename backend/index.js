import express from 'express';
import { configDotenv } from 'dotenv';
import ConnectDb from './config/db/databse.js';

import userRoutes from './routes/userRoutes.js';
import categoriesRoutes from "./routes/categoryRoutes.js"
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
configDotenv();
app.use(cors({
  origin: 'http://localhost:3000' // ou '*' pour autoriser toutes les origines
}));

ConnectDb();

app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes)

app.get('/', (req, res) => {
  res.send('Conteo Backend 😊');
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
