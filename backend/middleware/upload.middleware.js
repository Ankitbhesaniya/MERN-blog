import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { UPLOAD } from "../constants/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const isValid =
    UPLOAD.ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase()) &&
    UPLOAD.ALLOWED_TYPES.test(file.mimetype);

  isValid ? cb(null, true) : cb(new Error("Only jpg, png, webp images are allowed."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: UPLOAD.MAX_SIZE_MB * 1024 * 1024 },
});

export default upload;
