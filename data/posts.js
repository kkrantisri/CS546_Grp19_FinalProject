import { posts, users } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';
import * as userData from './users.js'
import helpers from '../helper.js'
// Function to get a post by its ID
export const getPostById = async (id) => {
  id = helpers.checkId(id);
  const postCollection = await posts();
  const post = await postCollection.findOne({ _id: new ObjectId(id) });
  if (!post) {
    throw 'Error: Post not found';
  }
  //post._id = post._id.toString();
  return post;
};
// Function to get all posts
export const getAllPosts = async () => {
  const postCollection = await posts();
  return await postCollection.find({}).toArray();
};
export const getPostsByTag = async (tag)=>{
  tag = helpers.checkString(tag,'Tag')
  const postCollection = await posts();
    return await postCollection.find({tags: tag}).toArray();
};
// Function to create a new post
export const createPost = async (title, content, userId, tags,course) => {
  title = helpers.checkString(title, 'Title');
  content = helpers.checkString(content,'content');
  course = helpers.checkString(course,'course')
  userId = validation.checkId(userId, 'User ID');
  if (!Array.isArray(tags)) {
    tags = [];
  } else {
    tags = validation.checkStringArray(tags, 'Tags');
  }
  //const userThatPosted = await userData.getUserById(userId);
  const last_updated_at = new Date().toUTCString()
  const newPost = {
    title : title,
    content :content,
    userId: userId,
    course : course,
    tags: tags,
    last_updated_at : last_updated_at,
    likes: 0,
    dislikes: 0,
    comments: []
  };
  const postCollection = await posts();
  const insertInfo = await postCollection.insertOne(newPost);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error('Could not create post');
  }

  const postId = insertInfo.insertedId.toString();
  const createdPost = await getPostById(postId);
  return createdPost;
};

// Function to update post
export const updatePost = async (id,updatedPost) => {
    const updatedPostData = {};
    

    
    if (updatedPost.tags) {
      updatedPostData.tags = validation.checkStringArray(
        updatedPost.tags,
        'Tags'
      );
    }

    if (updatedPost.title) {
      updatedPostData.title = validation.checkString(
        updatedPost.title,
        'Title'
      );
    }

    if (updatedPost.content) {
      updatedPostData.content = validation.checkString(updatedPost.content, 'content');
    }
    if (updatedPost.course) {
      updatedPostData.course = validation.checkString(updatedPost.course, 'course');
    }
    updatedPostData.last_updated_at = new Date().toUTCString()
    const postCollection = await posts();
    let newPost = await postCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: updatedPostData},
      {returnDocument: 'after'}
    );
    if (newPost.lastErrorObject.n === 0)
      throw [404, `Could not update the post with id ${id}`];

    return newPost.value;
  
};

// Function to delete a post
export const deletePost = async (id) => {
  id = validation.checkId(id);

  const postCollection = await posts();
  const deletionInfo = await postCollection.findOneAndDelete({ _id: new ObjectId(postId) });

  if (deletionInfo.lastErrorObject.n === 0)
      throw [404, `Could not delete post with id of ${id}`];

  return {...deletionInfo.value, deleted: true};
};
export const createComment = async (postId,) =>{

}

// Function to retrieve comments by post ID
export const getCommentsByPostId = async (postId) => {
  const commentCollection = await comments();
  const postComments = await commentCollection.find({ postId: postId }).toArray();

  return postComments;
};

// Function to search posts by tag
// export const searchByTag = async (tag) => {
//   const postCollection = await posts();
//   const taggedPosts = await postCollection.find({ tags: tag }).toArray();

//   return taggedPosts.map(post => {
//     post._id = post._id.toString();
//     return post;
//   });
// };

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
  