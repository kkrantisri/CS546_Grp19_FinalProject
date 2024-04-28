import {Router} from 'express';
const router = Router();
import {postData, userData} from '../data/index.js';
import helpers from '../helper.js';

router.route('/new').get(async (req, res) => {
  res.render('posts/createPost');
});

router
  .route('/')
  .get(async (req, res) => {
    try {
      const postList = await postData.getAllPosts()
      res.render('posts/index', {posts: postList});
    } catch (e) {
      res.status(500).json({error: e});
    }
  })
  .post(async (req, res) =>{
    const queryPostData = req.body;
    const userId = req.session.user.userId
    queryPostData.userId = userId;
    let errors = [];
    try {
      queryPostData.title = helpers.checkString(queryPostData.title, 'Title');
    } catch (e) {
      errors.push(e);
    }
    try {
      queryPostData.content = helpers.checkString(queryPostData.content, 'content');
    } catch (e) {
      errors.push(e);
    }
    try {
      queryPostData.userId = helpers.checkId(queryPostData.userId, 'userId');
    } catch (e) {
      errors.push(e);
    }
    if (queryPostData.tags) {
      let tags = queryPostData.tags.split(',');
      try {
        queryPostData.tags = helpers.checkStringArray(tags, 'Tags');
      } catch (e) {
        errors.push(e);
      }
    }
    if (errors.length > 0) {
      
      res.status(400).render('posts/createPost', {
        errors: errors,
        hasErrors: true,
        post: queryPostData,
      });
      return;
    }
    try{
      const {title,content,userId,tags}=queryPostData;
      const newPost = await postData.createPost(title,content,userId,tags);
      res.redirect(`/posts/${newPost._id}`);
    }catch(e){
      res.status(500).render('error',{message : e})
    }
  })

  router
  .route('/:id')
  .get(async (req, res) => {
    const postId = req.params.id
    try {
      const validPostId = helpers.checkId(postId , 'postId');
      const postList = await postData.getPostById(validPostId);
      if(!postList){
        throw 'Error : Post Not Found'
      }
      res.render('posts/postDetails', {postList});
    } catch (e) {
      res.status(404).json({error: e});
    }
  })
  .patch(async (req, res) =>{
    const postId = req.params.id;
    const updatedPostData = req.body;
    try{
      const validPostId = helpers.checkId(postId , 'postId');
      const existingPost = await postData.getPostById(validPostId);
      if(!existingPost){
        throw `Post with ID ${validPostId} not found` 
      }
      const validFields = ['title' , 'content' , 'course' , 'tags'];
      const updatedPost = Object.keys(updatedPostData).filter(i => validFields.includes(i));
      if(!updatedPost){
        throw 'Error : atleast one field should exist to update'
      }

      const updatedField = await postData.updatePost(validPostId,updatedPost);
      res.render('editPost', {message : 'Sucessfully updated the post !!'})
    }catch(e){
      res.status(400).render('error',{message : e})
    }
    
  })
  .delete(async (req, res) =>{
    
  })