import { Router } from "express";
import { createComment } from "./comment.controller.js";
import { createCommentValidator } from '../../middlewares/comment-validator.js'
import { authtenticatedLimiter } from "../../middlewares/request-limit.js";

const router = Router();

//
router.post('/', authtenticatedLimiter, createCommentValidator, createComment);

export default router;