import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const storage = multer.memoryStorage(); // keep file in memory to validate it 

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WEBP, PDF allowed'));
    }
  },
}).single('file');

const secureUpload = async (req: any, res: any, next: any) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return next(); 
    }

    // Validate magic bytes
    const type = await fileTypeFromBuffer(req.file.buffer);
    if (!type || !ALLOWED_MIME.includes(type.mime)) {
      return res.status(400).json({ message: 'Invalid file content (magic bytes check failed)' });
    }

    // Sanitize image with Sharp
    if (type.mime.startsWith('image/')) {
      try {
        req.file.buffer = await sharp(req.file.buffer)
          .rotate() // auto-orient
          .toBuffer();
      } catch (error) {
        return res.status(400).json({ message: 'Invalid or corrupted image' });
      }
    }

    // Save to disk 
    // const ext = path.extname(type.ext || '.bin');
    const ext = type.ext ? `.${type.ext}` : '';
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(__dirname, '../../uploads', filename);

    fs.writeFileSync(filepath, req.file.buffer);

    // Attach path to request
    req.filePath = `/uploads/${filename}`;

    next();
  });
};

export default secureUpload;