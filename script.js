
// ==========================================
// STUDYSYNC - STUDENT STUDY PLANNER
// COMPLETE JAVASCRIPT
// ==========================================


// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getElement(id) {
    return document.getElementById(id);
}

function getSavedData(key, fallback) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch (error) {
        console.error("Storage error:", error);
        return fallback;
    }
}


// ==========================================
// LOGIN
// ==========================================

function login() {
    const name = getElement("studentName")?.value.trim();
    const email = getElement("studentEmail")?.value.trim();
    const password = getElement("studentPassword")?.value;

    if (!name || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    const registeredStudent =
        getSavedData("registeredStudent", null);

    if (registeredStudent) {
        if (registeredStudent.email !== email) {
            alert("Email is not registered. Please Sign Up first.");
            return;
        }

        if (registeredStudent.password !== password) {
            alert("Incorrect password.");
            return;
        }

        openWebsite(registeredStudent.name);
        return;
    }

    // Demo login when no account is registered
    localStorage.setItem("studentName", name);
    localStorage.setItem("studentEmail", email);

    openWebsite(name);
}


// ==========================================
// OPEN WEBSITE
// ==========================================

function openWebsite(name) {
    const loginPage = getElement("loginPage");
    const website = getElement("website");

    loginPage?.classList.add("hidden");

    getElement("signupPage")?.classList.add("hidden");
    getElement("forgotPage")?.classList.add("hidden");
    getElement("otpPage")?.classList.add("hidden");
    getElement("resetPage")?.classList.add("hidden");

    website?.classList.remove("hidden");

    if (getElement("welcomeName")) {
        getElement("welcomeName").innerText =
            name.split(" ")[0];
    }

    if (getElement("profileName")) {
        getElement("profileName").innerText = name;
    }

    if (getElement("topName")) {
        getElement("topName").innerText = name;
    }

    const avatar = document.querySelector(".avatar");

    if (avatar) {
        avatar.innerText = name.charAt(0).toUpperCase();
    }

    localStorage.setItem("studentName", name);

    loadTasks();
    loadTimetable();
}


// ==========================================
// LOGOUT
// ==========================================

function logout() {
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentEmail");

    getElement("website")?.classList.add("hidden");
    getElement("loginPage")?.classList.remove("hidden");

    if (getElement("studentPassword")) {
        getElement("studentPassword").value = "";
    }
}


// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(pageName) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    const selectedPage = getElement(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active");
    } else {
        console.warn("Page not found:", pageName);
    }

    const titles = {
        dashboard: "Dashboard",
        timetable: "Timetable",
        tasks: "Tasks",
        completed: "Tasks Completed",
        advice: "Study Advice",
        accuracy: "Accuracy"
    };

    const pageTitle = getElement("pageTitle");

    if (pageTitle) {
        pageTitle.innerText =
            titles[pageName] || "Dashboard";
    }

    if (pageName === "timetable") {
        loadTimetable();
    }

    if (
        pageName === "tasks" ||
        pageName === "completed" ||
        pageName === "dashboard" ||
        pageName === "accuracy"
    ) {
        loadTasks();
    }
}


// ==========================================
// SIGN UP
// ==========================================

function showSignup() {
    getElement("loginPage")?.classList.add("hidden");
    getElement("website")?.classList.add("hidden");
    getElement("forgotPage")?.classList.add("hidden");

    getElement("signupPage")?.classList.remove("hidden");
}


function signup() {
    const name = getElement("signupName")?.value.trim();
    const email = getElement("signupEmail")?.value.trim();
    const password = getElement("signupPassword")?.value;
    const confirmPassword =
        getElement("confirmPassword")?.value;

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const existingStudent =
        getSavedData("registeredStudent", null);

    if (existingStudent && existingStudent.email === email) {
        alert("This email is already registered.");
        return;
    }

    const student = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem(
        "registeredStudent",
        JSON.stringify(student)
    );

    alert("Account created successfully!");

    showLogin();

    if (getElement("studentName")) {
        getElement("studentName").value = name;
    }

    if (getElement("studentEmail")) {
        getElement("studentEmail").value = email;
    }
}


// ==========================================
// SHOW LOGIN
// ==========================================

function showLogin() {
    getElement("signupPage")?.classList.add("hidden");
    getElement("forgotPage")?.classList.add("hidden");
    getElement("otpPage")?.classList.add("hidden");
    getElement("resetPage")?.classList.add("hidden");

    getElement("loginPage")?.classList.remove("hidden");
}


