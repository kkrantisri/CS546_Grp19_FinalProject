import {Router} from 'express';
const router = Router();
import {userData, sessionData} from '../data/index.js';
import helpers from '../helper.js';

router.route('/new').get(async(req,res)=>{
  res.render()
})