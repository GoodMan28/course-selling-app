import express from "express";
import { appendFile } from "fs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { z } from "zod";
let JWT_SECRET = "s3cret";
mongoose.connect("mongodb+srv://admin:Abhineet%4028@cluster0.qxzy1e7.mongodb.net/course-selling-app")
let app = express();
app.use(express.json());

app.post("/user-signup", async (req, res) => {
    // first setting up the schema for the body 
    let requiredBody = z.object({
        username: z.string().min(3).max(100).email(),
        password: app.string().min(3).max(100),
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
    // first we will find the username in the DB 
    let user = UserModel.findOne({
        username: username
    })
    if(!user) {
        return res.status(409).json({
            "msg": "The username is not registered"
        })
    }
    let 
    let match = await bcrypt.compare(password, password)
})

app.post("/user-purchase", (req, res) => {

})

app.get("/user-course", (req, res) => {

})