import express from "express";
import jwt from "jsonwebtoken";
import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcrypt";
import { z } from "zod";
import { UserModel, CourseModel, InstructorModel, EnrollmentModel } from "./db.js"
import { auth } from "./userAuth.js"
let JWT_SECRET = "s3cret";
mongoose.connect("mongodb+srv://admin:Abhineet%4028@cluster0.qxzy1e7.mongodb.net/course-selling-app")
let app = express();
app.use(express.json());

app.post("/user-signup", async (req, res) => {
    // first setting up the schema for the body 
    let requiredBody = z.object({
        username: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(100),
        name: z.string().min(3).max(100)
    })
    let parsedWithSuccess = requiredBody.safeParse(req.body);
    if(!parsedWithSuccess) {
        return res.status(409).json({
            "msg": "Incorrect format of credentials"
        })
    }
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    // now we will store the user info into the DB
    let hash = await bcrypt.hash(password, 5);
    try {
        await UserModel.create({
            "username": username,
            "password": hash,
            "name": name
        })
        return res.json({
            "msg": "User is signed in"
        })
    }
    catch(err) {
        return res.status(409).json({
            "msg": err.message
        })
    }
})

app.post("/user-signin", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    // now finding whether the email is registered or not
    let user = await UserModel.findOne({
        "username": username
    })

    if(!user) {
        return res.status(402).json({
            "msg": "Email is not registered yet"
        })
    }

    let result = await bcrypt.compare(password, user.password);
    if(!result) {
        return res.status(404).json({
            "msg": "Wrong credentials"
        })
    }

    // correct credentials so generating the token
    let token = jwt.sign({
        "id": user._id.toString()
    }, JWT_SECRET);

    res.json({
        token
    })
})

app.post("/user-purchase", auth, async (req, res) => {
    let decodedPayload = req.decodedPayload;
    let userId = decodedPayload.id;

    // providing the id of the course which the user wants to buy (by clicking in the product catalogue)
    // and we need to search the state for finding the course name and will add the c_id and the u_id into the enrolllment collection
    let courseId = req.body.courseId;
    let objectUserId, objectCourseId; // converting the userid and courseId
    try {
        objectCourseId = new mongoose.Types.ObjectId(courseId);
        objectUserId = new mongoose.Types.ObjectId(userId);
    }
    catch(err) {
        return res.status(404).json({
            "msg": "Invalid format for the ID"
        })
    }
    // finding the course into the courses collection
    let course = await CourseModel.findOne({
        "_id": objectCourseId
    })
    // definetly the course will exist since (But there can be the case that the admin had deleted the course from his side)
    // however it will never happen since the course catalog will display the updated course data
    if(!course) {
        return res.status(404).json({
            "msg": "The course is removed by the Admin" 
        })
    }
    
    // now adding the course into the enrollment and giving a response
    try {
        await EnrollmentModel.create({
            user_id: objectUserId,
            course_id: objectCourseId
        })
        return res.json({
            "msg": `The course ${course.name} is bought by ${objectUserId}`
        })
    }
    catch(err) {
        return res.status(404).json({
            "msg": "The course is already bought"
        })
    }
})

app.get("/user-course", auth, async (req, res) => {
    let userId = req.decodedPayload.id;
    // coverting the userId to objectId
    let objectUserId;
    try {
        objectUserId = new Mongoose.Types.ObjectId(userId);
    }
    catch(err) {
        re.status.json({
            "msg": "Incorrect format of ID"
        })
    }

    // now we will find in the enrollments collection about the course bought by the user signed in
    try {
        let enrollments = await EnrollmentModel.find({
            user_id: user_id
        })
    }
    catch(err) {
        res.status(404).json({
            "msg": err.message
        })
    }
    
})

app.listen(3000);