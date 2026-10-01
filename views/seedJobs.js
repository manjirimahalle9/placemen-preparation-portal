const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Job = require("./models/Job");

const jobs = [

    // ================= DATA ANALYST =================

    {
        title: "Data Analyst",
        company: "TCS",
        location: "Pune",
        type: "Full Time",
        salary: "₹4 - ₹7 LPA",
        skills: ["Python", "SQL", "Excel", "Power BI"],
        experience: "Fresher",
        category: "Data Analytics"
    },

    {
        title: "Junior Data Analyst",
        company: "Infosys",
        location: "Bangalore",
        type: "Full Time",
        salary: "₹4 - ₹6 LPA",
        skills: ["SQL", "Python", "Excel", "Power BI"],
        experience: "0-1 Years",
        category: "Data Analytics"
    },

    {
        title: "Data Analyst Intern",
        company: "Deloitte",
        location: "Mumbai",
        type: "Internship",
        salary: "₹25K / Month",
        skills: ["Python", "Pandas", "SQL", "Excel"],
        experience: "Fresher",
        category: "Data Analytics"
    },

    {
        title: "Business Data Analyst",
        company: "Accenture",
        location: "Hyderabad",
        type: "Full Time",
        salary: "₹5 - ₹8 LPA",
        skills: ["SQL", "Power BI", "Excel", "Python"],
        experience: "Fresher",
        category: "Data Analytics"
    },


    // ================= SOFTWARE DEVELOPMENT =================

    {
        title: "Software Developer",
        company: "Infosys",
        location: "Bangalore",
        type: "Full Time",
        salary: "₹5 - ₹9 LPA",
        skills: ["Java", "DSA", "SQL", "OOP"],
        experience: "Fresher",
        category: "Software Development"
    },

    {
        title: "Graduate Software Engineer",
        company: "TCS",
        location: "Mumbai",
        type: "Full Time",
        salary: "₹4 - ₹7 LPA",
        skills: ["Java", "Python", "DSA", "SQL"],
        experience: "Fresher",
        category: "Software Development"
    },

    {
        title: "Software Engineer",
        company: "Wipro",
        location: "Pune",
        type: "Full Time",
        salary: "₹4.5 - ₹8 LPA",
        skills: ["Java", "C++", "SQL", "DSA"],
        experience: "Fresher",
        category: "Software Development"
    },

    {
        title: "Associate Software Engineer",
        company: "Accenture",
        location: "Hyderabad",
        type: "Full Time",
        salary: "₹4.5 - ₹8 LPA",
        skills: ["Java", "Python", "SQL", "Problem Solving"],
        experience: "Fresher",
        category: "Software Development"
    },


    // ================= DATA SCIENCE =================

    {
        title: "Data Science Intern",
        company: "Deloitte",
        location: "Mumbai",
        type: "Internship",
        salary: "₹25K / Month",
        skills: ["Python", "Machine Learning", "Pandas", "NumPy"],
        experience: "Fresher",
        category: "Data Science"
    },

    {
        title: "Junior Data Scientist",
        company: "IBM",
        location: "Bangalore",
        type: "Full Time",
        salary: "₹6 - ₹10 LPA",
        skills: ["Python", "Machine Learning", "SQL", "Pandas"],
        experience: "0-1 Years",
        category: "Data Science"
    },

    {
        title: "Machine Learning Intern",
        company: "Microsoft",
        location: "Hyderabad",
        type: "Internship",
        salary: "₹35K / Month",
        skills: ["Python", "Machine Learning", "TensorFlow"],
        experience: "Fresher",
        category: "Data Science"
    },


    // ================= WEB DEVELOPMENT =================

    {
        title: "Frontend Developer",
        company: "HCLTech",
        location: "Noida",
        type: "Full Time",
        salary: "₹4 - ₹7 LPA",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        experience: "Fresher",
        category: "Web Development"
    },

    {
        title: "Backend Developer",
        company: "Tech Mahindra",
        location: "Pune",
        type: "Full Time",
        salary: "₹4 - ₹8 LPA",
        skills: ["Node.js", "Express", "MongoDB", "JavaScript"],
        experience: "Fresher",
        category: "Web Development"
    },

    {
        title: "Full Stack Developer",
        company: "Capgemini",
        location: "Bangalore",
        type: "Full Time",
        salary: "₹5 - ₹9 LPA",
        skills: ["HTML", "CSS", "JavaScript", "Node.js", "MongoDB"],
        experience: "0-1 Years",
        category: "Web Development"
    },


    // ================= PYTHON =================

    {
        title: "Python Developer",
        company: "Cognizant",
        location: "Chennai",
        type: "Full Time",
        salary: "₹4 - ₹7 LPA",
        skills: ["Python", "Django", "SQL", "Git"],
        experience: "Fresher",
        category: "Python"
    },

    {
        title: "Python Developer Intern",
        company: "Persistent Systems",
        location: "Pune",
        type: "Internship",
        salary: "₹20K / Month",
        skills: ["Python", "Django", "SQL"],
        experience: "Fresher",
        category: "Python"
    },


    // ================= CLOUD =================

    {
        title: "Cloud Engineer",
        company: "Wipro",
        location: "Bangalore",
        type: "Full Time",
        salary: "₹5 - ₹9 LPA",
        skills: ["AWS", "Linux", "Networking", "Docker"],
        experience: "Fresher",
        category: "Cloud Computing"
    },

    {
        title: "Cloud Support Associate",
        company: "Amazon",
        location: "Hyderabad",
        type: "Full Time",
        salary: "₹5 - ₹8 LPA",
        skills: ["AWS", "Linux", "Networking"],
        experience: "Fresher",
        category: "Cloud Computing"
    },


    // ================= TESTING =================

    {
        title: "Software Testing Engineer",
        company: "Cognizant",
        location: "Pune",
        type: "Full Time",
        salary: "₹3.5 - ₹6 LPA",
        skills: ["Manual Testing", "Selenium", "SQL", "Java"],
        experience: "Fresher",
        category: "Testing"
    },


    // ================= CYBER SECURITY =================

    {
        title: "Cyber Security Analyst",
        company: "IBM",
        location: "Bangalore",
        type: "Full Time",
        salary: "₹5 - ₹9 LPA",
        skills: ["Cyber Security", "Networking", "Linux", "SIEM"],
        experience: "Fresher",
        category: "Cyber Security"
    },


    // ================= AI / ML =================

    {
        title: "AI Engineer Intern",
        company: "Microsoft",
        location: "Bangalore",
        type: "Internship",
        salary: "₹40K / Month",
        skills: ["Python", "AI", "Machine Learning", "Deep Learning"],
        experience: "Fresher",
        category: "Artificial Intelligence"
    },


    // ================= FRESHER =================

    {
        title: "Graduate Engineer Trainee",
        company: "Accenture",
        location: "Hyderabad",
        type: "Full Time",
        salary: "₹4.5 - ₹8 LPA",
        skills: ["C++", "Problem Solving", "SQL", "Communication"],
        experience: "Fresher",
        category: "Graduate Jobs"
    },

    {
        title: "Graduate Engineer Trainee",
        company: "L&T Technology Services",
        location: "Pune",
        type: "Full Time",
        salary: "₹4 - ₹7 LPA",
        skills: ["C++", "Java", "Python", "Problem Solving"],
        experience: "Fresher",
        category: "Graduate Jobs"
    }

];


// ================= DATABASE =================

async function seedJobs() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        await Job.deleteMany({});

        await Job.insertMany(jobs);

        console.log(
            `${jobs.length} jobs inserted successfully`
        );

        process.exit();

    } catch (error) {

        console.error(error);

        process.exit(1);

    }

}

seedJobs();