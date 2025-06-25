import mongoose from "mongoose" 
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// schema of users collection
const User = new Schema({
    username: {type: String, unique: true},
    password: String,
    name: String
})

// schema of the courses collection (It has a foreign key from the instructor schema)
const Course = new Schema({
    name: {type: String, unique: true},
    instructor_id: ObjectId
})

// schema of the instructor collection(here instructor will act as the admin who designs the courses)
const Instructor = new Schema({
    username: {type: String, unique: true},
    password: String,
    name: String
})

// schema of the buying info (This will connect the course and the user schema)
const Enrollment = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true },
    course_id: { type: Schema.Types.ObjectId, required: true }
});

// Ensure that a user can't enroll in the same course more than once
Enrollment.index({ user_id: 1, course_id: 1 }, { unique: true });


// making the models for the schemas 
export let UserModel = mongoose.model("users", User);
export let CourseModel = mongoose.model("courses", Course);
export let InstructorModel = mongoose.model("instructors", Instructor);
export let EnrollmentModel = mongoose.model("enrollments", Enrollment);