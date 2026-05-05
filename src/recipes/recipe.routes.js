import { Router } from 'express'
import { searchRecipes, getCategories } from './recipe.controller.js'
import { publicLimiter } from '../../middlewares/request-limit.js'

const router = Router()

router.get('/search', publicLimiter, searchRecipes)
router.get('/categories', publicLimiter, getCategories)

export default router
