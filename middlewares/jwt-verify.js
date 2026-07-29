import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['authorization']
    console.log('Token received:', token ? 'Yes' : 'No')
    
    if (!token){
        return res.status(401).json({ message: 'Es necesario el token de autorización'})
    }

    try{
        token = token.replace(/^Bearer\s+/, "")
        console.log('TOKEN_KEY configured:', process.env.TOKEN_KEY ? 'Yes' : 'No')
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        req.uid = decoded.uid
        console.log('Token validated successfully for user:', decoded.uid)
        return next()
    }catch(error){
        console.error('JWT validation error:', error.message)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado, por favor inicia sesión nuevamente' })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido' })
        }
        return res.status(401).json({ message: 'Token no válido', error: error.message })
    }
}