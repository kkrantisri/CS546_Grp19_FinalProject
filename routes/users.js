import {Router} from 'express';
const router = Router();
import { addUser, getUserById, getUserByUsername, getUserByEmail, getAllUsers, updateUser, getCoursesbyUserName, getReviewsForUser , deleteUserById , createreviewbyuserid } from '../data/users.js';
import {postData, userData} from '../data/index.js';
import  { checkId, checkString, checkStringArray, checkEmail, checkRating, isValidDate, isTimeSlotValid, checkUsername } from '../helper.js';
import xss from 'xss';

router.route('/')
  .get(async (req, res) => {
    try {
      const allUsers = await getAllUsers();
      res.render('admin', {allUsers})
    } catch (error) {
      res.status(404).render('error',{message : error});
    }    
  });
router.route('/edit')
      .get(async (req , res) => {
          var user = req.session.user.id ;
          var userId = user.toString();
          var usered = await getUserById(userId);

          res.render('users/editUser', {user : usered});
      })  .post(async (req, res) => 
        {
          var user = req.session.user;
          var userId = user.id.toString();
          var updatedUserData = req.body;

          const userr = await getUserById(userId);
          try{
            userId = checkId(userId,'userId');
            
      
          if (!updatedUserData || typeof updatedUserData !== 'object' || Array.isArray(updatedUserData)) {
            throw 'Invalid or missing updated user data.';
          }
            const { username, password, email, fullName, major, languages, coursesEnrolled, bio, gradYear } = updatedUserData;
          if (updatedUserData.hasOwnProperty("username")) {
            username = xss(username)
            var validatedUsername = checkUsername(username, 'username');
          }
          if (updatedUserData.hasOwnProperty("email")) {
            email = user(email)
            var validatedEmail = checkEmail(email, 'email');
          }
          if (updatedUserData.hasOwnProperty("password")) {
            password = xss(password)
            var validatedPassword = checkPassword(password);
          }
          if (updatedUserData.hasOwnProperty("fullName")) {
            fullName = xss(fullName)
            var validatedFullName = checkString(fullName, 'fullName');
          }
          if (updatedUserData.hasOwnProperty("major")) {
            major = xss(major)
            var validatedMajor = checkString(major, 'major');
          }
          if (updatedUserData.hasOwnProperty("languages")) {
            languages = xss(languages)
            var validatedLanguages = checkPassword(languages);
          }
          if (updatedUserData.hasOwnProperty("coursesEnrolled")) {
            coursesEnrolled = xss(coursesEnrolled)
            var validatedCoursesEnrolled = checkStringArray(coursesEnrolled, 'coursesEnrolled');
          }
          if (updatedUserData.hasOwnProperty("bio")) {
            bio = xss(bio)
            var validatedBio = checkString(bio, 'bio');
          }
          if (updatedUserData.hasOwnProperty("gradYear")) {
            gradYear = xss(gradYear)
            var validatedGradYear = checkString(gradYear, 'gradYear');
          }
          }catch(e){
            res.status(400).render('users/editUser', {hasErrors : true , error : e, user : userr})
          }
          try{
            const updated = await updateUser(userId ,updatedUserData );
            if(updated){
              res.status(200).render('users/editUser', {hasErrors : true , error : 'Successfully Updated' , user : updated})
            }
          }catch(e){
            res.status(404).render('users/editUser', {hasErrors : true , error : e})
          }
        });
router.get('/:id', async (req, res) => {
        try {
          var id = req.params.id;
          id = checkId(id);
          const user =  await getUserById(id);
          
          const UserId = req.session.user;
          const loggedInUserId = UserId.id;

      
          if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
          }
      
          if (req.params.id === loggedInUserId.toString()) {
            res.render('users/index', { user, username : user.username , userId : req.params.id});
          } else {
            res.render('users/userDetails', { user : user , id : loggedInUserId});
          }
        } catch (error) {
          console.error('Error:', error.message);
          res.status(500).render('error', { message: 'Internal Server Error' });
        }
      });
router.route("/:id/reviews")
  .post(async (req, res) => {
    var user = req.session.user;
    var reviewerId = user.id.toString();
    var userId = req.params.id;
    const body = req.body;
    body.review = xss(body.review);
    body.rating = xss(body.rating);
    try{
      reviewerId = checkId(reviewerId,'reviewerId');
      userId = checkId(userId , 'userId');
      let {review ,rating} = body;
      review = checkString(review,'review');
      rating = checkRating(rating,'rating');
    }catch(e){
      res.status(400).render('users/userDetails',{message : e})//page where  the user sees another users profile
    }
    try{
      const review = await createreviewbyuserid(userId, reviewerId , body.review ,body.rating);
      if(review.reviewexist === true){
        res.status(200).render('users/userDetails',{message : 'Your review already exists' , user : await getUserById(userId)})
      }
      if(review.reviewexist === false){
        res.redirect(`/users/${userId}`)
      }
      
    }catch(e){
      res.status(404).render('users/userDetails',{message : e})
    }
  
});
router.route("/delete").post(async (req, res) => {
  const user = req.session.user;
  var userId =user.id.toString();
  try{
    userId = checkId(userId,'userId');
  }catch(e){
    res.status(400).render('users/deleteUser', {message : e})
  }
  try{
    const deleted = await deleteUserById(userId);
    if(deleted.success === true){
      req.session.destroy((err) => {
        res.status(200).render('users/deleteUser', {message : "succesfully deleted!!"})
  
      })
    }
  }
  catch(e){
    res.status(404).render('users/deleteUser',{message : e})
  }
}); 
export default router;