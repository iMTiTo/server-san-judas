import { Router } from 'express';
import { createPost, getAllPost, getPostById } from './post.controller.js';
import { createPostValidator } from '../../middlewares/post-validator.js';

const router = Router()

router.post('/', createPostValidator, createPost)

router.get('/', getAllPost)

router.get('/:id', getPostById)

export default router