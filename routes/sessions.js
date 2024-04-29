import {Router} from 'express';
const router = Router();
import {userData, sessionData} from '../data/index.js';
import helpers from '../helper.js';

router.route('/new').get(async(req,res)=>{
  const username = req.session.user.username
  const coursesList = await userData.getCoursesbyUserName(username);
  const userList = await userData.getAllUsers();
  res.render('sessions/createSession',{users : userList,courses : coursesList});
});
router.route('/').post(async(req,res)=>{
  const sessionFormData = req.body;
  const senderName = req.session.user.username;
  const coursesList = await userData.getCoursesbyUserName(senderName);
  const userList = await userData.getAllUsers();
  let errors = [];
  try {
    sessionFormData.course = helpers.checkString(sessionFormData.course,'course')
  } catch (error) {
    errors.push(error);
  }
  try {
    sessionFormData.content = helpers.checkString(sessionFormData.content,'content')
  } catch (error) {
    errors.push(error)
  }
  try {
    sessionFormData.timeSlot = helpers.checkString(sessionFormData.timeSlot,'timeSlot')
  } catch (error) {
    errors.push(error)
  }
  try {
    sessionFormData.date = helpers.checkRating(sessionFormData.date,'date')
  } catch (error) {
    errors.push(error);
  }
  try{
    if(!helpers.isValidDate(sessionFormData.date)){
      throw "Please enter valid Date in mm/dd/yyyy and Date cannot be Past Date"
    }
  }catch(error){
    errors.push(error);
  }
  try{
    if(!helpers.isTimeSlotValid(sessionFormData.timeSlot)){
      throw "Please select valid time slot and time slot cannot be in Past"
    }
  }catch(error){
    errors.push(error)
  }
  try {
    sessionFormData.receiverName = helpers.checkString(sessionFormData.receiverName,'receiverName');
  } catch (error) {
    errors.push(error)
  }
  try {
    senderName = helpers.checkString(senderName,'senderName');
  } catch (error) {
    errors.push(error)
  }
  try{
    if(senderName===sessionData.receiverName){
      throw "You cannot Schedule a session with yourself!!"
    }
  }catch(e){
    errors.push(e);
  }
  if(errors.length>0){
    //const userId = req.session.user.userId
    //const coursesList = await userData.getCoursesbyUserId(userId);
    //const userList = await userData.getAllUsers();
    res.status(400).render('sessions/createSession',{users : userList,courses : coursesList,errors : errors,hasErrors:true});
    return;
  }
  try{
    const {course,content,date,timeSlot,receiverName} = sessionFormData;
    //const senderName = req.session.user.username;
    const check = await sessionData.createSession(course,content,senderName,receiverName,date,timeSlot);
    res.redirect(`/sessions/${senderName}/sent`);
    return;
  }catch(e){
    //const userId = req.session.user.userId
    //const coursesList = await userData.getCoursesbyUserId(userId);
    //const userList = await userData.getAllUsers();
    res.status(400).render('sessions/createSession',{users : userList,courses : coursesList,errors : e,hasErrors:true});
    return;
    
  }

});
router.route('/:username/sent').get(async(req,res)=>{
  try {
    req.params.username = helpers.checkString(req.params.username,'username URL Param')
  } catch (e) {
    res.status(400).render('sessions/errors',{error:e,hasuserNameErrors:true});
    return;
  }
  try {
    const sentReqList = await sessionData.getAllSentSessions(req.params.username);
    res.render('sessions/sentreq',{sentReqList:sentReqList});
  } catch (e) {
    res.status(404).render('sessions/errors',{error:e,hasuserNotFoundErrors:true});
    return;
  }
});
router.route('/:username/received').get(async(req,res)=>{
  try {
    req.params.username = helpers.checkString(req.params.username,'username URL Param')
  } catch (e) {
    res.status(400).render('sessions/errors',{error:e,hasuserNameErrors:true});
    return;
  }
  try {
    const receivedReqList = await sessionData.getAllReceivedSessions(req.params.username);
    res.render('sessions/receivedreq',{sentReqList:sentReqList});
  } catch (e) {
    res.status(404).render('sessions/errors',{error:e,hasuserNotFoundErrors:true});
    return;
  }
});


