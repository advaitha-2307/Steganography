import express from 'express';
import multer from 'multer';
import { encodeMessage, decodeMessage } from '../controllers/steganographyController.js';
import { isAllowedImageType } from '../utils/validation.js';

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!file || !isAllowedImageType(file.mimetype)) {
      cb(new Error('Invalid image format'));
      return;
    }
    cb(null, true);
  }
});

router.post('/encode', upload.single('image'), encodeMessage);
router.post('/decode', upload.single('image'), decodeMessage);

export default router;
