import Post from './post.model.js';
import User from '../users/user.model.js';
import Comment from '../comments/comment.model.js';

export const createPost = async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body
        const authorId = req.uid

        console.log('Creating post with data:', { title, content, imageUrl, authorId });
        console.log('File uploaded:', req.file);

        // Use uploaded file if available, otherwise use imageUrl from body
        let image = null
        if (req.file && req.file.filename) {
            image = req.file.filename
            console.log('Using uploaded file:', image);
        } else if (imageUrl) {
            image = imageUrl
            console.log('Using imageUrl:', image);
        }

        const post = await Post.create({
            title,
            content,
            image,
            author: authorId
        })

        console.log('Post created with ID:', post._id);

        await User.findByIdAndUpdate(authorId, {
            $push: { posts: post._id }
        })

        const populatePost = await Post.findById(post._id)
            .populate('author', 'name surname username profilePicture')
            .populate('comments')

        console.log('Populated post:', populatePost);

        return res.status(201).json({
            message: 'Publicación exitosa',
            post: populatePost
        })
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({
            message: 'Error al guardar la publicación',
            error: error.message
        })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        console.log('getAllPosts called with query:', req.query);
        const { page = 1, limit = 8, search } = req.query
        const skip = (page - 1) * limit

        let query = {}

        if (search) {
            const searchRegex = new RegExp(search, 'i')

            // Find comments that match the search term
            const matchingComments = await Comment.find({ text: searchRegex }).select('post')
            const postIdsFromComments = matchingComments.map(comment => comment.post)

            query = {
                $or: [
                    { title: searchRegex },
                    { content: searchRegex },
                    { _id: { $in: postIdsFromComments } }
                ]
            }
        }

        console.log('Query:', query);
        const posts = await Post.find(query)
            .populate('author', 'name surname username profilePicture')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'name surname username profilePicture'
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .maxTimeMS(30000)

        console.log('Posts found:', posts.length);
        console.log('Posts data:', JSON.stringify(posts, null, 2));

        const totalPosts = await Post.countDocuments(query)
        const totalPages = Math.ceil(totalPosts / limit)

        return res.status(200).json({
            posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPosts,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        })
    } catch (error) {
        console.error('Error in getAllPosts:', error);
        return res.status(500).json({
            message: 'Error al obtener publicaciones',
            error: error.message
        })
    }
}

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const post = await Post.findById(id)
            .populate('author', 'name surname username profilePicture')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'name surname username profilePicture'
                }
            })

        return res.status(200).json({
            message: 'Publicación obtenida correctamente',
            post
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener la publicación',
            error: error.message
        })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params
        const { title, content, imageUrl } = req.body
        const authorId = req.uid

        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({
                message: 'Publicación no encontrada'
            })
        }

        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'No tienes permiso para editar esta publicación'
            })
        }

        let image = post.image
        if (req.file && req.file.filename) {
            image = req.file.filename
        } else if (imageUrl) {
            image = imageUrl
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, content, image },
            { new: true }
        )
            .populate('author', 'name surname username profilePicture')
            .populate('comments')

        return res.status(200).json({
            message: 'Publicación actualizada correctamente',
            post: updatedPost
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar la publicación',
            error: error.message
        })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const authorId = req.uid

        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({
                message: 'Publicación no encontrada'
            })
        }

        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'No tienes permiso para eliminar esta publicación'
            })
        }

        await Post.findByIdAndDelete(id)
        await User.findByIdAndUpdate(authorId, {
            $pull: { posts: id }
        })

        return res.status(200).json({
            message: 'Publicación eliminada correctamente'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar la publicación',
            error: error.message
        })
    }
}