import Comment from './comment.model.js';
import Post from '../posts/post.model.js';

export const createComment = async (req, res) => {
    try {
        const { text, post } = req.body;
        const authorId = req.uid;

        const comment = await Comment.create({
            text,
            post,
            author: authorId,
        });

    //
    await Post.findByIdAndUpdate(post, {
        $push: { commens: comment._id}
    });

    const populatedComment = await Comment.findById(comment._uid)
        .populate('author', 'username name surname profilePicture')
        .populate('post', 'title');

    return res.status(201).json({
        message: 'Comentario creado correctamente',
        comment: populatedComment,
    });
}catch(error){
    console.error(error);
    return res.status(500).json
    }
}