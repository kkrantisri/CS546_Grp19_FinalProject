import {Router} from 'express';
const router = Router();
import { addUser, getUserById, getUserByUsername, getUserByEmail, getAllUsers, updateUser, getCoursesbyUserName, getReviewsForUser, addReviewToUser } from '../data/users.js';
import {postData, userData} from '../data/index.js';
import  { checkId, checkString, checkStringArray, checkEmail, checkRating, isValidDate, isTimeSlotValid } from '../helper.js';


router.route('/')
  .get(async (req, res) => {
    try {
      const allUsers = await getAllUsers();
      res.render('admin', {allUsers})
    } catch (error) {
      res.status(404).render('error',{message : error});
    }    
  }).patch(async (req, res) => {
    try{
    const updatedUserData = req.body;
    if (!updatedUserData || typeof updatedUserData !== 'object' || Array.isArray(updatedUserData)) {
      throw 'Invalid or missing updated user data.';
    }
    const user = req.session.user;
    const { username, password, email, fullName, major, languages, coursesEnrolled, bio, gradYear } = updateFields;
    const userId = checkId(user._id);
    const {}
    }catch(e){
      res.status(400).render('editUser', {message : e})
    }
    try{

    }
    
   
  }).delete(async (req, res) => {

  });
router.route('/users/:id')
  .get(async (req, res) => {

});  
router.route("/users/:id/reviews")
  .post(async (req, res) => {
    
});
export default router;