

import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);
app.engine('handlebars', exphbs.engine({defaultLayout: 'main',helpers:{userLikedPost:function(post,user,options){
  if (post.likedBy.includes(user)){
    return options.fn(this);
  }else{
    return options.inverse(this);
  }
},userDislikedPost:function(post,user,options){
  if (post.dislikedBy.includes(user)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
},equal:function(val1,val2,options){
  if (val1 === val2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
},isSelectedLanguage: function(language, userLanguages) {
      if (!Array.isArray(userLanguages)) {
        return false; // Default to not selected if selectedLanguages is not an array
    }
    return userLanguages.includes(language);
},isSelectedCourse: function(course,coursesEnrolled) {
      if (!Array.isArray(coursesEnrolled)) {
        return false; // Default to not selected if selectedLanguages is not an array
    }
  return coursesEnrolled.includes(course);
}
}}));
app.set('view engine', 'handlebars');
app.use(
  session({
    name: 'AuthenticationState',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false
  })
);
app.use('/',(req , res , next) => {
  if(req.path === '/'){
  if(req.session.user){
         res.redirect('/posts')
  } else {
      return res.redirect('/login')
  }
  } 
  else{
      next();  
  }
})
app.use('/login',(req,res,next) => {
  if(req.session.user){
      if(req.session.user.role === "user"){
        res.redirect('/posts')
      }
  }
  else{
  next();
  }
})
app.use('/register',(req,res,next) => {
  if(req.session.user){
    if(req.session.user.role === "user"){
      res.redirect('/posts')
      }
  }else{
  next();
  }
})
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});