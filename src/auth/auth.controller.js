import User from '../users/user.model.js'
import { hash, verify } from 'argon2'
import { generarJWT } from '../../helpers/JWS-generate.js'

export const register = async (req, res) => {
    try {
        const data = req.body

        console.log('Datos de registro:', data)

        let profilePicture = req.fileRelativePath || 'profiles/default-avatar.png'
        console.log('Encriptando contraseña...')
        const encryptedPassword = await hash(data.password)
        console.log('Contraseña encriptada')

        console.log('Intentando crear usuario...')
        const newUser = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            profilePicture
        })
        console.log('Usuario creado:', newUser.username)

        return res.status(200).json({
            message: "Usuario registrado correctamente",
            userDetails: {
                user: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error('Error en registro:', error.message)
        return res.status(500).json({
            message: 'Error al registrar el usuario',
            err: error.message
        })
    }
}

export const login = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        console.log('Login attempt:', { email, username });
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const orConditions = [];
        if (lowerEmail) orConditions.push({ email: lowerEmail });
        if (lowerUsername) orConditions.push({ username: lowerUsername });

        if (orConditions.length === 0) {
            return res.status(400).json({ message: "Proporcione email o username" });
        }

        console.log('Searching user with conditions:', orConditions);
        const user = await User.findOne({
            $or: orConditions,
        });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({ message: "Credenciales incorrectas" })
        }

        console.log('Verifying password...');
        const validPassword = await verify(user.password, password)
        console.log('Password valid:', validPassword);
        if (!validPassword) {
            return res.status(401).json({ message: "Credenciales incorrectas" })
        }

        console.log('Generating JWT...');
        const token = await generarJWT(user.id, user.email);
        console.log('JWT generated successfully');

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            userDetails: {
                username: user.username,
                token: token,
                profilePicture: user.profilePicture,
                uid: user.id
            }
        });

    } catch (error) {
        console.error('Error in login:', error);
        return res.status(500).json({
            message: 'Error del servidor',
            error: error.message,
        });
    }
};