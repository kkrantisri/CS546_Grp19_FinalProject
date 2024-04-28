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
