import { Router } from "express";
import { createPost, getAllPost, getPostById } from "./post.controller.js";
import router from "../auth/auth.routes";

const router = Router()

router.post('/', createPost)

router.get('/', getAllPost)

router.get('/:id', getPostById)

export default router