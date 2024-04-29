<<<<<<< HEAD

import express from 'express';
const router = express.Router();

  app.use("/posts", postRoutes);
  app.use("/sessions", sessionRoutes);
  app.use("/users", userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });


export default router;
=======
import postRoutes from './posts.js';
import userRoutes from './users.js';
import sessionRoutes from'./sessions.js';
import path from 'path';
import {static as staticDir} from 'express';
const constructorMethod = (app) => {
  app.use('/posts', postRoutes);
  app.use('/sessions', sessionRoutes);
  app.use('/users', userRoutes);
  app.get('/about', (req, res) => {
    res.sendFile(path.resolve('static/about.html'));
  });
  app.get('/contact', (req, res) => {
    res.sendFile(path.resolve('static/contact.html'));
  });
  app.use('/public', staticDir('public'));
  app.use('*', (req, res) => {
    res.redirect('/');
  });
};

export default constructorMethod;
>>>>>>> 0836344c62ff98b224f58093e9c26c69a5629e69
