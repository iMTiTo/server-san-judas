import { Router } from "express";
import express from "express";
import { register, login } from "./auth.controller.js";
import { uploadProfilePicture } from "../../middlewares/file-uploader.js";
import { processFileUpload } from "../../middlewares/precess-file-upload.js";
import { registerValidator, loginValidator } from "../../middlewares/auth-validator.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

const router = Router();

router.post('/register',
  uploadProfilePicture.single('profilePicture'),
  processFileUpload,
  registerValidator,
  register
)

router.post('/login', loginValidator, login)

router.use(
  "/getImage",
  express.static(join(CURRENT_DIR, "../../assets/img"))
);

export default router