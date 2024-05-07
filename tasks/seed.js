import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { addUser } from '../data/users.js';
import { createPost } from '../data/posts.js';
import { createSession, updateSessionPatch } from '../data/sessions.js';

const seedData = async () => {
  try {
    const db = await dbConnection();
    await db.dropDatabase();
    const userData = [
      {
        username: "praneeth",
        password: "Jack$Jill1124",
        email: "pnadella@stevens.edu",
        fullName: "Praneeth Nadella",
        major: "Computer Science",
        languages: ["Hindi", "Tamil", "Telugu", "English"],
        coursesEnrolled: ["CS101", "CS202", "CS303"],
        bio: "I'm a passionate programmer interested in web development and machine learning.",
        gradYear: '2024'
      },
      {
        username: "vamsiyt",
        password: "Jack$Jill1124",
        email: "vam@stevens.edu",
        fullName: "Vamsi Yelisetty",
        major: "Electrical Engineering",
        languages: ["Hindi", "English"],
        coursesEnrolled: ["EE101", "EE202", "EE303"],
        bio: "I'm an electrical engineering student with a focus on power systems.",
        gradYear: '2024'
      },
      {
        username: "kranti",
        password: "Jack$Jill1124",
        email: "kranti@stevens.edu",
        fullName: "Kranti Kancharla",
        major: "Mechanical Engineering",
        languages: ["Telugu", "Tamil", "English"],
        coursesEnrolled: ["ME101", "ME202", "ME303"],
        bio: "I'm a mechanical engineering enthusiast with a passion for robotics.",
        gradYear: '2024'
      }
    ];

    // Add users to the database
    const addedUsers = [];
    for (const user of userData) {
      const addedUser = await addUser(user);
      addedUsers.push(addedUser);
      console.log(`User added: ${user.username}`);
    }

    // Define post data
    const postData = [
      {
        title: "Introduction to JavaScript",
        content: "In this post, we'll explore the basics of JavaScript programming language.",
        userId: addedUsers[0]._id,
        tags: ["JavaScript", "Programming"],
        course: "CS101",
        username: addedUsers[0].username
      },
      {
        title: "Electrical Circuits Fundamentals",
        content: "This post covers the fundamentals of electrical circuits and Ohm's law.",
        userId: addedUsers[1]._id,
        tags: ["Electrical Engineering", "Circuits"],
        course: "EE101",
        username: addedUsers[1].username
      },
      {
        title: "Robotics in Mechanical Engineering",
        content: "Learn about the role of robotics in modern mechanical engineering.",
        userId: addedUsers[2]._id,
        tags: ["Mechanical Engineering", "Robotics"],
        course: "ME101",
        username: addedUsers[2].username
      },
      {
        title: "Web Development with Python",
        content: "Explore how to build web applications using Python and Flask framework.",
        userId: addedUsers[0]._id,
        tags: ["Python", "Web Development"],
        course: "CS202",
        username: addedUsers[0].username
      }
    ];
    for (const post of postData) {
      await createPost(post.title, post.content, post.userId, post.tags, post.course, post.username);
      console.log(`Post added: ${post.title}`);
    }
    const sessionData = [
      {
        course: "CS101",
        content: "Let's discuss JavaScript fundamentals.",
        senderName: addedUsers[0].username,
        receiverName: addedUsers[1].username,
        date: "05/15/2024",
        timeSlot: "10:00 AM - 11:00 AM"
      },
      {
        course: "EE101",
        content: "Introduction to electrical circuits.",
        senderName: addedUsers[1].username,
        receiverName: addedUsers[2].username,
        date: "05/16/2024", 
        timeSlot: "11:00 AM - 12:00 PM"
      }
    ];
    for (const session of sessionData) {
      await createSession(session.course, session.content, session.senderName, session.receiverName, session.date, session.timeSlot);
      console.log(`Session added between ${session.senderName} and ${session.receiverName}`);
    }
 
    console.log('Seed data added successfully');
    await closeConnection();
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

seedData();
