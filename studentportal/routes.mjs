import express from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import { db } from './server.mjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.VITE_JWT_SECRET;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9) + '-';
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });

//Routes
router.get('/', (req, res) => {
  res.send('Hello World');
});

//middleware to check token
function checkToken(req, res, next) {
  const token = req.get('token');
  if (!token) {
    return res.status(403).json({ message: 'No token found' });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (decoded.role !== 'teacher') {
      return res.status(403).json({ message: 'You are not authorized' });
    }
    next();
  });
}

//studentSignup
router.post('/api/studentSignup', async (req, res) => {
  const studentsCollection = db.collection('students');
  const classesCollection = db.collection('classes');
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  try {
    const existingUser = await studentsCollection.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const result = await studentsCollection.insertOne({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      classes: [req.body.classCode],
      role: 'student',
    });

    const studentId = result.insertedId;

    // Ensure student is not added twice
    await classesCollection.updateOne(
      { classCode: req.body.classCode },
      { $addToSet: { students: studentId } }
    );

    const token = jwt.sign(
      {
        userId: studentId,
        role: 'student',
        name: req.body.name,
        email: req.body.email,
        classes: [req.body.classCode],
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ status: 200, userId: studentId, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//studentLogin
router.post('/api/studentLogin', (req, res) => {
  const collection = db.collection('students');
  collection
    .findOne({ email: req.body.email })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'User does not exist' });
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

//teacherSignup
router.post('/api/teacherSignup', (req, res) => {
  const collection = db.collection('teachers');
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
          role: 'teacher',
        })
        .then((result) => {
          const token = jwt.sign(
            {
              userId: result.insertedId,
              role: 'teacher',
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

//teacherLogin
router.post('/api/teacherLogin', (req, res) => {
  const collection = db.collection('teachers');
  collection
    .findOne({ email: req.body.email })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'User does not exist' });
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
            role: 'teacher',
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
          teacherId: result._id,
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

//get assignments
router.get('/api/assignments', checkToken, (req, res) => {
  const collection = db.collection('assignments');

  const token = req.get('token');
  const decoded = jwt.verify(token, JWT_SECRET);
  const teacherId = decoded.userId;
  if (!teacherId) {
    return res.status(400).json({
      message: 'No id found, please check if you are logged in',
    });
  }
  collection
    .find({ teacherId: teacherId })
    .toArray()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//add assignment
router.post(
  '/api/addAssignment',
  checkToken,
  upload.single('assignmentFile'),
  (req, res) => {
    // Handle the file upload
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const token = req.get('token');
    const decoded = jwt.verify(token, JWT_SECRET);
    const teacherId = decoded.userId;
    const classCode = req.body.classCode;
    const filePath = req.file.path;

    const collection = db.collection('assignments');
    collection
      .insertOne({
        teacherId: teacherId,
        classCode: classCode,
        assignmentName: req.body.assignmentName,
        dueDate: req.body.dueDate,
        addDate: req.body.addDate,
        filePath: filePath,
        status: 'open',
        submissions: [],
      })
      .then((result) => {
        res.json({
          status: 200,
          message: 'Assignment added successfully',
          assignmentId: result.insertedId,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      });
  }
);

//create class
router.post('/api/createClass', checkToken, (req, res) => {
  //get teacherID from token
  const collection = db.collection('classes');
  const token = req.get('token');
  const decoded = jwt.verify(token, JWT_SECRET);
  const teacherId = decoded.userId;
  //check for duplicate class code)
  collection.findOne({ classCode: req.body.classCode }).then((result) => {
    if (result) {
      return res.status(400).json({ message: 'Class already exists' });
    } else {
      collection
        .insertOne({
          teacherId: teacherId,
          className: req.body.className,
          classCode: req.body.classCode,
          students: [],
        })
        .then((result) => {
          res.json({
            status: 200,
            message: 'Class created successfully',
            classId: result.insertedId,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ message: 'Internal server error' });
        });
    }
  });
});

//test route
router.get('/api/data', (req, res) => {
  res.send('Data');
});
export default router;
