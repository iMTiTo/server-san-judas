import { Router } from "express";
import { createComment } from "./comments.controller";

const router = Router();

//
router.post('/', createComment);

export default router;