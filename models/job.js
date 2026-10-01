 const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            default: "Full Time"
        },

        salary: {
            type: String,
            default: "Competitive Salary"
        },

        experience: {
            type: String,
            default: "Fresher"
        },

        skills: {
            type: [String],
            default: []
        },

        description: {
            type: String,
            default: ""
        },

        applyLink: {
            type: String,
            default: "#"
        },

        category: {
            type: String,
            default: "IT"
        },

        postedDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);