// ==========================================
// FORGOT PASSWORD
// ==========================================

let generatedOTP = "";
let resetEmail = "";


function showForgotPassword() {
    getElement("loginPage")?.classList.add("hidden");
    getElement("signupPage")?.classList.add("hidden");

    getElement("forgotPage")?.classList.remove("hidden");
}


function sendOTP() {
    const email = getElement("forgotEmail")?.value.trim();

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    const student =
        getSavedData("registeredStudent", null);

    if (!student) {
        alert("No account found. Please Sign Up first.");
        return;
    }

    if (student.email !== email) {
        alert("This email is not registered.");
        return;
    }

    generatedOTP = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    resetEmail = email;

    // Demo OTP only; this does not send a real email.
    alert("Your OTP is: " + generatedOTP);

    getElement("forgotPage")?.classList.add("hidden");
    getElement("otpPage")?.classList.remove("hidden");
}


// ==========================================
// VERIFY OTP
// ==========================================

function verifyOTP() {
    const enteredOTP =
        getElement("otpInput")?.value.trim();

    if (!enteredOTP) {
        alert("Please enter OTP.");
        return;
    }

    if (enteredOTP !== generatedOTP || !generatedOTP) {
        alert("Incorrect OTP.");
        return;
    }

    alert("OTP verified successfully!");

    getElement("otpPage")?.classList.add("hidden");
    getElement("resetPage")?.classList.remove("hidden");
}


// ==========================================
// RESET PASSWORD
// ==========================================

function resetPassword() {
    const newPassword =
        getElement("newPassword")?.value;

    const confirmPassword =
        getElement("confirmNewPassword")?.value;

    if (!newPassword || newPassword.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const student =
        getSavedData("registeredStudent", null);

    if (!student || student.email !== resetEmail) {
        alert("Account not found. Please try again.");
        return;
    }

    student.password = newPassword;

    localStorage.setItem(
        "registeredStudent",
        JSON.stringify(student)
    );

    alert("Password reset successfully!");

    generatedOTP = "";
    resetEmail = "";

    if (getElement("otpInput")) {
        getElement("otpInput").value = "";
    }

    if (getElement("newPassword")) {
        getElement("newPassword").value = "";
    }

    if (getElement("confirmNewPassword")) {
        getElement("confirmNewPassword").value = "";
    }

    showLogin();
}


// ==========================================
// TASK DATA
// ==========================================

let tasks = getSavedData("tasks", [
    {
        name: "Complete Python Assignment",
        subject: "Python",
        done: false
    },
    {
        name: "Revise Data Structures",
        subject: "DS",
        done: false
    },
    {
        name: "Prepare COA Notes",
        subject: "COA",
        done: true
    }
]);


// ==========================================
// SAFE HTML TEXT
// ==========================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function(char) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}


// ==========================================
// LOAD TASKS
// ==========================================

function loadTasks() {
    const taskList = getElement("taskList");
    const dashboardList = getElement("dashboardTaskList");
    const completedList = getElement("completedList");

    if (taskList) taskList.innerHTML = "";
    if (dashboardList) dashboardList.innerHTML = "";
    if (completedList) completedList.innerHTML = "";

    tasks.forEach(function(task, index) {
        const html = `
            <div class="task">

                <input
                    type="checkbox"
                    ${task.done ? "checked" : ""}
                    onchange="completeTask(${index})"
                >

                <div class="task-info">
                    <strong>${escapeHTML(task.name)}</strong>
                    <small>${escapeHTML(task.subject)}</small>
                </div>

                <button
                    onclick="deleteTask(${index})"
                    style="border:none;background:none;cursor:pointer;font-size:16px;"
                    aria-label="Delete task"
                >
                    🗑️
                </button>

            </div>
        `;

        if (taskList) {
            taskList.insertAdjacentHTML("beforeend", html);
        }

        if (!task.done && dashboardList) {
            dashboardList.insertAdjacentHTML("beforeend", html);
        }

        if (task.done && completedList) {
            completedList.insertAdjacentHTML("beforeend", html);
        }
    });

    updateStatistics();
}


// ==========================================
// COMPLETE TASK
// ==========================================

function completeTask(index) {
    if (!tasks[index]) return;

    tasks[index].done = !tasks[index].done;

    saveTasks();
    loadTasks();
}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(index) {
    if (!tasks[index]) return;

    const confirmDelete = confirm("Delete this task?");

    if (!confirmDelete) return;

    tasks.splice(index, 1);

    saveTasks();
    loadTasks();
}


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ==========================================
// ADD TASK
// ==========================================

function addTask() {
    const taskName = prompt("Enter task name:");

    if (taskName === null || taskName.trim() === "") {
        return;
    }

    const subject = prompt("Enter subject:");

    tasks.push({
        name: taskName.trim(),
        subject: subject && subject.trim()
            ? subject.trim()
            : "General",
        done: false
    });

    saveTasks();
    loadTasks();

    alert("Task added successfully!");
}

// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.done;
    }).length;

    const pending = total - completed;

    const accuracy = total === 0
        ? 0
        : Math.round((completed / total) * 100);


    // Dashboard statistics

    if (getElement("totalTask")) {
        getElement("totalTask").innerText = total;
    }

    if (getElement("pendingTask")) {
        getElement("pendingTask").innerText = pending;
    }

    if (getElement("doneTask")) {
        getElement("doneTask").innerText = completed;
    }

    if (getElement("todayTasks")) {
        getElement("todayTasks").innerText = pending;
    }

    if (getElement("completedTasks")) {
        getElement("completedTasks").innerText = completed;
    }


    // Accuracy values

    if (getElement("accuracyValue")) {
        getElement("accuracyValue").innerText =
            accuracy + "%";
    }

    if (getElement("bigAccuracy")) {
        getElement("bigAccuracy").innerText =
            accuracy + "%";
    }

    if (getElement("completionPercentage")) {
        getElement("completionPercentage").innerText =
            accuracy + "%";
    }


    // Completion text

    if (getElement("completionText")) {
        getElement("completionText").innerText =
            completed + " of " + total + " tasks completed.";
    }


    // Progress bars

    if (getElement("taskBar")) {
        getElement("taskBar").style.width =
            accuracy + "%";
    }

    if (getElement("taskBarText")) {
        getElement("taskBarText").innerText =
            accuracy + "%";
    }

    if (getElement("consistencyBar")) {
        getElement("consistencyBar").style.width =
            accuracy + "%";
    }

    if (getElement("consistencyText")) {
        getElement("consistencyText").innerText =
            accuracy + "%";
    }


    // Circular progress chart

    const circle = document.querySelector(".circle");

    if (circle) {
        circle.style.background = `
            conic-gradient(
                #8d315b ${accuracy * 3.6}deg,
                #eee ${accuracy * 3.6}deg
            )
        `;
    }

    const bigCircle = document.querySelector(".big-circle");

    if (bigCircle) {
        bigCircle.style.background = `
            conic-gradient(
                #8d315b ${accuracy * 3.6}deg,
                #eee ${accuracy * 3.6}deg
            )
        `;
    }
}


