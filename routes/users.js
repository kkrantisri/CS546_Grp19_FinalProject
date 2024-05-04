import {Router} from 'express';
const router = Router();
import { addUser, getUserById, getUserByUsername, getUserByEmail, getAllUsers, updateUser, getCoursesbyUserName, getReviewsForUser, addReviewToUser } from '../data/users.js';
import {postData, userData} from '../data/index.js';
import  { checkId, checkString, checkStringArray, checkEmail, checkRating, isValidDate, isTimeSlotValid } from '../helper.js';


router.route('/users/:id')
  .get(async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await getUserById(userId);
      if (user) {
        res.render('user_profile', { user });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// get - myProfile
router.route('/users/myProfile')
  .get(async (req, res) => {
    if (req.session.user) {
      try {
        const userInfo = await getUserById(req.session.user);
        return res.render("users/index", {
          userInfo: userInfo,
          userLoggedIn: true
        }) 
      } catch (e) {
          res.status(500).render("error", { errors: e, userLoggedIn: true });
    }
  } else {
    return res.redirect("/login");
  }
});

// Get - Edit myProfile
router.route("/users/myProfileEdit")
  .get(async (req, res) => {
  if (req.session.user) {
    const userInfo = await users.getUserById(req.session.user);
    return res.render("users/editUser", {
      userInfo: userInfo,
      userLoggedIn: true,
    });
  } else {
    return res.redirect("/login");
  }
});

// Post - Edit Profile


export default router;