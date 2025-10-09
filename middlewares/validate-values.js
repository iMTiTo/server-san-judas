import { response } from "express";
import { validationResult } from "express-validator";

export const validarCampos = (err, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Error de validación')
        error.status = 400
        error.errors = errors.array()
        return res.status(400).json(error)
    }
    next()
}