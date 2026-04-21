import User from '../src/users/user.model.js'
import Post from '../src/posts/post.model.js'

export const emailExists = async (email = '') => {
    const existe = await User.findOne({email})

    if(existe){
        throw new Error('El email ya está registrado')
    }
}

export const existePost = async (id = '') => {
    console.log(id, 'validator')
    const existe = await Post.findById(id)
    if(!existe){
        throw new Error('La publicación ya no existe')
    }
}