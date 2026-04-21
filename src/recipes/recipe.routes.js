import { Router } from 'express'
import { searchRecipes, getCategories } from './recipe.controller.js'

const router = Router()

router.get('/search', searchRecipes)
router.get('/categories', getCategories)

export default router
