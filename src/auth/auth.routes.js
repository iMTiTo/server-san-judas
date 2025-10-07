import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { uploadProfilePicture } from "../../middlewares/file-uploader.js";

const router = Router();

router.post('/register',
    uploadProfilePicture.single('profilePicture'),
    register
)

router.post('/login', login)

export default router