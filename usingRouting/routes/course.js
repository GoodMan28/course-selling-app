import express from "express"
export const courseRouter = express.Router();
import { CourseModel } from "../database/db.js";
/*
Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system
*/

// setting up the path for the end point /course
// we need not write the /course/purchase : the below will automatically treated as this one
courseRouter.post("/purchase", (req, res) => {
    res.json({
        "msg": "The purchase EP"
    })
})

courseRouter.get("/preview", (req, res) => {
    res.json({
        "msg": "The course preview EP"
    })
})

