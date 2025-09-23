import { Schema, model } from "mongoose";

const postSchema = new Schema({
    title:{
        type: String,
        require: true,
        trim: true
    },
    content:{
        type: String,
        require: true,
        trim: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
},{
    timestamps: true,
    versionKey: false
})

export default model('Post', postSchema)