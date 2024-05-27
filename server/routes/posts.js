import express from "express";
import { getFeedPosts, getUserPosts, likePost, updatePostDescription, deletePost, getComments,addComments, deleteComment } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/description", verifyToken, updatePostDescription); 

/* DELETE */
router.delete("/:id", verifyToken, deletePost);

/* COMMENTS */
router.get('/:postId/getcomments', verifyToken, getComments); // Get all comments for a post
router.post("/:postId/addcomment", verifyToken, addComments); // Add a comment to a post
router.delete("/:postId/comments/:commentId", verifyToken, deleteComment); // Delete a comment from a post

export default router;