// ==========================================
// TIMETABLE DATA
// ==========================================

let timetable = getSavedData("timetable", [
    {
        time: "09:00 AM",
        subject: "Data Structures",
        room: "204",
        day: "Monday"
    },
    {
        time: "11:00 AM",
        subject: "Python",
        room: "Lab 2",
        day: "Monday"
    },
    {
        time: "02:00 PM",
        subject: "COA",
        room: "105",
        day: "Tuesday"
    }
]);


// ==========================================
// LOAD TIMETABLE
// ==========================================

function loadTimetable() {
    const timetableBody = getElement("timetableBody");

    if (!timetableBody) {
        return;
    }

    timetableBody.innerHTML = "";

    timetable.forEach(function(item, index) {
        const row = `
            <tr>

                <td>${escapeHTML(item.time)}</td>

                <td>${escapeHTML(item.subject)}</td>

                <td>${escapeHTML(item.room)}</td>

                <td>${escapeHTML(item.day)}</td>

                <td>
                    <button
                        onclick="deleteClass(${index})"
                        style="border:none;background:none;cursor:pointer;font-size:16px;"
                        aria-label="Delete class"
                    >
                        🗑️
                    </button>
                </td>

            </tr>
        `;

        timetableBody.insertAdjacentHTML("beforeend", row);
    });
}


// ==========================================
// ADD CLASS
// ==========================================

