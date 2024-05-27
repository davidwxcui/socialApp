import React from "react";
import { Typography } from "@mui/material";
import UserComment from "./UserComment";

const CommentList = ({ comments }) => (
  <div
    style={{
      Height: "500px", // Adjust the minimum height as needed
      overflowY: "auto",
    }}
  >
    {comments.length === 0 ? (
      <Typography
      >
        No comments yet... be the first to comment!
      </Typography>
    ) : (
      comments.map((comment, index) => (
        <UserComment
          key={index}
          firstName={comment.firstName}
          lastName={comment.lastName}
          text={comment.text}
          comment={comment}
        />
      ))
    )}
  </div>
);

export default CommentList;
