import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { setPosts } from "state";
import { Menu, MenuItem } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useState } from "react";
import EditPostDialog from "./EditPostDialog";

const UserHeader = ({ myId, name, subtitle, userPicturePath, postId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const posts = useSelector((state) => state.posts);

    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const [anchorEl, setAnchorEl] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null); 
    };

    const updatePostDescription = async (postId, newDescription) => {
        console.log("postID",postId);
        try {
            const response = await fetch(`http://localhost:3001/posts/${postId}/description`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ description: newDescription }),
            });

            if (!response.ok) {
                throw new Error("Failed to update post description");
            }

            const updatedPost = await response.json();

            // Update the post in the Redux store
            const updatedPosts = posts.map(post => {
                if (post._id === postId) {
                    return {
                        ...post,
                        description: updatedPost.description,
                    };
                }
                return post;
            });

            dispatch(setPosts({ posts: updatedPosts }));

            // Close the edit dialog
            handleCloseEditDialog();
        } catch (error) {
            console.error("Error updating post description:", error.message);
            // Handle error (e.g., show a notification to the user)
        }
    };

    const deletePost = async () => {
        try {
            const response = await fetch(`http://localhost:3001/posts/${postId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete post");
            }

            // Remove the deleted post from the local posts array in the Redux store
            const updatedPosts = posts.filter(post => post._id !== postId);

            // Update the Redux store with the modified posts array
            dispatch(setPosts({ posts: updatedPosts }));
        } catch (error) {
            console.error("Error deleting post:", error.message);
            // Handle error (e.g., show a notification to the user)
        }
    };

    const editPost = () => {
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
    };

    return (
        <FlexBetween >
            <FlexBetween gap="1rem">
                <UserImage image={userPicturePath} size="55px" />
                <Box
                    onClick={() => {
                        navigate(`/profile/${myId}`);
                        navigate(0);
                    }}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                            "&:hover": {
                                color: palette.primary.light,
                                cursor: "pointer",
                            },
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography color={medium} fontSize="0.75rem">
                        {subtitle}
                    </Typography>
                </Box>
            </FlexBetween>
            <>
                <IconButton
                    aria-controls="menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
                >
                    <Edit sx={{ color: primaryDark }} />
                </IconButton>
                <Menu
                    id="menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => { handleClose(); editPost(); }}>Edit</MenuItem>
                    <MenuItem onClick={() => { handleClose(); deletePost(); }}>Delete</MenuItem>
                </Menu>
                <EditPostDialog
                    open={isEditDialogOpen}
                    handleClose={handleCloseEditDialog}
                    postId={postId}
                    updatePostDescription={updatePostDescription}
                />
            </>
        </FlexBetween>
    );
};

export default UserHeader;
