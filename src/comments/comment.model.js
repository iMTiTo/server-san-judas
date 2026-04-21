import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    text:{
        type: String,
        require: true,
        trim: true,
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        require: true,
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
},{
    timestamps: true,
    versionKey: false
})

export default model('Comment', commentSchema)