import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

const GetComment = ({ postId, children }) => {
  const [comments, setComments] = useState([]);
  const [commentLength, setCommentLength] = useState(0);
  const token = useSelector((state) => state.token);
  const newComments = useSelector((state) => {
    const post = state.posts.find(post => post._id === postId);
    return post ? post.comments : [];
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!postId || !token) return; // Ensure postId and token are available
        const response = await fetch(`http://localhost:3001/posts/${postId}/getcomments`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data = await response.json();
        // Assuming data.data contains the array of comments
        setComments(data.data);
        setCommentLength(data.data.length); // Set initial comment length
      } catch (error) {
        console.error("Error fetching comments:", error.message);
        // Reset comments to an empty array in case of an error
        setComments([]);
        setCommentLength(0);
      }
    };

    fetchComments();
  }, [postId, token]);

  useEffect(() => {
    // Update comments if the length of newComments changes
    if (newComments.length !== commentLength) {
      setComments(newComments);
      setCommentLength(newComments.length);
    }
  }, [newComments, commentLength]);

  return <>{children(comments)}</>;
};

export default GetComment;
