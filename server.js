 // =====================================================
// PLACEMENTX - MAIN SERVER
// =====================================================

// ================= IMPORTS =================

const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);



const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;


require("dotenv").config();

const Student = require("./models/Student");


// =====================================================
// APP
// =====================================================
const PORT = process.env.PORT || 3000;
const express = require("express");
const multer = require("multer");
const app = express();
const upload = multer({
    dest: "uploads/"
});


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());


// =====================================================
// STATIC FILES
// =====================================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// Uploaded resumes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// =====================================================
// EJS
// =====================================================

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);


// =====================================================
// SESSION
// =====================================================
app.use(
    session({
        secret: process.env.SESSION_SECRET || "placementx-secret-key",

        resave: false,

        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),

        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);



// =====================================================
// MONGODB
// =====================================================

const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Database connection error:", err);
  }
}

main();




// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

function requireLogin(req, res, next) {

    if (!req.session.user) {

        return res.redirect("/");

    }

    next();

}


// =====================================================
// HOME / LOGIN
// =====================================================

// IMPORTANT:
// Both "/" and "/login" open the login page.

app.get("/", (req, res) => {

    if (req.session.user) {

        return res.redirect("/dashboard");

    }

    res.render("login");

});


app.get("/login", (req, res) => {

    if (req.session.user) {

        return res.redirect("/dashboard");

    }

    res.render("login");

});


// =====================================================
// REGISTER PAGE
// =====================================================

app.get("/register", (req, res) => {

    res.render("register");

});


// =====================================================
// REGISTER STUDENT
// =====================================================

app.post("/register", upload.single("resume"), async (req, res) => {
    try {

        const {
            name,
            email,
            password
        } = req.body;


        // Check if email already exists

        const existingStudent =
            await Student.findOne({
                email: email
            });


        if (existingStudent) {

            return res.send(`

                <script>

                    alert("Email already registered.");

                    window.location.href = "/";

                </script>

            `);

        }


        // Create student

        const studentData = {
            ...req.body,
            resume: req.file ? req.file.path.replaceAll("\\", "/") : ""
        };

        delete studentData.confirmPassword;

        const student = new Student(studentData);

        await student.save();


        console.log(
            "✅ Student Registered:",
            student.email
        );


        res.send(`

            <script>

                alert("Registration successful! Please login.");

                window.location.href = "/";

            </script>

        `);

    }

    catch (err) {

        console.log(
            "❌ Registration Error:",
            err
        );

        res.status(500).send(
            "Registration Error: " +
            err.message
        );

    }

});


// =====================================================
// LOGIN
// =====================================================

app.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        console.log(
            "🔐 Login Attempt:",
            email
        );


        // Find student

        const student =
            await Student.findOne({
                email: email
            });


        // User not found

        if (!student) {

            return res.send(`

                <script>

                    alert("User not found. Please register first.");

                    window.location.href = "/";

                </script>

            `);

        }


        // Password check

        if (student.password !== password) {

            return res.send(`

                <script>

                    alert("Invalid password.");

                    window.location.href = "/";

                </script>

            `);

        }


        // =================================================
        // CREATE SESSION
        // =================================================

        req.session.user = {

            id: student._id,

            name: student.name,

            email: student.email

        };


        console.log(
            "✅ Login Successful:",
            student.email
        );


        // Save session before redirect

        req.session.save((err) => {

            if (err) {

                console.log(
                    "❌ Session Save Error:",
                    err
                );

                return res.status(500).send(
                    "Unable to create login session."
                );

            }


            res.redirect("/dashboard");

        });

    }

    catch (err) {

        console.log(
            "❌ Login Error:",
            err
        );

        res.status(500).send(
            "Something went wrong: " +
            err.message
        );

    }

});


// =====================================================
// LOGOUT
// =====================================================

app.get("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            console.log(
                "❌ Logout Error:",
                err
            );

            return res.redirect("/dashboard");

        }


        res.clearCookie("connect.sid");

        res.redirect("/");

    });

});


// =====================================================
// DASHBOARD
// =====================================================

app.get(
    "/dashboard",
    requireLogin,
    (req, res) => {

        res.render(
            "dashboard",
            {
                user: req.session.user
            }
        );

    }
);
app.get("/notifications", requireLogin, (req, res) => {
    res.render("notifications");
});


// =====================================================
// PROFILE
// =====================================================

// THIS WAS MISSING FROM YOUR SERVER
// =====================================================
// PROFILE
// =====================================================
app.get("/profile", requireLogin, (req, res) => {
    res.render("profile", {
        user: req.session.user
    });
});



// =====================================================
// APTITUDE
// =====================================================

