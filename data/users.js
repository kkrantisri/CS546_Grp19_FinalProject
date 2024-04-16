import { users } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';

// Function to get a user by their ID
export const getUserById = async (userId) => {
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0 || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new Error('User not found');
  }

  user._id = user._id.toString();
  return user;
};

// Function to add a new user
export const addUser = async (userData) => {
  const { username, password, email, fullName, major, languages, coursesEnrolled, bio, gradYear } = userData;

  if (!username || !password || !email || !fullName || !major || !languages || !Array.isArray(languages) || languages.length === 0 || !coursesEnrolled || !Array.isArray(coursesEnrolled) || coursesEnrolled.length === 0 || !bio || !gradYear) {
    throw new Error('Invalid user data');
  }

  const userCollection = await users();
  const newUser = {
    username,
    password,
    email,
    fullName,
    major,
    languages,
    coursesEnrolled,
    bio,
    gradYear,
    reviews: []
  };

  const insertInfo = await userCollection.insertOne(newUser);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error('Could not add user');
  }

  const userId = insertInfo.insertedId.toString();
  const createdUser = await getUserById(userId);
  return createdUser;
};

// Function to update user details
export const updateUser = async (userId, updatedUserData) => {
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0 || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const userCollection = await users();
  const { username, password, email, fullName, major, languages, coursesEnrolled, bio, gradYear } = updatedUserData;

  const updatedUser = {
    username,
    password,
    email,
    fullName,
    major,
    languages,
    coursesEnrolled,
    bio,
    gradYear
  };

  const updateInfo = await userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: updatedUser });

  if (updateInfo.modifiedCount === 0) {
    throw new Error('Could not update user');
  }

  const updatedUserObj = await getUserById(userId);
  return updatedUserObj;
};

// Function to delete a user
export const deleteUser = async (userId) => {
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0 || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const userCollection = await users();
  const deletionInfo = await userCollection.deleteOne({ _id: new ObjectId(userId) });

  if (deletionInfo.deletedCount === 0) {
    throw new Error('Could not delete user');
  }

  return `User with ID ${userId} has been deleted`;
};
