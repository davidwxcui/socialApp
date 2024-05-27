import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const EditPostDialog = ({ open, handleClose, postId, updatePostDescription }) => {
  const [newDescription, setNewDescription] = useState('');

  const handleDescriptionChange = (event) => {
    setNewDescription(event.target.value);
  };

  const handleUpdateDescription = () => {
    updatePostDescription(postId, newDescription);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Post Description</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="description"
          label="New Description"
          type="text"
          fullWidth
          value={newDescription}
          onChange={handleDescriptionChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUpdateDescription} color="primary">Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPostDialog;
