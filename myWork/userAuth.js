import mongoose from "mongoose";
import express from "express"
import jwt from "jsonwebtoken"
let JWT_SECRET = "s3cret"
mongoose.connect("mongodb+srv://admin:Abhineet%4028@cluster0.qxzy1e7.mongodb.net/course-selling-app")

export function auth(req, res, next) {
    let token = req.headers.token;
    // now we will verify this token\

    if(!token) {
        return res.status(404).json({
            "msg": "Headers is empty, No token recieved"
        })
    }

    try {
        let decodedPayload = jwt.verify(token, JWT_SECRET);
        req.decodedPayload = decodedPayload;
        next();
    }
    catch(err) {
        return res.status(403).json({
            "msg": err.message
        })
    }
}