import express from 'express';
import { configDotenv } from 'dotenv';
import ConnectDb from './config/db/databse.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configDotenv();

ConnectDb()

app.get('/', (req, res) => {
  res.send('Conteo Backend 😊');
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
