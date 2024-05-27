import React from "react";
import { Dialog, Box, useMediaQuery, useTheme, Typography } from "@mui/material";
import AddComment from "./AddComment";
import GetComment from "./GetComment";
import UserComment from "./UserComment";
import WidgetWrapper from "./WidgetWrapper";
import UserHeader from "./UserHeader";
import Friend from "./Friend";
import { useSelector } from "react-redux";

const PostPopupDialog = ({ postId, open, handleClose, image, postUserId, name, location, userPicturePath, description }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const loggedInUserId = useSelector((state) => state.user._id);
  const isOwnPost = postUserId === loggedInUserId;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: "20px",
          width: '90vw',
          maxWidth: '1000px',
          overflow: "hidden",
        }
      }}
    >
      <WidgetWrapper
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '0px' : '0px',
          alignItems: 'flex-start',
          padding: isMobile ? '0px' : '0px',
          overflow: "hidden",
          verticalAlign: "middle",
        }}
      >
        <Box
          style={{
            width: isMobile ? "100%" : "70%",
            overflow: 'hidden',
            display: 'flex',
            objectFit: "cover", 
          }}
        >
          <img
            src={`http://localhost:3001/assets/${image}`}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              
              display: 'block',
              margin: '0 auto',
            }}
          />
        </Box>
        <Box
          style={{
            width: isMobile ? "100%" : "30%",
            marginLeft: isMobile ? "0" : "0px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",

          }}
        >
        <Box padding="1rem"

        >  
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
          </Box>
          <Box 
          padding="1rem"
          height = "10vh"
          >
          <Typography
            variant="h5"
            color="textPrimary"
            style={{ marginBottom: "1rem" }}
          >
            {description}
          </Typography>
          </Box>
          <Box
            style={{
              borderRadius: '10px',
              padding: '10px',
              overflow: 'hidden',
              overflowY: "auto",
              height: "55vh",

            }}
          >
          <Box
          style={{
            
          }}
          >
          <GetComment postId={postId}>
            {(comments) => (
              <React.Fragment>
                {comments.length === 0 ? (
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    style={{ textAlign: "center" }}
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
              </React.Fragment>
            )}
          </GetComment>
          </Box>
          </Box>
          <Box padding="1rem">
          <AddComment postId={postId} />
          </Box>
        </Box>
      </WidgetWrapper>
    </Dialog>
  );
};

export default PostPopupDialog;
