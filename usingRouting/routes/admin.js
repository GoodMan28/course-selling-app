import express, { application } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { ADMIN_JWT_SECRET } from "../config.js";
import {auth} from "../middleware/adminAuth.js"; 

// -----------------------------------------------------------------------------------------------------------------------------------------------------------
// this is importing from the middlewares and the middle ware is imoorting the secret from this
// this is will create a circular dependency. It is very hard to debug. Instead store all the password in config.js And import everything from there.
// -----------------------------------------------------------------------------------------------------------------------------------------------------------

export const adminRouter = express.Router(); // because the models are needed to insert data into these 
import { AdminModel, UserModel, CourseModel, PurchaseModel } from "../database/db.js";
import mongoose from "mongoose";

const app = express();
adminRouter.use(express.json());
adminRouter.post("/signup", async (req, res) => {
    // making a schema for the required body using zod
    let requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(100),
        firstName: z.string().min(3).max(100),
        lastName: z.string().min(3).max(100)
    })
    let parsedWithSuccess = requiredBody.safeParse(req.body);
    if(!parsedWithSuccess) {
        return res.status(404).json({
            "msg": "Incorrect format of the details"
        })
    }

    // rest is the correct format 
    let email = req.body.email;
    let password = req.body.password;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;

    // hashing the password
    let hash = await bcrypt.hash(password, 5); // using 5 saltrounds we will hash the original password
    // now we will insert all the data into the DB
    try {
        await AdminModel.create({
            "email": email,
            "password": hash,
            "firstName": firstName,
            "lastName": lastName
        })
        res.json({
            "msg": "The admin is signed up"
        })
    }
    catch(err) {
        res.status(404).json({
            "msg": "The admin is already registered"
        })
    }
})

adminRouter.post("/signin", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let admin = await AdminModel.findOne({
        email: email
    })
    if(!admin) {
        return res.status(404).json({
            "msg": "Admin is not registered"
        })
    }

    // now matching the password passed with the hashed password
    let result = await bcrypt.compare(password, admin.password); // (text, hash)
    if(!result) {
        return res.status(404).json({
            "msg": "Wrong credentials"
        })
    }
    // now generating the token
    let token = jwt.sign({
        "id": admin._id.toString()
    }, ADMIN_JWT_SECRET)
    return res.json({
        "msg": "The admin is signed in",
        token
    })
})

// Now we will be writing the add course and update course EP
// we could also do it in the /course EP but we need some special authentications on the admin

// adminRouter.use(AdminMiddleware); 

adminRouter.post("/course", auth, async (req, res) => {
    // we want the creator to give us
    let { title, description, price, imageUrl, adminId } = req.body;
    // we will extract the string from the decoded Payload and convert it into the ObjectId and create a documnent into the Course collection
    let admin_Id = req.id;
    // converting the admin_Id to the object id
    let objectAdminId;
    try {
        objectAdminId = new mongoose.Types.ObjectId(admin_Id);
    }
    catch(err) {
        return res.status(404).json({
            "msg": "The ID format is wrong"
        })
    }

    // now we will add the info of the course into the course collection
    try {
        let course = await CourseModel.create({
            title: title,
            description: description,
            price: price,
            imageUrl: imageUrl,
            adminId: objectAdminId
        })
        return res.json({
            "msg": "The course is created sucessfully",
            courseId: course._id
        })
    }
    catch(err) {
        return res.status(404).json({
            "msg": err.message
        })
    }
})

adminRouter.put("/course", auth , async (req, res) => {
    let admin_Id = req.id;
    let {title, description, price, imageUrl, courseId} = req.body;
    // converting the admin_Id from string to the ObjectId
    let objectAdminId;
    try {
        objectAdminId = new mongoose.Types.ObjectId(admin_Id);
    }
    catch(err) {
        return res.status(404).json({
            "msg": "Incorrect ID format of admin_Id"
        })
    }

    // now we will be updating the course details on for the course of "courseId" and which is created by the admin "objectAdminId"
    // since the admin can only edit the course mad by him/her

    // THE updateOne takes two arguments: the filter on the basis of which we find the correct collection, and 
    // the changes
    let course = await CourseModel.updateOne({
        _id: courseId,
        adminId: objectAdminId
    }, {
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl
    })

    if(!course) {
        return res.status(404).json({
            "msg": "The creator does not own this course"
        })
    }

    return res.json({
        "msg": "The course is updated"
    })
})

adminRouter.get("/course/bulk", (req, res) => {
    res.json({
        "msg": "The course access in bulk end point"
    })
})