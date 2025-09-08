import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/connectDB.js";
import postRouter from "./routes/post.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT;

const whitelist = process.env.FRONTEND_URL;

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