function addClass() {
    const subject = prompt("Enter subject:");

    if (!subject || subject.trim() === "") {
        return;
    }

    const time = prompt("Enter time:");

    if (!time || time.trim() === "") {
        return;
    }

    let room = prompt("Enter room:");

    if (!room || room.trim() === "") {
        room = "-";
    }

    let day = prompt("Enter day:");

    if (!day || day.trim() === "") {
        day = "Monday";
    }

    const validDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const matchedDay = validDays.find(function(validDay) {
        return validDay.toLowerCase() === day.trim().toLowerCase();
    });

    if (!matchedDay) {
        alert("Please enter a valid day of the week.");
        return;
    }

    timetable.push({
        time: time.trim(),
        subject: subject.trim(),
        room: room.trim(),
        day: matchedDay
    });

    saveTimetable();
    loadTimetable();

    alert("Class added successfully!");
}


// ==========================================
// SAVE TIMETABLE
// ==========================================

function saveTimetable() {
    localStorage.setItem(
        "timetable",
        JSON.stringify(timetable)
    );
}


// ==========================================
// DELETE CLASS
// ==========================================

function deleteClass(index) {
    if (!timetable[index]) return;

    const confirmDelete = confirm("Delete this class?");

    if (!confirmDelete) return;

    timetable.splice(index, 1);

    saveTimetable();
    loadTimetable();
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    const savedName = localStorage.getItem("studentName");

    if (savedName) {
        getElement("loginPage")?.classList.add("hidden");
        getElement("website")?.classList.remove("hidden");

        if (getElement("welcomeName")) {
            getElement("welcomeName").innerText =
                savedName.split(" ")[0];
        }

        if (getElement("profileName")) {
            getElement("profileName").innerText = savedName;
        }

        if (getElement("topName")) {
            getElement("topName").innerText = savedName;
        }

        const avatar = document.querySelector(".avatar");

        if (avatar) {
            avatar.innerText =
                savedName.charAt(0).toUpperCase();
        }
    }

    loadTasks();
    loadTimetable();

});

// ==========================================
// STUDYSYNC PREMIUM FEATURES
// ==========================================


// ==========================================
// THEME / DARK MODE
// ==========================================

function applyTheme(theme) {
    document.body.classList.toggle(
        "dark-theme",
        theme === "dark"
    );

    const button = document.getElementById("themeToggle");

    if (button) {
        button.innerText = theme === "dark" ? "☀️" : "🌙";
    }

    localStorage.setItem("studySyncTheme", theme);
}

function toggleTheme() {
    const isDark = document.body.classList.contains("dark-theme");

    applyTheme(isDark ? "light" : "dark");
}


// ==========================================
// ENHANCED PAGE NAVIGATION
// ==========================================

function showPage(pageName) {
    document.querySelectorAll(".page").forEach(function(page) {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageName);

    if (page) {
        page.classList.add("active");
    }

    const titles = {
        dashboard: "Dashboard",
        timetable: "Timetable",
        tasks: "Tasks",
        completed: "Tasks Completed",
        advice: "Study Advice",
        accuracy: "Accuracy",
        pomodoro: "Focus Timer",
        calendar: "Study Calendar",
        analytics: "Analytics",
        notes: "My Notes"
    };

    const title = document.getElementById("pageTitle");

    if (title) {
        title.innerText = titles[pageName] || "Dashboard";
    }

    if (pageName === "timetable") loadTimetable();

    if ([
        "dashboard",
        "tasks",
        "completed",
        "accuracy",
        "analytics",
        "calendar"
    ].includes(pageName)) {
        loadTasks();
    }

    if (pageName === "calendar") renderCalendar();

    if (pageName === "notes") renderNotes();

    if (pageName === "analytics") renderAnalytics();
}


// ==========================================
// TASK DATA UPGRADE
// ==========================================

// Add default priority and due date to old tasks.

tasks = tasks.map(function(task) {
    return {
        ...task,
        priority: task.priority || "Medium",
        dueDate: task.dueDate || ""
    };
});


// ==========================================
// ENHANCED ADD TASK
// ==========================================

function addTask() {
    const name = prompt("Enter task name:");

    if (!name || !name.trim()) return;

    const subject = prompt("Enter subject:") || "General";

    let priority = prompt(
        "Enter priority: High, Medium or Low",
        "Medium"
    );

    if (!priority) return;

    priority = priority.trim().toLowerCase();

    if (!["high", "medium", "low"].includes(priority)) {
        alert("Please enter High, Medium or Low.");
        return;
    }

    const dueDate = prompt(
        "Enter due date (YYYY-MM-DD), or leave blank:",
        ""
    );

    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        alert("Please enter date in YYYY-MM-DD format.");
        return;
    }

    tasks.push({
        name: name.trim(),
        subject: subject.trim(),
        priority: priority.charAt(0).toUpperCase() + priority.slice(1),
        dueDate: dueDate || "",
        done: false
    });

    saveTasks();
    loadTasks();

    alert("Priority task added successfully!");
}


