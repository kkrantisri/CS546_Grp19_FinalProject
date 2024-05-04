import { Router } from 'express';
import { users } from '../config/mongoCollections.js';
import { registerUser, loginUser } from '../data/users.js';
import bcrypt from 'bcrypt';
const router = Router();

router.route('/')
  .get(async (req, res) => {
    try {
      return res.json({ error: 'YOU SHOULD NOT BE HERE!' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.route('/register')
  .get(async (req, res) => {
    try {
      res.status(200).render('signup', { title: 'Signup Page' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }).post(async (req, res) => {
    try {
      let { username, password, email, fullname, major, languages, coursesEnrolled, reviews, bio, gradyear } = req.body;
      const validatedUsername = helpers.checkString(username, 'username');
      const validatedPassword = helpers.checkString(password, 'password');
      const validatedEmail = helpers.checkEmail(email);
      const validatedFullName = helpers.checkString(fullName, 'fullName');
      const validatedMajor = helpers.checkString(major, 'major');
      const validatedLanguages = helpers.checkStringArray(languages, 'languages');
      const validatedCoursesEnrolled = helpers.checkStringArray(coursesEnrolled, 'coursesEnrolled');
      const validatedBio = helpers.checkString(bio, 'bio');
      const validatedGradYear = helpers.checkPositiveNumber(gradYear, 'gradYear');
      
      const newUser = await addUser({
        username: validatedUsername,
        password: validatedPassword,
        email: validatedEmail,
        fullName: validatedFullName,
        major: validatedMajor,
        languages: validatedLanguages,
        coursesEnrolled: validatedCoursesEnrolled,
        bio: validatedBio,
        gradYear: validatedGradYear
      });

      res.status(200).render('signup', { message: 'Successfully Registered. You can login now.', title: 'Login' });
    } catch (error) {
      res.status(400).render('signup', { message: error.message || 'Error: Internal Server Error', title: 'Signup Form' });
    }
  });
  router.route('/login')
  .get(async (req, res) => {
    try {
      res.status(200).render('login', { title: 'Login Form' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }) .post(async (req, res) => {
    try {
      let { username, password } = req.body;
      username = helpers.checkString(username, 'username');
      password = helpers.checkString(password, 'password');

      // Authenticate user
      const user = await loginUser(username, password);

      // If user is authenticated
      if (user) {
        req.session.user = {
          id: user._id, // Assuming `user._id` holds the user's ID after successful authentication
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          major: user.major,
          languages: user.languages,
          coursesEnrolled: user.coursesEnrolled,
          bio: user.bio,
          gradYear: user.gradYear,
          reviews: user.reviews
        };
        res.redirect('/posts');
      } else {
        res.status(401).render('login', { message: 'Invalid username or password.', title: 'Login Form' });
      }
    } catch (error) {
      res.status(400).render('login', { message: error.message || 'Error: Internal Server Error', title: 'Login Form' });
    }
  });
router.route('/logout')
  .get(async (req, res) => {
    try {
      req.session.destroy();
      res.status(200).render('logout');
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  export default router;









