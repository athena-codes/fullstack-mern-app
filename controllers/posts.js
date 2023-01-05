import Post from '../models/Post.js'
import User from '../models/User.js'

// CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body
    const user = await User.findBy(userId)
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: []
    })
    await newPost.save()
    // all posts must be returned to front end
    const post = await Post.find()
    res.status(201).json(post)
  } catch (err) {
    res.status(409).json({ message: err.message })
  }
}

//  READ
// grabs all user posts to display feed
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find()
    res.status(200).json(post)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const post = await Post.find({ userId })

    res.status(200).json(post)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// UPDATE

export const likePost = async (req, res) => {
  try {
    // grab relevant posts
    const { id } = req.params
    // grab user id from request body b/c thats how it's sent from front end
    const { userId } = req.body
    const post = await Post.findBy(id)
    const isLiked = post.likes.get(userId)

    // removes a like if there is one
    if (isLiked) {
      post.liked.delete(userId)
      // if no like, add like
    } else {
      post.likes.set(userId, true)
    }

    // update a specific posts likes on frontend 
    const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
    )

    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}
