import {Router} from 'express';
const router = Router();
import { addUser, getUserById, getUserByUsername, getUserByEmail, getAllUsers, updateUser, getCoursesbyUserName, getReviewsForUser, addReviewToUser } from '../data/users.js';
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
    const userId = checkId(user._id.toString());
    const updatedUserData = req.body;
    try{

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
      const validatedLanguages = checkPassword(languages);
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
      res.status(400).render('editUser', {message : e})
    }
    try{
      const updated = await updateUser(userId ,updatedUserData );
      if(updated.updated === true){
        res.redirect('/users/:${userId}');
      }
    }catch(e){
      res.status(404).render('editUser',{message : e})
    }
  }).delete(async (req, res) => {
    

  });
router.route('/users/:id')
  .get(async (req, res) => {

});  
router.route("/users/:id/reviews")
  .post(async (req, res) => {
    
});
export default router;