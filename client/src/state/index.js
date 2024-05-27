import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light',
  user: null,
  token: null,
  posts: [],
  newComments: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non existent");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) {
          return action.payload.post;
        }
        return post;
      });
      state.posts = updatedPosts;
    },
    setComment: (state, action) => {
        // Find the post to add the comment to
        const postToUpdate = state.posts.find(post => post._id === action.payload.postId);
        // Update the comments of the post
        if (postToUpdate) {
          const updatedComments = [...postToUpdate.comments, action.payload.comment]; // Create a new array of comments
          const updatedPost = {
            ...postToUpdate,
            comments: updatedComments, // Update comments with the new array
          };
          return {
            ...state,
            posts: state.posts.map(post => (post._id === updatedPost._id ? updatedPost : post)),
          };
        }
        // Return the unchanged state if the post is not found
        return state;
      },

  }
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setComment } = authSlice.actions;
export default authSlice.reducer;
