import React from 'react';
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { Typography, Divider, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserComment = ({ firstName, lastName, text, comment }) => {
  const userPicturePath = comment.userPicturePath;
  const dateCreated = new Date(comment.createdAt).toLocaleDateString();
  const { palette } = useTheme();
  const navigate = useNavigate();
  
  const handleUserClick = () => {
    // Navigate to the user's profile page or any other desired route
    navigate(`/profile/${comment.userId}`);
  };

  return (
    <WidgetWrapper padding="1rem">
      <FlexBetween alignItems="flex-start" gap="1rem">
        <UserImage image={userPicturePath} size="45px" borderRadius="50%" />
        <div style={{ flex: 1 }}>
          <FlexBetween alignItems="center" gap="0.5rem" marginBottom="0.5rem">
            <Typography 
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
              variant="subtitle1" 
              fontWeight="bold" 
              onClick={handleUserClick} 
            >
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {dateCreated}
            </Typography>
          </FlexBetween>
          <Typography variant="body1">
            {text}
          </Typography>
        </div>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default UserComment;
