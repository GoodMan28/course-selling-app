import express from "express"
export const userRouter = express.Router();
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { USER_JWT_SECRET } from "../config.js"; // suppose the admin also had the same Secret and luckily he also has the same ObjectId so using the token, he can access admin EP he also can use the admin and this is a vulnerability
import { UserModel } from "../database/db.js";
import { auth } from "../middleware/userAuth.js";
const app = express();
userRouter.use(express.json());
userRouter.post("/signup", async (req, res) => {
    // making a schema for the required body using zod
    let requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.min(3).max(100),
        firstName: z.string().min(3).max(100),
        lastName: z.string().min(3).max(100)
    })

    let parsedWithSuccess = requiredBody.safeParse(req.body);
    if(!parsedWithSuccess) {
        return res.status(404).json({
            "msg": "The input format is wrong"
        })
    }

    // the input format is correct
    let { email, password, firstName, lastName } = req.body;


    // hashing the password
    let hash = await bcrypt.hash(password, 5); // using 5 saltrounds we will hash the original password
    // now we will insert all the data into the DB
    try {
        await UserModel.create({
            "email": email,
            "password": hash,
            "firstName": firstName,
            "lastName": lastName
        })
        res.json({
            "msg": "The user is signed up"
        })
    }
    catch(err) {
        res.status(404).json({
            "msg": "The user is already registered"
        })
    }
})

userRouter.post("/signin", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let admin = await UserModel.findOne({
        email: email
    })
    if(!admin) {
        return res.status(404).json({
            "msg": "User is not registered"
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
    }, USER_JWT_SECRET)
    return res.json({
        "msg": "The user is signed in",
        token
    })
})