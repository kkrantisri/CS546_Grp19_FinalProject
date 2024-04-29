import { users } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';
import { checkId, checkString, checkStringArray, checkEmail, checkRating } from '../helper.js';
import { helpers } from "handlebars";

const userCollection = await users();
const saltRounds = 16;

// 1. Add a new user
export const addUser = async (userData) => {
  const { username, password, email, fullName, major, languages, coursesEnrolled, bio, gradYear } = userData;

  if (
    !username ||
    !password ||
    !email ||
    !fullName ||
    !major ||
    !languages ||
    !Array.isArray(languages) ||
    languages.length === 0 ||
    !coursesEnrolled ||
    !Array.isArray(coursesEnrolled) ||
    coursesEnrolled.length === 0 ||
    !bio ||
    !gradYear
  ) {
    throw new Error('Invalid user data');
  }

  // Validations
  let validatedUsername = checkString(username, 'username');
  const validatedPassword = checkString(password, 'password');
  let validatedEmail = checkString(email, 'email');
  const validatedFullName = checkString(fullName, 'fullName');
  const validatedMajor = checkString(major, 'major');
  const validatedLanguages = checkStringArray(languages, 'languages');
  const validatedCoursesEnrolled = checkStringArray(coursesEnrolled, 'coursesEnrolled');
  const validatedBio = checkString(bio, 'bio');
  if (!gradYear || typeof gradYear !== 'number' || isNaN(gradYear) || gradYear <= 0) {
    throw 'Grad year must be a positive number!';
  }

  validatedUsername = validatedUsername.toLowerCase();
  validatedEmail = validatedEmail.toLowerCase();

  // making sure there are no existing entries of this username or email in the DB
  const existingUser = await userCollection.findOne({
    $or: [
      { username: validatedUsername.toLowerCase() },
      { email: validatedEmail.toLowerCase() }
    ]
  });

  if (existingUser) {
    if (existingUser.username === validatedUsername) {
      throw 'This username is already taken';
    } else if (existingUser.email === validatedEmail) {
      throw 'This email is already taken.';
    }
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(validatedPassword, saltRounds);

  // user insertion to DB
  const newUserObj = {
    username: validatedUsername,
    password: hashedPassword,
    email: validatedEmail,
    fullName: validatedFullName,
    major: validatedMajor,
    languages: validatedLanguages,
    coursesEnrolled: validatedCoursesEnrolled,
    bio: validatedBio,
    gradYear: gradYear,
    posts: posts || [],
    reviews: reviews || []
  };

  // Insert new user into the DB
  const insertInfo = await userCollection.insertOne(newUserObj);
  if (!insertInfo.acknowledged || !insertInfo.insertedId || insertInfo.insertedCount === 0) throw 'Could not add user!';

  // Return the newly added user
  const newId = insertInfo.insertedId.toString();
  const createdUser = await getUserById(newId);

  //return insertInfo.value;
  return createdUser;
};


// 2. Get a user by their ID
export const getUserById = async (userId) => {
  let validatedUserId = checkId(userId);

  // const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(validatedUserId.trim()) });
  if (!user || user === null) throw 'User not found with that id';
  user._id = user._id.toString();

  return user;
};


// 3. Get a user by their username
export const getUserByUsername = async (username) => {
  if (!username) throw "username must be provided!";
  const user = await userCollection.findOne({ username: username });

  return user;
}


// 3. Get a user by their email
export const getUserByEmail = async (email) => {
  if (!email) throw "email must be provided!";
  const user = await userCollection.findOne({ email: email });

  return user;
}


// 5. Get all the users
export const getAllUsers = async () => {
  const allUsers = await userCollection.find({}).toArray();
  if (allUsers.length === 0) throw "No users in the collection!";

  return allUsers;
}


// 6. Update user data
export const updateUser = async (userId, updatedUserData) => {
  const validatedUserId = checkId(userId, 'userId');

  // if(!updatedUserData) {
  //   return await this.getUserById(id);
  // }

  if (!updatedUserData || typeof updatedUserData !== 'object' || Array.isArray(updatedUserData)) {
    throw new Error('Invalid or missing updated user data.');
  }

  if (typeof userId === 'string') {
    userId = ObjectId.createFromHexString(validatedUserId);
  }

  let updatedUserData = {};

  const currentUser = await this.getUserById(validatedUserId);

  // return if no updates are provided
  if (Object.keys(updatedUserData).length === 0) {
    return currentUser;
  }

  if (updatedUserData.firstName) {
    updatedData.firstName = checkString(updatedUserData.firstName, 'First Name');
  }

  if (updatedUserData.lastName) {
    updatedData.lastName = checkString(updatedUserData.lastName, 'Last Name');
  }

  if (updatedUserData.email) {
    updatedData.email = checkEmail(updatedUserData.email);
  }

  if (updatedUserData.passwordHash) {
    updatedData.passwordHash = updatedUserData.passwordHash;
  }

  if (updatedUserData.city) {
    updatedData.city = checkString(updatedUserData.city, 'City');
  }

  if (updatedUserData.state) {
    updatedData.state = checkString(updatedUserData.state, 'State');
  }

  if (updatedUserData.age) {
    const age = Number(updatedUserData.age);
    if (isNaN(age) || age < 0 || age > 100) {
      throw new Error('Invalid age. Age must be a non-negative number and less than 100');
    }
    updatedData.age = age;
  }

  // if no valid updates were provided
  if (Object.keys(updatedData).length === 0) {
    return await this.getUser(validatedId);
  }

  const updatedInfo = await userCollection.findOneAndUpdate({ _id: ObjectId(validatedUserId) }, { $set: updatedData }, { returnDocument: 'after' });

  if (updatedInfo.modifiedCount === 0) {
    throw new Error('Could not update user!');
  }

  //return updatedInfo.value;
  return await this.getUserById(validatedUserId);
};

export const getCoursesbyUserName = async (username) =>{
  username = checkString(username,'username')
  const userCheck = await userCollection.findOne({username:username});
  if(userCheck===null){
    throw 'No user found with that username'
  }
  const coursesObj = await userCollection.findOne({username:username},{_id:0,coursesEnrolled:1});
  return coursesObj.coursesEnrolled;

}

/////////////////////////////////////////////////////////////////////////////////////////
// OPTIONAL

// // 7. attaching post to user 
// export const addPostToUser = (userId, postId) => {
//   userId = checkId(userId, 'userId');

//   const updateInfo = await userCollection.updateOne(
//     { _id: ObjectId(userId) },
//     { $addToSet: { posts: postId } }
//   );

//   if (updateInfo.matchedCount === 0 || updateInfo.modifiedCount === 0) {
//     throw new Error('Failed to update user!');
//   }

//   return await this.getUserById(userId);
// }


// // 8. removing post from user
// export const removePostFromuser = (userId, postId) => {
//   userId = checkId(userId, 'userId');

//   const userCollection = await users();
//   const updateInfo = await userCollection.updateOne(
//     { _id: ObjectId(userId) },
//     { $pull: { posts: postId } }
//   );

//   if (updateInfo.matchedCount === 0 || updateInfo.modifiedCount === 0) {
//     throw new Error('Failed to update user!');
//   }

//   return await this.getUserById(userId);
// }
/////////////////////////////////////////////////////////////////////////////////////////




// REVIEWS data functions

// 1. Add review to User
export const addReviewToUser = async (userId, reviewerId, reviewText, rating) => {
  if (!userId || !reviewerId || !reviewText || typeof rating !== 'number') {
    throw new Error('Invalid input parameters for adding a review.');
  }

  const newReview = {
    _id: new ObjectId(),
    reviewerId: ObjectId(reviewerId),
    review: reviewText,
    rating: rating
  };

  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $push: { reviews: newReview } }
  );

  if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
    throw new Error('Failed to add review to user!');
  }

  return newReview;
};


