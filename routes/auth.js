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
      res.status(200).render('register', { title: 'Register' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }).post(async (req, res) => {
    try {
      let { firstName, lastName, username, password, confirmPassword, favoriteQuote, themePreference, role } = req.body;
      firstName = helpers.checkString(firstName, 'firstName');
      lastName = helpers.checkString(lastName, 'lastName');
      username = helpers.checkString(username, 'username');
      password = helpers.checkString(password, 'password');
      confirmPassword = helpers.checkString(confirmPassword, 'confirmPassword');
      favoriteQuote = helpers.checkString(favoriteQuote, 'favoriteQuote');
      themePreference = helpers.checkString(themePreference, 'themePreference');
      role = helpers.checkString(role, 'role');

      const insertUser = await registerUser(firstName, lastName, username, password, favoriteQuote, themePreference, role);

      if (insertUser.signupCompleted) {
        res.status(200).render('login', { message: 'Successfully Registered. You can login now.', title: 'Login' });
      } else {
        throw new Error('Internal Server Error');
      }
    } catch (error) {
      res.status(400).render('register', { message: error.message || 'Error: Internal Server Error', title: 'Register' });
    }
  });
  router.route('/login')
  .get(async (req, res) => {
    try {
      res.status(200).render('login', { title: 'Login' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  .post(async (req, res) => {
    try {
      let { username, password } = req.body;
      username = helpers.checkString(username, 'username');
      password = helpers.checkString(password, 'password');
      const user = await loginUser(username, password);
      if (user) {
        req.session.user = {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          favoriteQuote: user.favoriteQuote,
          themePreference: user.themePreference,
          role: user.role
        };
      } else {
        throw new Error('Either username or password');
      }
      if (user.role === 'admin') {
        res.redirect('/admin');
      } else {
        res.redirect('/user');
      }
    } catch (error) {
      res.status(400).render('login', { message: error.message || 'Error: Internal Server Error', title: 'Login' });
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


router.route('/posts')
  .get(async (req, res) => {
    try {
      if (req.session.user) {
        res.render('posts', { user: req.session.user });
      } else {
        res.redirect('/login');
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  export default router;









