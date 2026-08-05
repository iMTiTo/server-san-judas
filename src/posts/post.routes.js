import { Router } from 'express';
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from './post.controller.js';
import { createPostValidator, getPostValidator } from '../../middlewares/post-validator.js';
import { uploadPostImage } from '../../middlewares/file-uploader.js';
import { publicLimiter, authtenticatedLimiter } from '../../middlewares/request-limit.js';

const router = Router()

router.post('/', authtenticatedLimiter, uploadPostImage.single('image'), createPostValidator, createPost)

router.get('/', publicLimiter, getAllPosts)

router.get('/:id', publicLimiter, getPostValidator, getPostById)

router.put('/:id', authtenticatedLimiter, uploadPostImage.single('image'), getPostValidator, updatePost)

router.delete('/:id', authtenticatedLimiter, getPostValidator, deletePost)

export default router