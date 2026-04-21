'use strict'

import Recipe from './recipe.model.js'
import { getUniqueImageForRecipe } from '../utils/recipeImages.js'

export const searchRecipes = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 12, category = '' } = req.query

        const query = {}
        const filterArr = []

        if (search) {
            filterArr.push({
                $or: [
                    { Dish_Title: { $regex: search, $options: 'i' } },
                    { Recipe_ingredients: { $regex: search, $options: 'i' } },
                    { Recipe_category: { $regex: search, $options: 'i' } },
                    { Recipe_subcategory: { $regex: search, $options: 'i' } }
                ]
            })
        }

        if (category && category.toLowerCase() !== 'all') {
            filterArr.push({
                $or: [
                    { Recipe_category: { $regex: category, $options: 'i' } },
                    { Recipe_subcategory: { $regex: category, $options: 'i' } }
                ]
            })
        }

        if (filterArr.length > 0) {
            query.$and = filterArr
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)
        const total = await Recipe.countDocuments(query)
        const recipes = await Recipe.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ Dish_Title: 1 })

        // Map back to the names the frontend expects
        const mappedRecipes = recipes.map(r => ({
            title: r.Dish_Title,
            author: r.Recipe_author,
            category: r.Recipe_category,
            subcategory: r.Recipe_subcategory,
            ingredients: r.Recipe_ingredients,
            steps: r.Recipe,
            source: r.Source,
            imageUrl: getUniqueImageForRecipe(r.Dish_Title)
        }))

        return res.status(200).json({
            message: 'Recetas obtenidas exitosamente',
            recipes: mappedRecipes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalRecipes: total,
                pages: Math.ceil(total / parseInt(limit))
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al buscar recetas',
            error: error.message
        })
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Recipe.distinct('Recipe_category')
        const filteredCategories = categories.filter(Boolean)

        return res.status(200).json({
            message: 'Categorías obtenidas exitosamente',
            categories: filteredCategories
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener categorías',
            error: error.message
        })
    }
}

