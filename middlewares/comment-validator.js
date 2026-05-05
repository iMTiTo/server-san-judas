import { check } from "express-validator";
import { validarCampos } from "./validate-values.js";
import { validateJWT } from "./jwt-verify.js";
import { authtenticatedLimiter } from "./request-limit.js";
import { existePost } from '../helpers/db-validators.js';

export const createCommentValidator = [
    validateJWT,
    authtenticatedLimiter,
    check('text', 'El texto del comentario es obligatorio').not().isEmpty(),
    check('text', 'El comntario debe tener máximo 500 caracteres').isLength({ max: 500 }),
    check('post', 'el ID del post es obligatorio').not().isEmpty(),
    check('post', 'el ID del post debe ser un ObjectId válido').isMongoId(),
    check('post').custom(existePost),
    validarCampos,
];
