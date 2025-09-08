import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// This function will run automatically before a document is saved ('save').
// We use a traditional function() declaration here because we need access to the 'this' keyword,
// which refers to the user document that is about to be saved. Arrow functions handle 'this' differently.

userSchema.pre("save", async function (next) {
  // Check if the password field has been modified.
  // This is a crucial optimization. We only want to re-hash the password if it's new
  // or has been changed. If a user updates their username, we don't want to
  // hash the already-hashed password again.

  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);

    const hashedPassword = await bcrypt.hash(this.password, salt);

    // The 'this.password' refers to the plain-text password on the document being saved.
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Define a custom method on the userSchema.
// We attach a function named 'comparePassword' to the 'methods' object of our schema.
// Any document created from this schema will have this method available.

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // bcrypt.compare will automatically extract the salt from 'this.password',
    // hash the 'candidatePassword' with that salt, and then securely compare the two hashes.
    // It returns a promise that resolves to true if they match, and false otherwise.
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", userSchema);

export default User;
