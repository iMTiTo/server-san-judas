'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import 'dotenv/config';
import authRoutes from '../src/auth/auth.routes.js';
import postRouters from '../src/posts/post.routes.js';
import commentRoutes from '../src/comments/comment.routes.js';
import requestLimit from '../middlewares/request-limit.js';
import { handleErrors } from '../middlewares/handle-error.js';
import recipeRoutes from '../src/recipes/recipe.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const middlewares = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginEmbedderPolicy: false
    }));
    app.use(morgan('dev'));
    app.use(requestLimit);
    app.use('/uploads/posts', express.static(path.join(__dirname, '../assets/img/posts')));
}

const routes = (app) => {
    app.use('/api/auth', authRoutes)
    app.use('/api/posts', postRouters)
    app.use('/api/comments', commentRoutes)
    app.use('/api/recipes', recipeRoutes)
}

const conectarDB = async () => {
    try {
        await dbConnection();
    } catch (error) {
        console.log(`Error al conectar la db: ${error}`)
    }
}

export const initServer = async () => {
    const app = express();

    try {
        middlewares(app)
        routes(app)
        app.use(handleErrors)
        await conectarDB()
        app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
        })
    } catch (error) {
        console.log(`Error al iniciar el servidor: ${error}`);
    }
}