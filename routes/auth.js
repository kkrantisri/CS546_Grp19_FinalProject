import { Router } from "express";
import { users } from "../config/mongoCollections.js";
import { addUser, loginUser } from "../data/users.js";
import {
  checkId,
  checkString,
  checkStringArray,
  checkEmail,
  checkRating,
  isValidDate,
  isTimeSlotValid,
  checkPassword,
  checkUsername,
} from "../helper.js";
import bcrypt from "bcrypt";
import xss from "xss";
const router = Router();

router.route("/").get(async (req, res) => {
  try {
    return res.json({ error: "YOU SHOULD NOT BE HERE!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router
  .route("/register")
  .get(async (req, res) => {
    try {
      res.status(200).render("signup", { title: "Duckpal" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .post(async (req, res) => {
    try {
      let { username, password, email, fullname, major, languages, coursesEnrolled, bio, gradyear } = req.body;
      username = xss(username);
      password = xss(password);
      email = xss(email);
      fullname = xss(fullname);
      major = xss(major);
      bio = xss(bio);
      gradyear = xss(gradyear);
      const validatedUsername =  checkUsername(username, 'username');
      const validatedPassword =  checkPassword(password);
      const validatedEmail =  checkEmail(email);
      const validatedFullName =  checkString(fullname, 'fullName');
      const validatedMajor =  checkString(major, 'major');
      const validatedLanguages =  checkStringArray(languages, 'languages');
      //coursesEnrolled = coursesEnrolled.split(',');
      const validatedCoursesEnrolled =  checkStringArray(coursesEnrolled, 'coursesEnrolled');
      const validatedBio =  checkString(bio, 'bio');
      //const validatedGradYear =  checkPositiveNumber(gradyear, 'gradYear');
      
      const newUser = await addUser({
        username: validatedUsername,
        password: validatedPassword,
        email: validatedEmail,
        fullName: validatedFullName,
        major: validatedMajor,
        languages: validatedLanguages,
        coursesEnrolled: validatedCoursesEnrolled,
        bio: validatedBio,
        gradYear: gradyear
      });

      res.status(200).render('signup', { message: 'Successfully Registered. You can login now.',hasMessage:true });
    } catch (error) {
      res.status(400).render("signup", {
        message: error,
        hasMessage : true,
        title: "Signup Form",
      });
    }
  });
router
  .route("/login")
  .get(async (req, res) => {
    try {
      res.status(200).render("login", { title: "Welcome to Duckpal" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .post(async (req, res) => {
    var userData =req.body;
    userData.username = xss(req.body.username);
    userData.password = xss(req.body.password);

    let errors = [];
    try {
      userData.username = checkString(userData.username,'username');
    } catch (e) {
      errors.push(e)
    }
    try {
      if(!userData.password || typeof userData.password!=="string"){
        throw 'Password should exists and should be of type string'
      }
      userData.password = userData.password.trim()
    
      if(userData.password===""|| /\s/.test(userData.password) || userData.password.length<8){
        throw 'Password should not contains spaces and must be minimum 8 characters long'
      }
      if(!/[A-Z]/.test(userData.password) || !/\d/.test(userData.password) || !/[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(userData.password) ){
        throw 'Password should contain at least one uppercase character and at least one number and there has to be at least one special character'
      }
    } catch (e) {
      errors.push(e)
    }
    if(errors.length>0){
      res.status(400).render('login',{
        errors : errors,
        hasErrors : true,
      });
      return;
    }
    try{
      const {username,password} = userData
      const check = await loginUser(username,password)
      req.session.user = {id:check._id,username : check.username,
      fullName : check.fullName,
    coursesEnrolled : check.coursesEnrolled,role:check.role}

      //const tp = req.session.user.id.toString();
      
      res.status(200).redirect('/posts')
      
    }
    catch(e){
      errors.push(e)
      res.status(400).render('login',{
        errors : errors,
        hasErrors : true,
       });
       return ;
    }

    
  });
router.route("/logout").get(async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).render("logout");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
