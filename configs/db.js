'use strict'

import mongoose from "mongoose"

export const dbConnection = async () =>{
    try{
        console.log('URI_MONGODB:', process.env.URI_MONGODB ? 'Configurada' : 'NO CONFIGURADA');
        
        if (!process.env.URI_MONGODB) {
            throw new Error('URI_MONGODB no está configurada en las variables de entorno');
        }

        mongoose.connection.on('error', () =>{
            console.log('MongoDB | no se pudo conectar a mongoDB')
            mongoose.disconnect()
        })
        mongoose.connection.on('connecting', () =>{
            console.log('MongoDB | intentando conectar a mongoDB')
        })
        mongoose.connection.on('connected', () =>{
            console.log('MongoDB | conectado a mongoDB')
        })
        mongoose.connection.on('open', () =>{
            console.log('MongoDB | conectado a la base de datos')
        })
        mongoose.connection.on('reconnected', () =>{
            console.log('MongoDB | reconectando a mongoDB')
        })
        mongoose.connection.on('disconnected', () =>{
            console.log('MongoDB | desconectado a mongoDB')
        })
        
        await mongoose.connect(process.env.URI_MONGODB, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10
        })
    }catch(error){
        console.log(`Error al conectar con el servidor: ${error}`)
        throw error
    }
}