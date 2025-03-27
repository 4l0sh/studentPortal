import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

//Routes
router.get('/', (req, res) => {
  res.send('Hello World');
});

router.get('/api/data', (req, res) => {
  res.send('Data');
});
export default router;
