import User from '../users/user.model.js'
import { hash, verify } from 'argon2'
import { generarJWT } from '../../helpers/JWS-generate.js'
import { token } from 'morgan'

export const register = async (req, res) => {
    try{
        const data = req.body

        let profilePicture = req.fileRelativePath || 'prifles/default-avatar.png'
        const encryptedPassword = await hash(data.password)

        const newUser = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            profilePicture
        })
        return res.status(200).json({
            message: "Usuario registrado correctamente",
            userDetails: {
                user: newUser.username,
                email: newUser.email,
            },
        });
    }catch(error){
        return res.status(500).json({
            message: 'Error al registrar el usuario',
            err: error.message
        })
    }
}

export const login = async (req, res) =>{
    const {email, password, username} = req.body;

    try {
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const user = await User.findOne({
            $or: [{ email: lowerEmail}, { username: lowerUsername}],
        });

    if (!user) {
        return res.status(401).json({ message: "Credenciales incorrectas"})
    } {
        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            userDetails: {

                    username: username,
                    token: token,
                    profilePicture: user.profilePicture,
                    uid: user.id
                }
        });
    }
    } catch (error) {
      return res.status(500).json({
        message: 'Error del servidor',
        error: error.message,
      });
    }
};