// ==========================================
// ENHANCED TASK LIST
// ==========================================

function loadTasks() {
    const taskList = document.getElementById("taskList");
    const dashboardList = document.getElementById("dashboardTaskList");
    const completedList = document.getElementById("completedList");

    if (taskList) taskList.innerHTML = "";
    if (dashboardList) dashboardList.innerHTML = "";
    if (completedList) completedList.innerHTML = "";

    tasks.forEach(function(task, index) {
        const priority = task.priority || "Medium";

        const priorityClass =
            "priority-" + priority.toLowerCase();

        const dateText = task.dueDate
            ? `<span class="due-badge">Due: ${escapeHTML(task.dueDate)}</span>`
            : "";

        const html = `
            <div class="task">

                <input
                    type="checkbox"
                    ${task.done ? "checked" : ""}
                    onchange="completeTask(${index})"
                >

                <div class="task-info">
                    <strong>${escapeHTML(task.name)}</strong>

                    <small>${escapeHTML(task.subject)}</small>

                    <div class="task-meta">
                        <span class="priority-badge ${priorityClass}">
                            ${escapeHTML(priority)} Priority
                        </span>
                        ${dateText}
                    </div>
                </div>

                <button
                    onclick="deleteTask(${index})"
                    aria-label="Delete task"
                    style="border:none;background:none;cursor:pointer;font-size:16px;"
                >
                    🗑️
                </button>

            </div>
        `;

        if (taskList) {
            taskList.insertAdjacentHTML("beforeend", html);
        }

        if (!task.done && dashboardList) {
            dashboardList.insertAdjacentHTML("beforeend", html);
        }

        if (task.done && completedList) {
            completedList.insertAdjacentHTML("beforeend", html);
        }
    });

    updateStatistics();
    renderStreak();
    renderAnalytics();
}


// ==========================================
// ENHANCED COMPLETE TASK
// ==========================================

function completeTask(index) {
    if (!tasks[index]) return;

    tasks[index].done = !tasks[index].done;

    if (tasks[index].done) {
        recordStudyDay();
    }

    saveTasks();
    loadTasks();
}


// ==========================================
// STUDY STREAK
// ==========================================

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function recordStudyDay() {
    let studyDays = getSavedData("studyDays", []);

    const today = getLocalDateString(new Date());

    if (!studyDays.includes(today)) {
        studyDays.push(today);
    }

    localStorage.setItem("studyDays", JSON.stringify(studyDays));

    renderStreak();
}

function renderStreak() {
    const streakElement = document.getElementById("streakCount");

    if (!streakElement) return;

    const studyDays = getSavedData("studyDays", []);

    let streak = 0;
    const checkDate = new Date();

    // If no study activity today, an ongoing streak
    // can still continue from yesterday.
    if (!studyDays.includes(getLocalDateString(checkDate))) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (studyDays.includes(getLocalDateString(checkDate))) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }

    streakElement.innerText = streak + (streak === 1 ? " Day" : " Days");
}


// ==========================================
// ENHANCED STATISTICS
// ==========================================

function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.done).length;
    const pending = total - completed;

    const accuracy = total
        ? Math.round((completed / total) * 100)
        : 0;

    const setText = function(id, value) {
        const element = document.getElementById(id);
        if (element) element.innerText = value;
    };

    setText("totalTask", total);
    setText("pendingTask", pending);
    setText("doneTask", completed);
    setText("todayTasks", pending);
    setText("completedTasks", completed);
    setText("accuracyValue", accuracy + "%");
    setText("bigAccuracy", accuracy + "%");
    setText("completionPercentage", accuracy + "%");
    setText("taskCompletion", accuracy + "%");
    setText("completionText", completed + " of " + total + " tasks completed.");

    setText("taskBarText", accuracy + "%");
    setText("consistencyText", accuracy + "%");

    const taskBar = document.getElementById("taskBar");
    if (taskBar) taskBar.style.width = accuracy + "%";

    const consistencyBar = document.getElementById("consistencyBar");
    if (consistencyBar) consistencyBar.style.width = accuracy + "%";

    const circle = document.querySelector(".circle");
    if (circle) {
        circle.style.background =
            `conic-gradient(#8b7cff ${accuracy * 3.6}deg, #293550 ${accuracy * 3.6}deg)`;
    }

    const bigCircle = document.querySelector(".big-circle");
    if (bigCircle) {
        bigCircle.style.background =
            `conic-gradient(#8b7cff ${accuracy * 3.6}deg, #293550 ${accuracy * 3.6}deg)`;
    }

    renderAnalytics();
}

