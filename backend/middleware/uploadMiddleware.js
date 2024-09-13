// uploadMiddleware.js
import path from 'path';
import multer from 'multer';

// Configuration de `multer`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/backend/uploads/');
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  if (filetypes.test(path.extname(file.originalname).toLowerCase()) && mimetypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Images only'), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single('coverImage'); // Assurez-vous que le nom est 'coverImage'

export { uploadSingleImage };
