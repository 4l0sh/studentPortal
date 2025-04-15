import express from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import { db } from './server.mjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
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
            classes: result.classes,
            iss: 'http://localhost:3000',
          },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        const response = {
          status: 200,
          name: result.name,
          message: 'Login successful',
          studentId: result._id,
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
//get classCode
router.get('/api/getClassCode', (req, res) => {
  const collection = db.collection('classes');
  const token = req.get('token');
  const decoded = jwt.verify(token, JWT_SECRET);
  const teacherId = decoded.userId;
  if (!teacherId) {
    return res.status(400).json({
      message: 'No id found, please check if you are logged in',
    });
  }
  collection
    .findOne({ teacherId: teacherId })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'No class found' });
      }
      res.json({ classCode: result.classCode });
    })
    .catch((error) => {
      console.log(error);
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

//student get assignments
router.get('/api/studentAssignments', (req, res) => {
  const collection = db.collection('assignments');
  const token = req.get('token');
  const decoded = jwt.verify(token, JWT_SECRET);
  const studentId = decoded.userId;
  const classes = decoded.classes;

  if (!studentId) {
    return res.status(400).json({
      message: 'No id found, please check if you are logged in',
    });
  } else if (decoded.role !== 'student') {
    return res.status(403).json({ message: 'You are not authorized' });
  }

  collection
    .find({ classCode: { $in: classes } })
    .toArray()
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).json({ message: 'No assignments found' });
      }
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//student join Class
router.post('/api/joinClass', (req, res) => {
  const collection = db.collection('students');
  const classesCollection = db.collection('classes');
  const token = req.get('token');
  const decoded = jwt.verify(token, JWT_SECRET);
  const studentId = new ObjectId(decoded.userId);
  const classCode = req.body.classCode;
  collection
    .updateOne({ _id: studentId }, { $addToSet: { classes: classCode } })
    .then((result) => {
      if (result.modifiedCount === 0) {
        return res
          .status(400)
          .json({ message: 'Failed to join class', userId: studentId });
      }
      classesCollection
        .updateOne(
          { classCode: classCode },
          { $addToSet: { students: studentId } }
        )
        .then(() => {
          res.status(200).json({ message: 'Class joined successfully' });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: 'Error updating class', error });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', error });
    });
});

//submit homework
router.post('/api/submitHomework', upload.single('homework'), (req, res) => {
  const { assignmentId } = req.body;
  const file = req.file;
  const filePath = file.path;
  const token = req.get('token');
  const decoded = jwt.verify(token, JWT_SECRET);
  const studentId = decoded.userId;
  const studentName = decoded.name;
  const collection = db.collection('assignments');

  collection
    .findOne({ _id: new ObjectId(assignmentId) })
    .then((assignment) => {
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      const existingSubmission = assignment.submissions.find(
        (sub) => sub.studentId === studentId
      );

      if (existingSubmission) {
        return collection.updateOne(
          {
            _id: new ObjectId(assignmentId),
            'submissions.studentId': studentId,
          },
          {
            $set: {
              'submissions.$.filePath': filePath,
              'submissions.$.submissionDate': new Date()
                .toISOString()
                .split('T')[0],
              'submissions.$.grade': null,
              'submissions.$.feedback': null,
            },
          }
        );
      } else {
        return collection.updateOne(
          { _id: new ObjectId(assignmentId) },
          {
            $push: {
              submissions: {
                submissionID: new ObjectId(),
                studentId: studentId,
                studentName: studentName,
                filePath: filePath,
                submissionDate: new Date().toISOString().split('T')[0],
              },
            },
          }
        );
      }
    })
    .then((result) => {
      if (result.modifiedCount === 0) {
        return res.status(400).json({ message: 'Failed to submit homework' });
      }
      res.status(200).json({ message: 'Homework submitted successfully' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error submitting homework', error });
    });
});

//grade homework
router.post('/api/gradeSubmission', checkToken, (req, res) => {
  const collection = db.collection('assignments');
  const submissionId = req.body.submissionId;
  const assignmentId = req.body.assignmentId;
  const grade = req.body.grade;
  const feedback = req.body.feedback;

  collection
    .updateOne(
      {
        _id: new ObjectId(assignmentId),
        'submissions.submissionID': new ObjectId(submissionId),
      },
      {
        $set: {
          'submissions.$.grade': grade,
          'submissions.$.feedback': feedback,
        },
      }
    )
    .then((result) => {
      if (result.modifiedCount === 0) {
        return res.status(400).json({ message: 'Failed to grade submission' });
      }
      res.status(200).json({ message: 'Submission graded successfully' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error grading submission', error });
    });
});

//login with mail
router.post('/api/oneTimeCode/login', (req, res) => {
  const collection = db.collection('students');
  const email = req.body.email.toLowerCase();
  collection
    .findOne({ email: email })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'User does not exist' });
      }

      const token = jwt.sign(
        {
          userId: result._id,
          role: 'student',
          name: result.name,
          email: result.email,
          classes: result.classes,
          iss: 'http://localhost:3000',
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      const response = {
        status: 200,
        message: 'Login successful',
        studentId: result._id,
        token: token,
        name: result.name,
        email: result.email,
        classes: result.classes,
        role: result.role,
      };
      return res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

export default router;
