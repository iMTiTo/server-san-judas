import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        maxLength: [25, 'El nombre no puede tener más de 25 caracteres'],
        trim: true
    },
    surname: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        maxLength: [25, 'El apellido no puede tener más de 25 caracteres'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'El username es obligartorio'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email esobligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'El email no es válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minLengt: [true, 'La contraseña debe contener mínimo 8 caracteres']
    },
    profilePicture: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        minLengt: [8, 'El tenlefono debe tener al menos 8 caracteres'],
        maxLength: [8, 'El teléfono no debe tener más de 8 caracteres'],
        trim: true
    },
    rol: {
        type: String,
        enum: ['ADMOIN_ ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },
    status: {
        type: Boolean,
        default: true
    },
    posts:[{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
},{
    timestamps: true,
    versionKey: false
})

userSchema.methods.toJOSN = function() {
    const { password, id, ...user} = this.toObjet();
    return { uid: id, ...user}
}

export default model('User', userSchema)