// ==========================================
// POMODORO TIMER
// ==========================================

let timerMode = "focus";
let timerSeconds = 25 * 60;
let studyTimerInterval = null;

const timerDurations = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
};

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    const display = document.getElementById("timerDisplay");

    if (display) {
        display.innerText =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");
    }

    const circle = document.querySelector(".timer-circle");

    if (circle) {
        const total = timerDurations[timerMode];
        const progress = total
            ? ((total - timerSeconds) / total) * 360
            : 0;

        circle.style.background = `
            radial-gradient(circle, var(--panel) 62%, transparent 64%),
            conic-gradient(var(--accent) ${progress}deg, #293550 ${progress}deg)
        `;
    }
}

function setTimerMode(mode) {
    if (!timerDurations[mode]) return;

    pauseTimer();

    timerMode = mode;
    timerSeconds = timerDurations[mode];

    const modeText = document.getElementById("timerMode");

    if (modeText) {
        modeText.innerText =
            mode === "focus"
                ? "FOCUS SESSION"
                : mode === "short"
                    ? "SHORT BREAK"
                    : "LONG BREAK";
    }

    const status = document.getElementById("timerStatus");

    if (status) {
        status.innerText = "Ready for your next session?";
    }

    updateTimerDisplay();
}

function startTimer() {
    if (studyTimerInterval !== null) return;

    const status = document.getElementById("timerStatus");

    if (status) {
        status.innerText = "Timer running. Stay focused!";
    }

    studyTimerInterval = setInterval(function() {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
            return;
        }

        pauseTimer();

        if (timerMode === "focus") {
            let sessions = Number(
                localStorage.getItem("focusSessions") || 0
            );

            sessions++;

            localStorage.setItem("focusSessions", sessions);

            const sessionElement =
                document.getElementById("focusSessions");

            if (sessionElement) {
                sessionElement.innerText = sessions;
            }

            if (typeof recordStudyDay === "function") {
                recordStudyDay();
            }
        }

        if (status) {
            status.innerText = "Session completed! Great work.";
        }

        alert(
            timerMode === "focus"
                ? "Focus session completed! Take a break."
                : "Break completed! Ready to focus again?"
        );
    }, 1000);
}

function pauseTimer() {
    if (studyTimerInterval !== null) {
        clearInterval(studyTimerInterval);
        studyTimerInterval = null;
    }

    const status = document.getElementById("timerStatus");

    if (status && timerSeconds > 0) {
        status.innerText = "Timer paused.";
    }
}

function resetTimer() {
    pauseTimer();

    timerSeconds = timerDurations[timerMode];

    const status = document.getElementById("timerStatus");

    if (status) {
        status.innerText = "Timer reset. Ready when you are!";
    }

    updateTimerDisplay();
}


// ==========================================
// CALENDAR
// ==========================================

let calendarViewDate = new Date();
let selectedCalendarDate = getLocalDateString(new Date());

function changeMonth(direction) {
    calendarViewDate.setMonth(
        calendarViewDate.getMonth() + direction
    );

    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    const monthTitle = document.getElementById("calendarMonth");

    if (!grid || !monthTitle) return;

    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    monthTitle.innerText =
        calendarViewDate.toLocaleString("en", {
            month: "long",
            year: "numeric"
        });

    grid.innerHTML = "";

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    weekdays.forEach(function(day) {
        const label = document.createElement("div");
        label.className = "calendar-day-label";
        label.innerText = day;
        grid.appendChild(label);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-date empty";
        grid.appendChild(empty);
    }

    const today = getLocalDateString(new Date());

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = getLocalDateString(date);

        const dueTasks = tasks.filter(function(task) {
            return task.dueDate === dateString && !task.done;
        });

        const button = document.createElement("button");

        button.type = "button";
        button.className = "calendar-date";

        if (dateString === today) {
            button.classList.add("today");
        }

        if (dateString === selectedCalendarDate) {
            button.classList.add("selected");
        }

        button.innerHTML = `
            <span>${day}</span>
            ${dueTasks.length
                ? `<small>${dueTasks.length} task(s)</small>`
                : ""}
        `;

        button.addEventListener("click", function() {
            selectedCalendarDate = dateString;
            renderCalendar();
            showSelectedDateTasks();
        });

        grid.appendChild(button);
    }

    showSelectedDateTasks();
}

