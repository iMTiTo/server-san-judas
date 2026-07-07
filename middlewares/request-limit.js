import rateLimit from "express-rate-limit";
const windowMs = 15 * 60 * 1000;
const max = 100;

export const publicLimiter = rateLimit({
    windowMs,
    max,
    message: `Demasiados intentos. Intenta más tarde`,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.headers['x-forwarded-for'] || req.ip || 'unknown';
    },
    skip: (req) => {
        // Skip rate limiting if forwarded header is present but not properly configured
        return false;
    },
    validate: {
        trustProxy: true,
    },
});

export const authtenticatedLimiter = rateLimit({
    windowMs,
    max,
    message: `Demasiados intentos. Intenta más tarde`,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return `uid:${req.uid}` || req.headers['x-forwarded-for'] || req.ip || 'unknown';
    },
    validate: {
        trustProxy: true,
    },
})