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
      res.status
    }


  })