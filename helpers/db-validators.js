import User from '../src/users/user.model.js'
import Post from '../src/posts/post.model.js'

export const emailExists = async (email = '') => {
    try {
        console.log('Verificando email:', email);
        const existe = await User.findOne({email: email.toLowerCase()}).maxTimeMS(30000).exec();
        console.log('Email encontrado:', existe ? 'Sí' : 'No');

        if(existe){
            throw new Error('El email ya está registrado')
        }
    } catch (error) {
        console.error('Error en emailExists:', error.message);
        if (error.message.includes('timeout')) {
            throw new Error('Error de conexión con la base de datos al verificar el email')
        }
        throw error
    }
}

export const existePost = async (id = '') => {
    console.log(id, 'validator')
    const existe = await Post.findById(id)
    if(!existe){
        throw new Error('La publicación ya no existe')
    }
}