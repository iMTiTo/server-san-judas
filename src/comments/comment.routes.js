import { Router } from "express";
import { createComment } from "./comment.controller.js";
import { createCommentValidator } from '../../middlewares/comment-validator.js'

const router = Router();

//
router.post('/', createCommentValidator, createComment);

export default router;