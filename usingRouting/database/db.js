import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;
console.log("connected to ");
// making the schemas
// 1. User
const User = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

// 2. Admin
const Admin = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

// 3. Course
const Course = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    adminId: ObjectId
})

// 4. Purchase
const Purchase = new Schema({
    userId: ObjectId,
    courseId: ObjectId
})

// Now making the models
export const UserModel = mongoose.model("users", User);
export const AdminModel = mongoose.model("admins", Admin);
export const CourseModel = mongoose.model("courses", Course);
export const PurchaseModel = mongoose.model("purchases", Purchase);