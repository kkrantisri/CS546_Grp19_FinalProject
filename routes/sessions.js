import { Router } from 'express';
const router = Router();
import {userData, sessionData} from '../data/index.js';
import helpers from '../helper.js';

router.route('/new').get(async (req, res) => {
  const username = req.session.user.username
  const coursesList = await userData.getCoursesbyUserName(username);
  const userList = await userData.getAllUsers();
  res.render('sessions/createSession', { users: userList, courses: coursesList });
});
router.route('/').post(async (req, res) => {
  const sessionFormData = req.body;
  const senderName = req.session.user.username;
  const coursesList = await userData.getCoursesbyUserName(senderName);
  const userList = await userData.getAllUsers();
  let errors = [];
  try {
    sessionFormData.course = helpers.checkString(sessionFormData.course, 'course')
  } catch (error) {
    errors.push(error);
  }
  try {
    sessionFormData.content = helpers.checkString(sessionFormData.content, 'content')
  } catch (error) {
    errors.push(error)
  }
  try {
    sessionFormData.timeSlot = helpers.checkString(sessionFormData.timeSlot, 'timeSlot')
  } catch (error) {
    errors.push(error)
  }
  try {
    sessionFormData.date = helpers.checkRating(sessionFormData.date, 'date')
  } catch (error) {
    errors.push(error);
  }
  try {
    if (!helpers.isValidDate(sessionFormData.date)) {
      throw "Please enter valid Date in mm/dd/yyyy and Date cannot be Past Date"
    }
  } catch (error) {
    errors.push(error);
  }
  try {
    if (!helpers.isTimeSlotValid(sessionFormData.timeSlot, sessionFormData.date)) {
      throw "Please select valid time slot and time slot cannot be in Past"
    }
  } catch (error) {
    errors.push(error)
  }
  try {
    sessionFormData.receiverName = helpers.checkString(sessionFormData.receiverName, 'receiverName');
  } catch (error) {
    errors.push(error)
  }
  try {
    senderName = helpers.checkString(senderName, 'senderName');
  } catch (error) {
    errors.push(error)
  }
  try {
    if (senderName === sessionFormData.receiverName) {
      throw "You cannot Schedule a session with yourself!!"
    }
  } catch (e) {
    errors.push(e);
  }
  if (errors.length > 0) {
    //const userId = req.session.user.userId
    //const coursesList = await userData.getCoursesbyUserId(userId);
    //const userList = await userData.getAllUsers();
    res.status(400).render('sessions/createSession', { users: userList, courses: coursesList, sessions: sessionFormData, errors: errors, hasErrors: true });
    return;
  }
  try {
    const { course, content, date, timeSlot, receiverName } = sessionFormData;
    //const senderName = req.session.user.username;
    const succ = await sessionData.createSession(course, content, senderName, receiverName, date, timeSlot);
    if (succ.sessionCreated) {
      res.redirect(`/sessions/${senderName}/sent`);
    }
    else {
      res.status(500).json({ error: "Internal Server Error" });
    }

  } catch (e) {
    //const userId = req.session.user.userId
    //const coursesList = await userData.getCoursesbyUserId(userId);
    //const userList = await userData.getAllUsers();
    res.status(400).render('sessions/createSession', { users: userList, courses: coursesList, sessions: sessionFormData, errors: e, hasErrors: true });
    return;

  }

});
router.route('/:username/sent').get(async (req, res) => {
  try {
    req.params.username = helpers.checkString(req.params.username, 'username URL Param')
  } catch (e) {
    res.status(400).render('sessions/errors', { error: e, has400Errors: true });
    return;
  }
  try {
    const sentReqList = await sessionData.getAllSentSessions(req.params.username);
    res.render('sessions/sentreq', { sentReqList: sentReqList });
  } catch (e) {
    res.status(404).render('sessions/errors', { error: e, has404FoundErrors: true });
    return;
  }
});
router.route('/:username/received').get(async (req, res) => {
  try {
    req.params.username = helpers.checkString(req.params.username, 'username URL Param')
  } catch (e) {
    res.status(400).render('sessions/errors', { error: e, has400Errors: true });
    return;
  }
  try {
    const receivedReqList = await sessionData.getAllReceivedSessions(req.params.username);
    res.render('sessions/receivedreq', { receivedReqList: receivedReqList });
  } catch (e) {
    res.status(404).render('sessions/errors', { error: e, has404FoundErrors: true });
    return;
  }
});
router.route('/:username/received/:sessionId').patch(async (req, res) => {
  const status = req.body.action;
  const username = req.params.username;
  const sessionId = req.params.sessionId;
  let errors = []
  try {
    status = helpers.checkString(status, 'status');
  } catch (e) {
    errors.push(e)
  }
  try {
    username = helpers.checkString(username, 'username');
  } catch (e) {
    errors.push(e)
  }
  try {
    sessionId = helpers.checkId(sessionId, 'sessionId')
  } catch (e) {
    errors.push(e)
  }
  try {
    if (status !== "accepted" && status !== "rejected") {
      throw 'Status should be either accepted or rejected'
    }
  } catch (e) {
    errors.push(e);
  }
  if (errors.length > 0) {
    res.status(400).render('sessions/errors', { errors: errors }, { has400Errors: true });
  }
  try {
    const succ = await sessionData.updateSessionPatch(sessionId, username, status);
    if (succ.sessionUpdated) {
      res.json({ status: succ.status });
    }

    else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (e) {
    res.status(404).render('sessions/errors', { errors: e }, { has404FoundErrors: true });
    return;
  }
});

export default router


