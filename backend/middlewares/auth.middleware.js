import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { promisify } from "util"; // A Node.js utility to convert callback-based functions to promise-based

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // The token is part of the header string "Bearer <token>". We split the string and take the second part.
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // jwt.verify is a callback-based function. We use 'promisify' to turn it into an async/await compatible function.
    // It will throw an error if the signature is invalid or the token has expired.

    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token does no longer exist.",
      });
    }
    // We attach the user object to the request. This makes the user's data available
    // in all subsequent middleware and in the final route handler.
    req.user = currentUser;

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(401).json({
      status: "fail",
      message: "Invalid token or session expired. Please log in again.",
    });
  }
};
