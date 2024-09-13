import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
    console.error(storage);
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

export const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("coverImage");

router.post("/", (req, res) => {
  console.log("Receiving upload request");
  uploadSingleImage(req, res, (err) => {
    console.log("Upload process completed");
    if (err) {
      console.error("Upload error:", err);
      res.status(400).json({ message: err.message });
    } else if (req.file) {
      console.log("File uploaded successfully:", req.file);
      res.status(200).json({
        message: "Image téléchargée avec succès🤩",
        image: `/uploads/${req.file.filename}`,
      });
    } else {
      console.log("No file received");
      res.status(400).json({ message: "No image file provided" });
    }
  });
});


export default router;