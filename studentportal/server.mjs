import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import routes from './routes.mjs';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.VITE_PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use('/', routes);

//mongodb connection
const mongoUri = process.env.VITE_MONGO_URI;
let db;

MongoClient.connect(mongoUri)
  .then((client) => {
    db = client.db('eindproject');
    console.log('Connected to Database');
  })
  .catch((error) => console.log('Error connecting to database', error));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
