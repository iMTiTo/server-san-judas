'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import 'dotenv/config';
import userMoldel from '../src/users/user.model.js';

const middlewares = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
}

const conectarDB = async () => {
    try{
        await dbConnection();
    }catch(error){
        console.log(`Error al conectar la db: ${error}`)
    }
}

export const initServer = async () => {
    const app = express();

    try{
        middlewares(app)
        await conectarDB()
        app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
        })
    }catch(error){
        console.log(`Error al iniciar el servidor: ${error}`);
    }
}