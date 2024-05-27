import Post from '../models/Post.js';
import User from '../models/User.js';

/* CREATE */
export const createPost = async (req, res) => {
    try{
        const {userId, description, picturePath} = req.body;
        const user= await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            picturePath,
            userPicturePath: user.picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();
        
        const posts = await Post.find();
        res.status(201).json(posts);
    }catch (err){
        res.status(409).json({message: err.message})
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try{
        const posts = await Post.find();
        res.status(200).json(posts);
    }catch (err){
        res.status(404).json({message: err.message});
    }
}

export const getUserPosts = async (req, res) => {
    try{
        const {userId} = req.params;
        const posts = await Post.find({userId});
        res.status(200).json(posts);
    }catch (err){
        res.status(404).json({message: err.message});
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId, true);
        }
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
        );
        res.status(200).json(updatedPost);
    }catch (err){
        res.status(404).json({message: err.message});
    }
}

export const updatePostDescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        // Check if the post ID is valid
        if (!id) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        // Check if the description is provided
        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }

        // Find the post by its ID
        const post = await Post.findById(id);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Update the description
        post.description = description;

        // Save the updated post
        const updatedPost = await post.save();

        // Return the updated post
        res.status(200).json(updatedPost);
    } catch (err) {
        // Handle unexpected errors
        console.error("Error updating post description:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

/* DELETE */
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Optionally, you can also remove the post from user's array of posts
        // await User.findByIdAndUpdate(deletedPost.userId, { $pull: { posts: deletedPost._id } });

        // Respond with a success message
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a comment for a post
export const addComments = async (req, res) => {
    try {
      const postId = req.params.postId;
      const { userId, firstName, lastName, userPicturePath, text } = req.body;
  
      // Find the post by its ID
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }
  
      // Add the new comment to the post's comments array
      post.comments.push({
        userId,
        firstName,
        lastName,
        userPicturePath,
        text
      });
  
      // Save the updated post document
      await post.save();
  
      res.status(201).json({ success: true, data: post });
    } catch (error) {
      console.error('Error creating comment:', error.message);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  };

  // Get comments for a specific post
export const getComments = async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId);
      
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }
  
      const comments = post.comments;
      res.status(200).json({ success: true, data: comments });
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  };
  
  // Delete a comment from a post
  export const deleteComment = async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }
      const commentIndex = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
      if (commentIndex === -1) {
        return res.status(404).json({ success: false, error: 'Comment not found' });
      }
      post.comments.splice(commentIndex, 1);
      await post.save();
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };