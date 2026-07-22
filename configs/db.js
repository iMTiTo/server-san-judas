'use strict'

import mongoose from "mongoose"

export const dbConnection = async () => {
    try {
        console.log("URI_MONGODB:", process.env.URI_MONGODB ? "Configurada" : "NO CONFIGURADA")

        await mongoose.connect(process.env.URI_MONGODB, {
            serverSelectionTimeoutMS: 50000,
            socketTimeoutMS: 60000,
            maxPoolSize: 10,
            minPoolSize: 5,
            retryWrites: true,
            retryReads: true,
            bufferCommands: false,
        })

        console.log("MongoDB | conectado a la base de datos")

        mongoose.connection.on("error", (err) => {
            console.log("MongoDB | Error:", err.message)
        })

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB | desconectado")
        })

    } catch (error) {
        console.log("Error al conectar con MongoDB:")
        console.log(error.message)
    }
}