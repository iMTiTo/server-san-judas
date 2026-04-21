import Post from './post.model.js';
import User from '../users/user.model.js';
import Comment from '../comments/comment.model.js';

export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body
        const authorId = req.uid
        const image = req.file.filename

        const post = await Post.create({
            title,
            content,
            image,
            author: authorId
        })

        await User.findByIdAndUpdate(authorId, {
            $push: { posts: post._id }
        })

        const populatePost = await Post.findById(post._id)
            .populate('author', 'name surname username porifilePicture')
            .populate('comments')

        return res.status(201).json({
            message: 'Publixcación exitosa',
            post: populatePost
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al guardar la publicación',
            error: error.message
        })
    }
}

export const getAllPosts = async (req, res) => {
    try {
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

        const totalPosts = await Post.countDocuments(query)

        return res.status(200).json({
            message: 'Publicaciones obtenidas exitosamente',
            posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPosts,
                pages: Math.ceil(totalPosts / limit)
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener las publicaciones',
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