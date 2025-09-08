import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/user.model.js';

const MONGO_URI = process.env.MONGO_URI;

// DEFINE THE ADMIN USER'S CREDENTIALS
// It's a good practice to define these at the top.

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "StrongPassword123!";

// 4. THE MAIN SEEDING FUNCTION
const seedAdmin = async () => {
  try {
    // CONNECT TO THE DATABASE
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully.");

    // CHECK IF THE ADMIN USER ALREADY EXISTS
    // This makes our script "idempotent" - meaning you can run it multiple times
    // without creating duplicate users.
    const existingAdmin = await User.findOne({ username: ADMIN_USERNAME });

    if (existingAdmin) {
      console.log("Admin user already exists. No action taken.");
      return; // Exit the function if the admin is already there.
    }

    // 7. CREATE AND SAVE THE NEW ADMIN USER
    // If the admin user doesn't exist, we create a new one.
    console.log("Admin user not found. Creating a new one...");
    const adminUser = new User({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD, // We provide the plain-text password here.
    });

    // When we call .save(), our pre-save middleware in userModel.js will automatically
    // trigger, hashing this plain-text password before it hits the database.
    await adminUser.save();

    console.log("----------------------------------------------------");
    console.log("Admin user created successfully!");
    console.log(`Username: ${ADMIN_USERNAME}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log("You can now use these credentials to log in.");
    console.log("----------------------------------------------------");
  } catch (error) {
    // If any error occurs, we log it to the console.
    console.error("Error during admin user seeding:", error);
  } finally {
    // DISCONNECT FROM THE DATABASE
    // This is a crucial step. Whether the script succeeds or fails,
    // we must close the connection to the database to prevent hanging processes.
    console.log("Disconnecting from database...");
    await mongoose.disconnect();
    console.log("Database disconnected.");
  }
};

// EXECUTE THE SEEDING FUNCTION
seedAdmin();
