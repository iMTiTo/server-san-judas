import rateLimit from "express-rate-limit";

const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limitar a 5 peticiones por IP en esta ventana de tiempo
    message: "Demasiados intentos de inicio de sesión desde esta IP, por favor inténtalo de nuevo después de 15 minutos"
});

export default loginLimit;