// 2. Get reviews
export const getReviewsForUser = async (userId) => {
  if (!userId) {
    throw new Error('User ID must be provided to fetch reviews!');
  }

  userId = checkId(userId);

  const user = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!user) {
    throw new Error('User not found!');
  }

  return user.reviews;
};


// 3. Update review
export const updateReviewForUser = async (userId, reviewId, updatedReview) => {
  const validatedUserId = checkId(userId, 'userId');
  const validatedReviewId = checkId(reviewId, 'reviewId');

  if (!updatedReview || typeof updatedReview !== 'object') {
    throw new Error('Invalid or missing updated review data!');
  }

  const { reviewerId, review, rating } = updatedReview;
  const validatedReviewerId = checkId(reviewerId, 'reviewerId');
  const validatedReview = checkString(review, 'review');
  const validatedRating = checkRating(rating);

  // targeting the specific review within the user document
  const updateId = {
    _id: ObjectId(validatedUserId),
    'reviews._id': ObjectId(validatedReviewId)
  };

  const newReview = {
    _id: ObjectId(validatedReviewId),
    reviewerId: ObjectId(validatedReviewerId),
    review: validatedReview,
    rating: validatedRating
  };

  //updating review
  const updateInfo = await userCollection.updateOne(updateId, { $set: { 'reviews.$': newReview } });

  if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
    throw new Error('Failed to update review.');
  }

  return updateInfo;
};


// 4. Delete review for user
export const deleteReviewForUser = async (userId, reviewId) => {
  if (!userId || !reviewId) {
    throw new Error('User ID and Review ID must be provided to delete a review!');
  }

  const validatedUserId = checkId(userId, 'userId');
  const validatedReviewId = checkId(reviewId, 'reviewId');

  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(validatedUserId) },
    { $pull: { reviews: { _id: ObjectId(validatedReviewId) } } }
  );

  if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
    throw new Error('Failed to delete review!');
  }

  return { success: true };
};