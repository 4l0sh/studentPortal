import express from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import { db } from './server.mjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const JWT_SECRET = process.env.VITE_JWT_SECRET;

//Routes
router.get('/', (req, res) => {
  res.send('Hello World');
});

//studentSignup
router.post('/api/studentSignup', (req, res) => {
  const collection = db.collection('students');
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  collection
    .findOne({ email: req.body.email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      collection
        .insertOne({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          role: 'student',
        })
        .then((result) => {
          const token = jwt.sign(
            {
              userId: result.insertedId,
              role: 'student',
              name: req.body.name,
              email: req.body.email,
              iss: 'http://localhost:3000',
            },
            JWT_SECRET,
            { expiresIn: '1h' }
          );
          const response = {
            status: 200,
            userId: result.insertedId,
            message: 'Signup successful',
            token: token,
          };
          console.log(`User${req.body.name} Added`, response);
          res.json(response);
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//studentogin
router.post('/api/studentLogin', (req, res) => {
  const collection = db.collection('students');
  collection
    .findOne({ email: req.body.email })
    .then((result) => {
      if (!result) {
        return res.status(400).json({ message: 'User does not exist' });
      }

      //check password
      bcrypt.compare(req.body.password, result.password, (err, isMatch) => {
        if (err) {
          return res.status(400).json({ message: 'Error verifying Password' });
        }
        if (!isMatch) {
          return res.status(400).json({ message: 'Incorrect Password' });
        }

        const token = jwt.sign(
          {
            userId: result._id,
            role: 'student',
            name: result.name,
            email: result.email,
            iss: 'http://localhost:3000',
          },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        const response = {
          status: 200,
          name: result.name,
          message: 'Login successful',
          token: token,
        };
        return res.json(response);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.get('/api/data', (req, res) => {
  res.send('Data');
});
export default router;
