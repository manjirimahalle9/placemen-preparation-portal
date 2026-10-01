const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: String,
    college: String,
    degree: String,
    branch: String,
    graduationYear: String,
    cgpa: String,
    skills: String,
    mobile: String,
    age: Number,
    rollNo: String,
    resume: String
});

module.exports = mongoose.model("Student", studentSchema);