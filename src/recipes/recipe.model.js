'use strict'

import { Schema, model } from 'mongoose'

const recipeSchema = new Schema({
    Dish_Title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    Recipe_author: {
        type: String,
        trim: true,
        default: 'Anonymous'
    },
    Recipe_category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    Recipe_subcategory: {
        type: String,
        trim: true
    },
    Recipe_ingredients: {
        type: String,
        required: [true, 'Ingredients are required']
    },
    Recipe: {
        type: String,
        required: [true, 'Steps are required']
    },
    Source: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'recetas'
})

export default model('Recipe', recipeSchema)
