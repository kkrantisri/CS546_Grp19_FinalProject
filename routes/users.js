import {Router} from 'express';
const router = Router();
// import { addUser, getUserById, getUserByUsername, getUserByEmail, getAllUsers, updateUser, getCoursesbyUserName, getReviewsForUser, addReviewToUser, deleteUserById, createreviewbyuserid } from '../data/users.js';
import { addUser, getUserById, getUserByUsername, getUserByEmail, getAllUsers, updateUser, getCoursesbyUserName, getReviewsForUser, addReviewToUser, createreviewbyuserid } from '../data/users.js';
import {postData, userData} from '../data/index.js';
import  { checkId, checkString, checkStringArray, checkEmail, checkRating, isValidDate, isTimeSlotValid, checkPassword } from '../helper.js';


router.route('/')
  .get(async (req, res) => {
    try {
      const allUsers = await getAllUsers();
      res.render('admin', {allUsers})
    } catch (error) {
      res.status(404).render('error',{message : error});
    }    
  }).patch(async (req, res) => {
    const user = req.session.user;
    const userId = user._id.toString();
    const updatedUserData = req.body;
    try{
      userId = checkId(userId,'userId');

    if (!updatedUserData || typeof updatedUserData !== 'object' || Array.isArray(updatedUserData)) {
      throw 'Invalid or missing updated user data.';
    }
      const { username, password, email, fullName, major, languages, coursesEnrolled, bio, gradYear } = updatedUserData;
    if (updatedUserData.hasOwnProperty("username")) {
      const validatedUsername = checkString(username, 'username');
    }
    if (updatedUserData.hasOwnProperty("email")) {
      const validatedEmail = checkString(email, 'email');
    }
    if (updatedUserData.hasOwnProperty("password")) {
      const validatedPassword = checkPassword(password);
    }
    if (updatedUserData.hasOwnProperty("fullName")) {
      const validatedFullName = checkString(fullName, 'fullName');
    }
    if (updatedUserData.hasOwnProperty("major")) {
      const validatedMajor = checkString(major, 'major');
    }
    if (updatedUserData.hasOwnProperty("languages")) {
      const validatedLanguages = checkStringArray(updatedUserData.languages, 'languages');
    }
    if (updatedUserData.hasOwnProperty("coursesEnrolled")) {
      const validatedCoursesEnrolled = checkStringArray(coursesEnrolled, 'coursesEnrolled');
    }
    if (updatedUserData.hasOwnProperty("bio")) {
      const validatedBio = checkString(bio, 'bio');
    }
    if (updatedUserData.hasOwnProperty("gradYear")) {
      const validatedGradYear = checkString(gradYear, 'gradYear');
    }
    }catch(e){
      res.status(400).render('users/editUser', {message : e})
    }
    try{
      const updated = await updateUser(userId ,updatedUserData );
      if(updated.updated === true){
        res.redirect('/users/:${userId}');
      }
    }catch(e){
      res.status(404).render('users/editUser',{message : e})
    }
  }).delete(async (req, res) => {
    const user = req.session.user;
    const userId =user._id.toString();
    try{
      userId = checkId(userId,'userId');
    }catch(e){
      res.status(400).render('users/deleteUser', {message : e})
    }



                          // UNCOMMENT BELOW CODE AFTER WRITING deleteUserById FUNCTION IN data/users.js 



    // try{
    //   const deleted = await deleteUserById(userId);
    //   if(deleted.success === true){
    //     req.session.destroy((err) => {
    //       res.redirect('/login') 
    //     })
    //   }
    // }
    // catch(e){
    //   res.status(404).render('users/deleteUser',{message : e})
    // }
  });
router.route('/edit')
      .get(async (req , res) => {
          res.render('users/editUser');
      })

      router.route('/:id')
      .get(async (req, res) => {
        try {
          const { id } = req.params;
          const loggedInUserId = req.session.user._id;
          const user = await getUserById(id);
    
          if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
          }
    
          if (id === loggedInUserId) {
            // Render index.handlebars for the logged-in user's own profile
            res.render('users/index', { user, editable: true });
          } else {
            // Render userDetails.handlebars for another user's profile
            res.render('users/userDetails', { user });
          }
        } catch (error) {
          console.error('Error:', error.message);
          res.status(500).render('error', { message: 'Internal Server Error' });
        }
      })

router.route(":id/reviews")
  .post(async (req, res) => {
    const user = req.session.user;
    const reviewerId = user._id.toString();
    const userId = req.params.id;
    const body = req.body;
    try{
      reviewerId = checkId(reviewerId,'reviewerId');
      userId = checkId(userId , 'userId');
      const {review ,rating} = body;
      review = checkString(review,'review');
      rating = checkRating(rating,'rating');
    }catch(e){
      res.status(400).render('users/userDetails',{message : e})//page where  the user sees another users profile
    }
    try{
      const review = await createreviewbyuserid(userId, reviewerId , review ,rating);
      if(review.updated === true){
        res.redirect('/users/:${userId}');
      }
    }catch(e){
      res.status(404).render('users/userDetails',{message : e})
    }

    
});
export default router;