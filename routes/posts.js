import express from "express"
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// READ
// grabs users feed from homepage
router.get("/", verifyToken, getFeedPosts)
// shows on relevant user posts on a user page
router.get('/:userId/posts', verifyToken, getUserPosts)


//  UPDATE
// liking and unliking posts
router.patch('/:id/like', verifyToken, likePost)

export default router
