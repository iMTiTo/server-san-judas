import rateLimit from "express-rate-limit";

const ratetLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max : 100
})

export default ratetLimit