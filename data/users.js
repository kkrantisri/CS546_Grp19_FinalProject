import { users } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';
import  { checkId, checkString, checkStringArray, checkEmail, checkRating, isValidDate, isTimeSlotValid } from '../helper.js';

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
    throw 'Invalid user data';
  }
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
    reviews: []
  };
  const insertInfo = await userCollection.insertOne(newUserObj);
  if (!insertInfo.acknowledged || !insertInfo.insertedId || insertInfo.insertedCount === 0) throw 'Could not add user!';
  const newId = insertInfo.insertedId.toString();
  const createdUser = await getUserById(newId);
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
  if (!updatedUserData || typeof updatedUserData !== 'object' || Array.isArray(updatedUserData)) {
    throw new Error('Invalid or missing updated user data.');
  }

  const currentUser = await userCollection.findOne({ _id: validatedUserId });
  if (!currentUser) {
    throw new Error('User not found with the given id.');
  }

  const { username, password, email, fullName, major, languages, coursesEnrolled, bio, gradYear } = updatedUserData;
  if (updatedUserData.hasOwnProperty("username")) {
    const validatedUsername = checkString(username, 'username');
    const existingUserWithUsername = await userCollection.findOne({ username: validatedUsername.toLowerCase() });
    if (existingUserWithUsername && existingUserWithUsername._id.toString() !== validatedUserId) {
      throw 'This username is already taken.';
    }
  }
  if (updatedUserData.hasOwnProperty("email")) {
    const validatedEmail = checkString(email, 'email');
    const existingUserWithEmail = await userCollection.findOne({ email: validatedEmail.toLowerCase() });
    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== validatedUserId) {
      throw 'This email is already taken.'
    }
  }
  if (updatedUserData.hasOwnProperty("password")) {
    const isPasswordMatch = await bcrypt.compare(password, currentUser.password);
    if (isPasswordMatch) {
      throw 'Provided password matches with old password.'
    }
  }
  const fieldsToUpdate = ["fullName", "major", "languages", "coursesEnrolled", "bio", "gradYear"];
  fieldsToUpdate.forEach(field => {
    if (updatedUserData.hasOwnProperty(field) && updatedUserData[field] !== currentUser[field]) {
      if (field === 'languages' || field === 'coursesEnrolled') {
        checkStringArray(updatedUserData[field], field);
      } else {
        checkString(updatedUserData[field], field);
      }
    }
  });
  let updatedData = {};
  fieldsToUpdate.forEach(field => {
    if (updatedUserData.hasOwnProperty(field) && updatedUserData[field] !== currentUser[field]) {
      updatedData[field] = updatedUserData[field];
    }
  });
  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: validatedUserId },
    { $set: updatedData },
    { returnDocument: 'after' }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw 'Could not update user!';
  }
  return { updateUser: true };
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
export const createreviewbyuserid = async(userId , reviewId , review , rating) => {
  const validatedUserId = checkId(userId);
  const validatedReviewerId = checkId(reviewId);
  const reviewerUsername = await getUserByUsername(validatedReviewerId);
  const user = await userCollection.findOne({_id : validatedUserId});
  if(!user){
    throw 'Error : User not found'
  }
  user.review.push({
    reviewId : validatedReviewerId,
    reviewerUsername: reviewerUsername,
    review : review,
    rating : rating
  });

  await userCollection.updateOne(
    { _id: ObjectId(validatedUserId) },
    { $set: { reviews: user.reviews } }
  );
  return user;


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

export const loginUser = async (username, password) => {
  // Retrieve user data from the database based on the provided username
  const user = await users.findOne({ username });

  // If user with the provided username does not exist, return null
  if (!user) {
    return null;
  }

  // Compare the provided password with the hashed password stored in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  // If passwords match, return the user data excluding the password field
  if (passwordMatch) {
    const { _id, username, email, fullName, major, languages, coursesEnrolled, bio, gradYear, reviews } = user;
    return {
      _id,
      username,
      email,
      fullName,
      major,
      languages,
      coursesEnrolled,
      bio,
      gradYear,
      reviews
    };
  } else {
    // If passwords do not match, return null
    return null;
  }
};

// // 3. Update review
// export const updateReviewForUser = async (userId, reviewId, updatedReview) => {
//   const validatedUserId = checkId(userId, 'userId');
//   const validatedReviewId = checkId(reviewId, 'reviewId');

//   if (!updatedReview || typeof updatedReview !== 'object') {
//     throw new Error('Invalid or missing updated review data!');
//   }

//   const { reviewerId, review, rating } = updatedReview;
//   const validatedReviewerId = checkId(reviewerId, 'reviewerId');
//   const validatedReview = checkString(review, 'review');
//   const validatedRating = checkRating(rating);

//   // targeting the specific review within the user document
//   const updateId = {
//     _id: ObjectId(validatedUserId),
//     'reviews._id': ObjectId(validatedReviewId)
//   };

//   const newReview = {
//     _id: ObjectId(validatedReviewId),
//     reviewerId: ObjectId(validatedReviewerId),
//     review: validatedReview,
//     rating: validatedRating
//   };

//   //updating review
//   const updateInfo = await userCollection.updateOne(updateId, { $set: { 'reviews.$': newReview } });

//   if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
//     throw new Error('Failed to update review.');
//   }

//   return updateInfo;
// };


// // 4. Delete review for user
// export const deleteReviewForUser = async (userId, reviewId) => {
//   if (!userId || !reviewId) {
//     throw new Error('User ID and Review ID must be provided to delete a review!');
//   }

//   const validatedUserId = checkId(userId, 'userId');
//   const validatedReviewId = checkId(reviewId, 'reviewId');

//   const updateInfo = await userCollection.updateOne(
//     { _id: ObjectId(validatedUserId) },
//     { $pull: { reviews: { _id: ObjectId(validatedReviewId) } } }
//   );

//   if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
//     throw new Error('Failed to delete review!');
//   }

//   return { success: true };
// };