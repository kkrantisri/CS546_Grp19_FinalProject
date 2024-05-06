

import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
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
}}}));
app.set('view engine', 'handlebars');
app.use(
  session({
    name: 'AuthenticationState',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false
  })
);
// app.use('/',(req , res , next) => {
//   const currentTimestamp  = new Date().toUTCString();
//   var authenticateStatus = "";
//   if(req.session.user){
//       authenticateStatus = "Authenticated User"
//   }
//   else{
//       authenticateStatus = "Non - Authenticated User"
//   }

//   console.log(`[${currentTimestamp}] : ${req.method} ${req.originalUrl} (${authenticateStatus})`)
//   if(req.path === '/'){
//   if(req.session.user){

//       if(req.session.user.role === 'user'){
//           return res.redirect('/posts')
//       }
//   } else {
//       return res.redirect('/login')
//   }
//   } 
//   else{
//       next();  
//   }})

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});