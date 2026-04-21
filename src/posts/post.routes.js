import { Router } from 'express';
import { createPost, getAllPosts, getPostById } from './post.controller.js';
import { createPostValidator, getPostValidator } from '../../middlewares/post-validator.js';
import { uploadPostImage } from '../../middlewares/file-uploader.js';

const router = Router()

router.post('/', uploadPostImage.single('image'), createPostValidator, createPost)

router.get('/', getAllPosts)

router.get('/:id', getPostValidator, getPostById)

export default router