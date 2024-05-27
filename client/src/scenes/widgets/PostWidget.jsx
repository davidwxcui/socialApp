import React, { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import UserHeader from "components/UserHeader";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { setPost } from "state";
import { useTheme } from "@mui/material/styles";
import FlexBetween from "components/FlexBetween";
import PostPopupDialog from "components/PostPopupDialog";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const datePosted = new Date(createdAt).toLocaleDateString();
  const [isPostPopupOpen, setIsPostPopupOpen] = useState(false);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      if (!response.ok) {
        throw new Error("Failed to like the post");
      }
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const openPost = () => {
    setIsPostPopupOpen(true);
  };

  const isOwnPost = postUserId === loggedInUserId;
  return (
    <>

      <WidgetWrapper m="2rem 0" padding="1rem">
        {isOwnPost ? (
          <UserHeader
            myId={postUserId}
            name={name}
            subtitle={location}
            userPicturePath={userPicturePath}
            postId={postId}
          />
        ) : (
          <Friend
            friendId={postUserId}
            name={name}
            subtitle={location}
            userPicturePath={userPicturePath}
          />
        )}
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        <Box mt="0.75rem" onClick={openPost}>
          {picturePath && (
            <img
              width="100%"
              height="auto"
              alt="post"
              style={{ borderRadius: "0.75rem" }}
              src={`http://localhost:3001/assets/${picturePath}`}
            />
          )}
        </Box>
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>
            <FlexBetween gap="0.3rem">
              <IconButton onClick={openPost}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>
          <FlexBetween gap="0.3rem">
            <Typography>{datePosted}</Typography>
          </FlexBetween>
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
      </WidgetWrapper>
      <PostPopupDialog
        postId={postId}
        open={isPostPopupOpen}
        handleClose={() => setIsPostPopupOpen(false)}
        image={picturePath}
        comments={comments}
        postUserId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        description={description}
      />
    </>
  );
};

export default PostWidget;
