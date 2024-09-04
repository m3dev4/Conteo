import express from 'express';
import { configDotenv } from 'dotenv';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configDotenv();

app.get('/', (req, res) => {
  res.send('Conteo Backend 😊');
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
