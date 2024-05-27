import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setComment } from 'state'; // Import the setComment action

const AddComment = ({ postId }) => {
  const [text, setText] = useState('');
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.user._id);
  const firstName = useSelector((state) => state.user.firstName);
  const lastName = useSelector((state) => state.user.lastName);
  const userPicturePath = useSelector((state) => state.user.picturePath);
  const dispatch = useDispatch(); // Initialize dispatch
  const [comments, setComments] = useState([]);
  const currentstate= useSelector((state) => state);
  const createdAt = new Date().toLocaleDateString();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/addcomment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          userId,
          firstName,
          lastName,
          userPicturePath,
          postId,
          createdAt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      // Dispatch an action to update the Redux store with the new comment
      dispatch(setComment({ postId, comment: { firstName, lastName, text, userPicturePath,createdAt} }));

    } catch (error) {
      console.error('Error adding comment:', error.message);
    }

    setText('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Add a comment"
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Add Comment
        </Button>
      </form>
    </div>
  );
};

export default AddComment;
