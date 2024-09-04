import express from 'express';
import { configDotenv } from 'dotenv';
import ConnectDb from './config/db/databse.js';

import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
configDotenv();

ConnectDb();

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Conteo Backend 😊');
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
