import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import 'dotenv/config'

import { userRouter } from "./routes/user.js";
import { courseRouter } from "./routes/course.js";
import { adminRouter } from "./routes/admin.js";
import { UserModel, AdminModel, CourseModel, PurchaseModel } from "./database/db.js";
const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);
// This means that any request starting with /user will be handled by userRouter,
// and any request starting with /course will be handled by courseRouter.
// userRouter and courseRouter are instances of express.Router() with their respective route handlers.

// Now we will be connecting to the DB and upon successfull connection we will listen on the port
async function main() {
  try {
    await mongoose.connect(
      process.env.MONGO_URL
    );
    app.listen(3000);
    console.log("Listening on port 3000");
  } catch (err) {
    console.log(err.message);
  }
}
main(); // calling the main function

/*
MIDDLEWARE to check that the DB is live. Can be used as a middleware in most of the DB operations
function dbHealthCheck(req, res, next) {
  const dbState = mongoose.connection.readyState; // 1 = connected
  if (dbState !== 1) {
    return res.status(503).json({ msg: "Database not connected" });
  }
  next();
}
*/

// try cookie and session based authentication
