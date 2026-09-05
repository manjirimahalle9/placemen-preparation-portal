// ==========================================
// PLACEMENT PORTAL - COMMON DAILY STREAK
// Works for:
// Aptitude, Coding, Companies, Interview,
// Materials and Mock Test
// ==========================================

(function () {

    // Get today's date
    const today = new Date().toDateString();

    // Get yesterday's date
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toDateString();


    // ==========================================
    // GET SAVED STREAK DATA
    // ==========================================

    let streakData = JSON.parse(
        localStorage.getItem("placementStreak")
    ) || {
        streak: 0,
        lastCompleted: "",
        activities: {}
    };


    // ==========================================
    // SAVE DATA
    // ==========================================

    function saveStreakData() {

        localStorage.setItem(
            "placementStreak",
            JSON.stringify(streakData)
        );

    }


    // ==========================================
    // COMPLETE ACTIVITY
    // ==========================================

    window.completeDailyActivity = function (activity) {

        // Already completed today
        if (streakData.activities[activity] === today) {

            updateStreakDisplay();

            return;

        }


        // ==========================================
        // FIRST ACTIVITY OF THE DAY
        // ==========================================

        if (streakData.lastCompleted === today) {

            // Same day:
            // Don't increase streak again

        }


        // ==========================================
        // CONTINUE STREAK
        // ==========================================

        else if (streakData.lastCompleted === yesterday) {

            streakData.streak++;

        }


        // ==========================================
        // FIRST DAY OR BROKEN STREAK
        // ==========================================

        else {

            streakData.streak = 1;

        }


        // Save today's activity
        streakData.activities[activity] = today;

        // Save last completed date
        streakData.lastCompleted = today;


        // Save to localStorage
        saveStreakData();


        // Update dashboard/page
        updateStreakDisplay();

    };


    // ==========================================
    // DISPLAY STREAK
    // ==========================================

    function updateStreakDisplay() {

        const streakElements =
            document.querySelectorAll(".streak-number");

        streakElements.forEach(function (element) {

            element.innerText =
                streakData.streak;

        });


        const dashboardStreak =
            document.getElementById("dashboardStreak");

        if (dashboardStreak) {

            dashboardStreak.innerText =
                streakData.streak;

        }

    }


    // ==========================================
    // DISPLAY WHEN PAGE LOADS
    // ==========================================

    updateStreakDisplay();


})();
// ==========================================
// COMMON DAILY STREAK SYSTEM
// ==========================================

function completeDailyActivity(activity) {

    const today = new Date().toDateString();

    let streakData =
        JSON.parse(
            localStorage.getItem("placementStreak")
        ) || {

            streak: 0,

            lastCompleted: "",

            activities: {}

        };


    // ==========================================
    // ALREADY COMPLETED TODAY
    // ==========================================

    if (
        streakData.lastCompleted === today
    ) {

        streakData.activities[activity] = today;

        localStorage.setItem(
            "placementStreak",
            JSON.stringify(streakData)
        );

        return;

    }


    // ==========================================
    // CALCULATE STREAK
    // ==========================================

    if (streakData.lastCompleted === "") {

        // First activity
        streakData.streak = 1;

    } else {

        const lastDate =
            new Date(
                streakData.lastCompleted
            );

        const currentDate =
            new Date();


        // Remove time
        lastDate.setHours(0, 0, 0, 0);

        currentDate.setHours(0, 0, 0, 0);


        const difference =
            currentDate - lastDate;


        const oneDay =
            24 * 60 * 60 * 1000;


        if (
            difference === oneDay
        ) {

            // Consecutive day
            streakData.streak++;

        } else {

            // Missed one or more days
            streakData.streak = 1;

        }

    }


    // ==========================================
    // SAVE DATA
    // ==========================================

    streakData.lastCompleted = today;

    streakData.activities[activity] = today;


    localStorage.setItem(
        "placementStreak",
        JSON.stringify(streakData)
    );


    // Update display
    updateStreakDisplay();

}



// ==========================================
// DISPLAY STREAK
// ==========================================

function updateStreakDisplay() {

    const streakData =
        JSON.parse(
            localStorage.getItem(
                "placementStreak"
            )
        ) || {

            streak: 0

        };


    const elements =
        document.querySelectorAll(
            ".streakNumber"
        );


    elements.forEach(
        function(element) {

            element.innerText =
                streakData.streak;

        }
    );

}



// ==========================================
// LOAD STREAK WHEN PAGE OPENS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateStreakDisplay();

    }
);
Z

