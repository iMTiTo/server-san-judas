import { check } from "express-validator";
import { validarCampos } from "./validate-values.js";
import { validateJWT } from "./jwt-verify.js";
import { authtenticatedLimiter, publicLimiter } from "./request-limit.js";
import { existePost } from "../helpers/db-validators.js";

export const createPostValidator = [
    validateJWT,
    authtenticatedLimiter,
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('title', 'El título no debe exceder 100 caracteres').isLength({ max: 100 }),
    check('content', 'El contenido es obligatorio').not().isEmpty(),
    // Image is now optional - can be file upload or imageUrl in body
    validarCampos
];

export const getPostValidator = [
    publicLimiter,
    check("id", "El ID del post es obligatorio").not().isEmpty(),
    check("id", "El ID debe ser un ObjectId válido").isMongoId(),
    check("id").custom(existePost),
    validarCampos
];