app.get(
    "/aptitude",
    requireLogin,
    (req, res) => {

        res.render(
            "aptitude/index",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/videos",
    requireLogin,
    (req, res) => {

        res.render(
            "videos",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/aptitude/quantitative",
    requireLogin,
    (req, res) => {

        res.render(
            "aptitude/quantitative",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/aptitude/datainterpretation",
    requireLogin,
    (req, res) => {

        res.render(
            "aptitude/datainterpretation",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/aptitude/logical",
    requireLogin,
    (req, res) => {

        res.render(
            "aptitude/logical",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/aptitude/verbal",
    requireLogin,
    (req, res) => {

        res.render(
            "aptitude/verbal",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/aptitude/percentage",
    requireLogin,
    (req, res) => {

        res.render(
            "aptitude/percentage",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/aptitude/profitloss",
    requireLogin,
    (req, res) => {

        res.render(
            "aptitude/profitloss",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/aptitude/timework",
    requireLogin,
    (req, res) => {

        res.render(
            "aptitude/timework",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/aptitude/timespeeddistance",
    requireLogin,
    (req, res) => {

        res.render(
            "aptitude/timespeeddistance",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/aptitude/numbersystem",
    requireLogin,
    (req, res) => {

        res.render(
            "aptitude/numbersystem",
            {
                user: req.session.user
            }
        );

    }
);


// =====================================================
// CODING
// =====================================================

app.get(
    "/coding",
    requireLogin,
    (req, res) => {

        res.render(
            "coding/index",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/coding/c",
    requireLogin,
    (req, res) => {

        res.render(
            "coding/c",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/coding/cpp",
    requireLogin,
    (req, res) => {

        res.render(
            "coding/cpp",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/coding/java",
    requireLogin,
    (req, res) => {

        res.render(
            "coding/java",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/coding/python",
    requireLogin,
    (req, res) => {

        res.render(
            "coding/python",
            {
                user: req.session.user
            }
        );

    }
);


app.get(
    "/coding/sql",
    requireLogin,
    (req, res) => {

        res.render(
            "coding/sql",
            {
                user: req.session.user
            }
        );

    }
);


// =====================================================
// COMPANIES
// =====================================================

app.get(
    "/companies",
    requireLogin,
    (req, res) => {

        res.render(
            "companies",
            {
                user: req.session.user
            }
        );

    }
);


// =====================================================
// JOBS
// =====================================================

app.get(
    "/jobs",
    requireLogin,
    async (req, res) => {

        try {

            // YOUR HTML USES "role"
            // so we support both role and search.

            const search =
                req.query.role ||
                req.query.search ||
                "";

            const location =
                req.query.location ||
                "";


            // No database jobs for now

            const jobs = [];


            res.render(
                "jobs",
                {

                    jobs: jobs,

                    search: search,

                    searchRole: search,

                    location: location,

                    searchLocation: location,

                    query: search,

                    user: req.session.user

                }
            );

        }

        catch (error) {

            console.log(
                "❌ Jobs Error:",
                error
            );

            res.status(500).send(
                "Error loading jobs: " +
                error.message
            );

        }

    }
);


// =====================================================
// INTERVIEW
// =====================================================

app.get(
    "/interview",
    requireLogin,
    (req, res) => {

        res.render(
            "interview",
            {
                user: req.session.user
            }
        );

    }
);


// =====================================================
// LEADERBOARD
// =====================================================

app.get(
    "/leaderboard",
    requireLogin,
    (req, res) => {

        res.render(
            "leaderboard",
            {
                user: req.session.user
            }
        );

    }
);


// =====================================================
// MATERIALS
// =====================================================

app.get(
    "/materials",
    requireLogin,
    (req, res) => {

        res.render(
            "materials",
            {
                user: req.session.user
            }
        );

    }
);


// =====================================================
// RESUME
// =====================================================

app.get(
    "/resume",
    requireLogin,
    (req, res) => {

        res.render(
            "resume",
            {
                user: req.session.user
            }
        );

    }
);


app.post(
    "/resume",
    requireLogin,
    (req, res) => {

        console.log(
            "Resume Data:",
            req.body
        );


        res.send(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    Resume Created
                </title>

                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    rel="stylesheet">

            </head>

            <body class="bg-light">

                <div class="container mt-5">

                    <div class="card shadow p-5 text-center">

                        <h1 class="text-success">
                            ✅ Resume Created Successfully!
                        </h1>

                        <p class="mt-3">
                            Your resume information
                            has been submitted successfully.
                        </p>

                        <div class="mt-4">

                            <a
                                href="/resume"
                                class="btn btn-success">

                                Create Another Resume

                            </a>

                            <a
                                href="/dashboard"
                                class="btn btn-primary">

                                Back to Dashboard

                            </a>

                        </div>

                    </div>

                </div>

            </body>

            </html>

        `);

    }
);


// =====================================================
// MOCK TEST
// =====================================================

app.get(
    "/mocktest",
    requireLogin,
    (req, res) => {

        res.render(
            "mocktest",
            {
                user: req.session.user
            }
        );

    }
);


// =====================================================
// ADMIN
// =====================================================

app.get(
    "/admin",
    requireLogin,
    (req, res) => {

        res.render(
            "admin",
            {
                user: req.session.user
            }
        );

    }
);


// =====================================================
// 404
// =====================================================

app.use(
    (req, res) => {

        res.status(404).send(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    Placement - 404
                </title>

                <style>

                    body {

                        background: #050706;

                        color: white;

                        font-family: Arial;

                        text-align: center;

                        padding-top: 100px;

                    }

                    h1 {

                        color: #00c49c;

                        font-size: 45px;

                    }

                    a {

                        color: #00c49c;

                        text-decoration: none;

                        font-weight: bold;

                    }

                </style>

            </head>

            <body>

                <h1>
                    404 - Page Not Found
                </h1>

                <p>
                    The page you requested does not exist.
                </p>

                <a href="/">
                    Go to Login
                </a>

            </body>

            </html>

        `);

    }
);


// =====================================================
// SERVER
// =====================================================



