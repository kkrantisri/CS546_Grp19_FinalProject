import { posts, users } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';

// Function to get a post by its ID
export const getPostById = async (postId) => {
  if (!postId || typeof postId !== 'string' || postId.trim().length === 0 || !ObjectId.isValid(postId)) {
    throw new Error('Invalid post ID');
  }
  const postCollection = await posts();
  const post = await postCollection.findOne({ _id: new ObjectId(postId) });
  if (!post) {
    throw new Error('Post not found');
  }
  post._id = post._id.toString();
  return post;
};
// Function to get all posts
export const getAllPosts = async () => {
  const postCollection = await posts();
  const allPosts = await postCollection.find({}).toArray();

  return allPosts.map(post => {
    post._id = post._id.toString();
    return post;
  });
};
// Function to create a new post
export const createPost = async (title, content, authorId, tags) => {
  if (!title || !content || !authorId || !tags || !Array.isArray(tags) || tags.length === 0) {
    throw new Error('Invalid post data');
  }
  const postCollection = await posts();
  const newPost = {
    title: title,
    content: content,
    authorId: authorId,
    tags: tags.map(tag => tag.trim()),
    likes: 0,
    dislikes: 0,
    comments: []
  };

  const insertInfo = await postCollection.insertOne(newPost);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error('Could not create post');
  }

  const postId = insertInfo.insertedId.toString();
  const createdPost = await getPostById(postId);
  return createdPost;
};

// Function to update post (like or dislike)
export const updatePost = async (postId, action) => {
  if (!postId || typeof postId !== 'string' || postId.trim().length === 0 || !ObjectId.isValid(postId)) {
    throw new Error('Invalid post ID');
  }

  const postCollection = await posts();
  const updateAction = {};

  if (action === 'like') {
    updateAction.likes = 1;
  } else if (action === 'dislike') {
    updateAction.dislikes = 1;
  } else {
    throw new Error('Invalid action');
  }

  const updatedInfo = await postCollection.updateOne({ _id: new ObjectId(postId) }, { $inc: updateAction });

  if (updatedInfo.modifiedCount === 0) {
    throw new Error('Could not update post');
  }

  const updatedPost = await getPostById(postId);
  return updatedPost;
};

// Function to delete a post
export const deletePost = async (postId) => {
  if (!postId || typeof postId !== 'string' || postId.trim().length === 0 || !ObjectId.isValid(postId)) {
    throw new Error('Invalid post ID');
  }

  const postCollection = await posts();
  const deletionInfo = await postCollection.deleteOne({ _id: new ObjectId(postId) });

  if (deletionInfo.deletedCount === 0) {
    throw new Error('Could not delete post');
  }

  return `Post with ID ${postId} has been deleted`;
};

// Function to retrieve comments by post ID
export const getCommentsByPostId = async (postId) => {
  const commentCollection = await comments();
  const postComments = await commentCollection.find({ postId: postId }).toArray();

  return postComments;
};

// Function to search posts by tag
export const searchByTag = async (tag) => {
  const postCollection = await posts();
  const taggedPosts = await postCollection.find({ tags: tag }).toArray();

  return taggedPosts.map(post => {
    post._id = post._id.toString();
    return post;
  });
};

// Function to get user by comment ID
export const getUserByCommentId = async (commentId) => {
  const commentCollection = await comments();
  const comment = await commentCollection.findOne({ _id: new ObjectId(commentId) });

  if (!comment) {
    throw new Error('Comment not found');
  }

  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(comment.userId) });

  if (!user) {
    throw new Error('User not found');
  }

  user._id = user._id.toString();
  return user;
};


  //getpostbyid
  //getallposts
  //createpost
  //updatepost(like , dislikes)
  //deletepost
  //commentsbypostid
  //searchbytag
  //userbycommentid
  