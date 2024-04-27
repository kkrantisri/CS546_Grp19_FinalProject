import { sessions } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';

// Function to get a session by its ID
export const getSessionById = async (sessionId) => {
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length === 0 || !ObjectId.isValid(sessionId)) {
    throw new Error('Invalid session ID');
  }

  const sessionCollection = await sessions();
  const session = await sessionCollection.findOne({ _id: new ObjectId(sessionId) });

  if (!session) {
    throw new Error('Session not found');
  }

  session._id = session._id.toString();
  return session;
};

// Function to create a new session
export const createSession = async (sessionData) => {
  const { course, content, senderId, receiverId, date, timeSlot, status } = sessionData;

  if (!course || !content || !senderId || !receiverId || !date || !timeSlot || !Array.isArray(timeSlot) || timeSlot.length === 0 || !status) {
    throw new Error('Invalid session data');
  }

  const sessionCollection = await sessions();
  const newSession = {
    course,
    content,
    senderId,
    receiverId,
    date,
    timeSlot,
    status
  };

  const insertInfo = await sessionCollection.insertOne(newSession);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error('Could not create session');
  }

  const sessionId = insertInfo.insertedId.toString();
  const createdSession = await getSessionById(sessionId);
  return createdSession;
};

// Function to update session details
export const updateSession = async (sessionId, updatedSessionData) => {
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length === 0 || !ObjectId.isValid(sessionId)) {
    throw new Error('Invalid session ID');
  }

  const sessionCollection = await sessions();
  const { course, content, senderId, receiverId, date, timeSlot, status } = updatedSessionData;

  const updatedSession = {
    course,
    content,
    senderId,
    receiverId,
    date,
    timeSlot,
    status
  };

  const updateInfo = await sessionCollection.updateOne({ _id: new ObjectId(sessionId) }, { $set: updatedSession });

  if (updateInfo.modifiedCount === 0) {
    throw new Error('Could not update session');
  }

  const updatedSessionObj = await getSessionById(sessionId);
  return updatedSessionObj;
};

// Function to delete a session
export const deleteSession = async (sessionId) => {
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length === 0 || !ObjectId.isValid(sessionId)) {
    throw new Error('Invalid session ID');
  }

  const sessionCollection = await sessions();
  const deletionInfo = await sessionCollection.deleteOne({ _id: new ObjectId(sessionId) });

  if (deletionInfo.deletedCount === 0) {
    throw new Error('Could not delete session');
  }

  return `Session with ID ${sessionId} has been deleted`;
};

// Function to get sessions by user ID (sender or receiver)
export const getSessionsByUserId = async (userId) => {
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0 || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const sessionCollection = await sessions();
  const userSessions = await sessionCollection.find({ $or: [{ senderId: userId }, { receiverId: userId }] }).toArray();

  return userSessions.map(session => {
    session._id = session._id.toString();
    return session;
  });
};