function showSelectedDateTasks() {
    const container = document.getElementById("selectedDateTasks");

    if (!container) return;

    const dayTasks = tasks.filter(function(task) {
        return task.dueDate === selectedCalendarDate;
    });

    container.innerHTML = `
        <h3>Tasks for ${escapeHTML(selectedCalendarDate)}</h3>
    `;

    if (dayTasks.length === 0) {
        container.innerHTML += "<p>No tasks scheduled for this date.</p>";
        return;
    }

    dayTasks.forEach(function(task) {
        const item = document.createElement("p");

        item.innerText =
            (task.done ? "✓ " : "○ ") +
            task.name +
            " — " +
            task.subject;

        container.appendChild(item);
    });
}


// ==========================================
// NOTES MANAGER
// ==========================================

let notes = getSavedData("studyNotes", []);

function saveNotes() {
    localStorage.setItem("studyNotes", JSON.stringify(notes));
}

function addNote() {
    const title = document.getElementById("noteTitle")?.value.trim();
    const subject = document.getElementById("noteSubject")?.value;
    const content = document.getElementById("noteContent")?.value.trim();

    if (!title || !content) {
        alert("Please enter both note title and content.");
        return;
    }

    notes.push({
        title: title,
        subject: subject || "General",
        content: content,
        createdAt: new Date().toLocaleDateString()
    });

    saveNotes();

    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";

    renderNotes();

    alert("Note saved successfully!");
}

function renderNotes() {
    const list = document.getElementById("notesList");

    if (!list) return;

    list.innerHTML = "";

    if (notes.length === 0) {
        list.innerHTML = `
            <div class="box">
                <p>No notes saved yet. Create your first study note!</p>
            </div>
        `;
        return;
    }

    notes.forEach(function(note, index) {
        const card = document.createElement("div");

        card.className = "note-card";

        const title = document.createElement("h3");
        title.innerText = note.title;

        const subject = document.createElement("small");
        subject.innerText = note.subject + " • " + note.createdAt;

        const content = document.createElement("p");
        content.innerText = note.content;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.innerText = "Delete Note";

        deleteButton.addEventListener("click", function() {
            deleteNote(index);
        });

        card.append(title, subject, content, deleteButton);

        list.appendChild(card);
    });
}

function deleteNote(index) {
    if (!notes[index]) return;

    if (!confirm("Delete this note?")) return;

    notes.splice(index, 1);

    saveNotes();
    renderNotes();
}


// ==========================================
// ANALYTICS
// ==========================================

function renderAnalytics() {
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.done;
    }).length;

    const pending = total - completed;

    const completedPercent = total
        ? Math.round((completed / total) * 100)
        : 0;

    const pendingPercent = total
        ? 100 - completedPercent
        : 0;

    function setValue(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.innerText = value;
        }
    }

    function setWidth(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.style.width = value + "%";
        }
    }

    setValue("analyticsTotal", total);
    setValue("analyticsCompleted", completed);
    setValue("analyticsPending", pending);
    setValue("analyticsRate", completedPercent + "%");

    setValue("analyticsDoneText", completedPercent + "%");
    setValue("analyticsPendingText", pendingPercent + "%");

    setWidth("analyticsDoneBar", completedPercent);
    setWidth("analyticsPendingBar", pendingPercent);
}


// ==========================================
// INITIALIZE PREMIUM FEATURES
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    // Dark theme by default; remember user's selection.
    const savedTheme =
        localStorage.getItem("studySyncTheme") || "dark";

    applyTheme(savedTheme);

    // Timer
    timerSeconds = timerDurations.focus;
    updateTimerDisplay();

    const sessions = localStorage.getItem("focusSessions") || 0;

    const sessionElement =
        document.getElementById("focusSessions");

    if (sessionElement) {
        sessionElement.innerText = sessions;
    }

    // Other features
    renderStreak();
    renderCalendar();
    renderNotes();
    renderAnalytics();
    loadTasks();

});
