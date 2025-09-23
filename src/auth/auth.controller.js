import User from '../users/user.model.js'
import {hash} from 'argon2'

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
    }catch(error){
        return res.status(500).json({
            message: 'Error al registrar el usuario',
            err: error.message
        })
    }
}