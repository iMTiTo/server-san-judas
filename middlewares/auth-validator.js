import { check } from 'express-validator'
import { validarCampos } from './validate-values.js'
import { emailExists } from '../helpers/db-validators.js'
import { processFileUpload } from './precess-file-upload.js'
import { deleteFileOnError } from './delete-file-on-error.js'

export const registerValidator = [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("surname", "El apellido es obligatorio").not().isEmpty(),
    check("username", "El nombre de usuario es obligatorio").not().isEmpty(),
    check("email", "No es un email válido").isEmail(),
    // check("email").custom(emailExists), // Temporarily disabled due to MongoDB timeout
    check("password", "La contraseña debe contener 8 caracteres").isLength({
        min: 8
    }),
    validarCampos,
    deleteFileOnError
]

export const loginValidator = [
    check("email", "No es un email válido").optional().isEmail(),
    check("username", "No es un username válido").optional(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("password", "La contraseña debe tener al menos 8 caracteres").isLength({
        min: 8
    }),

    validarCampos
]