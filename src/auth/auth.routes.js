import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { uploadProfilePicture } from "../../middlewares/file-uploader.js";
import { processFileUpload } from "../../middlewares/precess-file-upload.js";
import { registerValidator } from "../../middlewares/auth-validator.js";
import { validarCampos } from "../../middlewares/validate-values.js";

const router = Router();

router.post('/register',
    uploadProfilePicture.single('profilePicture'),
    registerValidator,
    register
)

router.post('/login', validarCampos, login)

export default router