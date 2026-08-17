/* =====================================================
   APP.JS
   منصتي التعليمية
   ===================================================== */

let currentUser = null;
let currentExam = [];
let currentSubject = "";
let answers = [];


// =====================================================
// أدوات عامة
// =====================================================

function getUsers() {
    return JSON.parse(localStorage.getItem("students") || "[]");
}

function saveUsers(users) {
    localStorage.setItem("students", JSON.stringify(users));
}

function getSchedule() {
    return JSON.parse(localStorage.getItem("schoolSchedule") || "[]");
}

function saveSchedule(schedule) {
    localStorage.setItem("schoolSchedule", JSON.stringify(schedule));
}


// =====================================================
// AUTH
// =====================================================

function showAuth(type, button) {

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    const login = document.getElementById("loginForm");
    const register = document.getElementById("registerForm");

    if (login) login.classList.remove("active");
    if (register) register.classList.remove("active");

    const selected = document.getElementById(type + "Form");

    if (selected) {
        selected.classList.add("active");
    }
}


function showLoginTab() {

    const tabs = document.querySelectorAll(".tab");

    if (tabs.length > 0) {
        tabs[0].click();
    }
}


// =====================================================
// REGISTER
// =====================================================

function register() {

    const name = document.getElementById("registerName")?.value.trim();
    const email = document.getElementById("registerEmail")?.value.trim().toLowerCase();
    const password = document.getElementById("registerPassword")?.value;
    const confirm = document.getElementById("registerConfirm")?.value;

    const message = document.getElementById("registerMessage");

    if (!name || !email || !password || !confirm) {

        if (message) {
            message.className = "error";
            message.innerText = "من فضلك املأ كل البيانات";
        }

        return;
    }

    if (password.length < 6) {

        if (message) {
            message.className = "error";
            message.innerText = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
        }

        return;
    }

    if (password !== confirm) {

        if (message) {
            message.className = "error";
            message.innerText = "كلمتا المرور غير متطابقتين";
        }

        return;
    }

    let users = getUsers();

    const exists = users.some(user => user.email === email);

    if (exists) {

        if (message) {
            message.className = "error";
            message.innerText = "هذا الإيميل مسجل بالفعل";
        }

        return;
    }

    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        password: password,

        watchedLessons: [],

        grades: [],

        schedule: []

    };

    users.push(newUser);

    saveUsers(users);

    if (message) {
        message.className = "success";
        message.innerText = "تم إنشاء الحساب بنجاح 🎉";
    }

    setTimeout(() => {

        const loginEmail = document.getElementById("loginEmail");

        if (loginEmail) {
            loginEmail.value = email;
        }

        showLoginTab();

    }, 700);
}


// =====================================================
// LOGIN
// =====================================================

function login() {

    const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
    const password = document.getElementById("loginPassword")?.value;

    const message = document.getElementById("loginMessage");

    const users = getUsers();

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {

        if (message) {
            message.className = "error";
            message.innerText = "الإيميل أو كلمة المرور غير صحيحة ❌";
        }

        return;
    }

    // لو المستخدم قديم من نسخة سابقة
    if (!user.watchedLessons) {
        user.watchedLessons = [];
    }

    if (!user.grades) {
        user.grades = [];
    }

    if (!user.schedule) {
        user.schedule = [];
    }

    currentUser = user;

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

    openApp();
}


// =====================================================
// OPEN APP
// =====================================================

function openApp() {

    const authPage = document.getElementById("authPage");
    const app = document.getElementById("app");

    if (authPage) {
        authPage.style.display = "none";
    }

    if (app) {
        app.style.display = "block";
    }

    const headerName = document.getElementById("headerName");
    const welcomeName = document.getElementById("welcomeName");

    if (headerName) {
        headerName.innerText = currentUser.name;
    }

    if (welcomeName) {
        welcomeName.innerText = currentUser.name;
    }

    updateDashboard();

    renderSchedule();

    checkScheduleNotification();
}


// =====================================================
// AUTO LOGIN
// =====================================================

window.addEventListener("load", function () {

    const savedUser = localStorage.getItem("currentUser");

    if (savedUser) {

        try {

            currentUser = JSON.parse(savedUser);

            if (!currentUser.watchedLessons) {
                currentUser.watchedLessons = [];
            }

            if (!currentUser.grades) {
                currentUser.grades = [];
            }

            if (!currentUser.schedule) {
                currentUser.schedule = [];
            }

            openApp();

        } catch (error) {

            localStorage.removeItem("currentUser");

        }
    }

    // تحديث الإشعار كل دقيقة
    setInterval(checkScheduleNotification, 60000);
});


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    currentUser = null;

    localStorage.removeItem("currentUser");

    const app = document.getElementById("app");
    const authPage = document.getElementById("authPage");

    if (app) {
        app.style.display = "none";
    }

    if (authPage) {
        authPage.style.display = "flex";
    }
}


// =====================================================
// NAVIGATION
// =====================================================

function showPage(page, button) {

    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    const selectedPage = document.getElementById(page);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    if (page === "grades") {
        updateGrades();
    }

    if (page === "schedule") {
        renderSchedule();
    }

    if (page === "dashboard") {
        updateDashboard();
    }
}


// =====================================================
// DASHBOARD
// =====================================================

function updateDashboard() {

    if (!currentUser) return;

    const watched = currentUser.watchedLessons || [];
    const grades = currentUser.grades || [];

    const lessonCount = document.getElementById("lessonCount");
    const examCount = document.getElementById("examCount");
    const average = document.getElementById("average");

    if (lessonCount) {
        lessonCount.innerText = watched.length;
    }

    if (examCount) {
        examCount.innerText = grades.length;
    }

    if (grades.length === 0) {

        if (average) {
            average.innerText = "0%";
        }

        return;
    }

    let total = 0;

    grades.forEach(grade => {
        total += Number(grade.percentage) || 0;
    });

    const avg = Math.round(total / grades.length);

    if (average) {
        average.innerText = avg + "%";
    }
}


// =====================================================
// LESSONS
// =====================================================

function openLesson(subject) {

    markLessonAsWatched(subject);

    const content = document.getElementById("lessonContent");

    if (!content) return;

    content.innerHTML = `

        <h2>📚 ${subject}</h2>

        <div style="
            height:260px;
            background:#111827;
            border-radius:15px;
            margin:20px 0;
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:60px;
        ">
            ▶️
        </div>

        <h3>شرح درس ${subject}</h3>

        <p style="
            line-height:2;
            color:#475569;
            margin-top:12px;
        ">
            أهلاً بك في درس ${subject}.
            هنا يمكنك وضع شرح الدرس والفيديو والملفات
            والتدريبات الخاصة بالمادة.
        </p>

    `;

    const modal = document.getElementById("lessonModal");

    if (modal) {
        modal.classList.add("show");
    }

    updateDashboard();
}


// =====================================================
// تسجيل مشاهدة الدرس
// =====================================================

function markLessonAsWatched(subject) {

    if (!currentUser) return;

    if (!currentUser.watchedLessons) {
        currentUser.watchedLessons = [];
    }

    if (!currentUser.watchedLessons.includes(subject)) {

        currentUser.watchedLessons.push(subject);

        updateCurrentUser();
    }
}


// =====================================================
// EXAMS
// English + German فقط
// =====================================================

const exams = {

    English: [

        [
            "What is the opposite of big?",
            "Small",
            ["Tall", "Fast", "Strong"]
        ],

        [
            "What is the plural of book?",
            "Books",
            ["Book", "Booking", "Booked"]
        ],

        [
            "The sky is ___",
            "Blue",
            ["Red", "Green", "Black"]
        ],

        [
            "What is 2 + 3?",
            "Five",
            ["Three", "Four", "Six"]
        ],

        [
            "Which one is an animal?",
            "Cat",
            ["Table", "Book", "Pen"]
        ]

    ],

    German: [

        [
            "What does 'Hallo' mean?",
            "Hello",
            ["Goodbye", "Thanks", "Morning"]
        ],

        [
            "What does 'Danke' mean?",
            "Thank you",
            ["Hello", "Good night", "Please"]
        ],

        [
            "What is 'Haus'?",
            "House",
            ["School", "Book", "Car"]
        ],

        [
            "What does 'Wasser' mean?",
            "Water",
            ["Food", "Milk", "Air"]
        ],

        [
            "What does 'Guten Morgen' mean?",
            "Good morning",
            ["Good night", "Goodbye", "Thank you"]
        ]

    ]

};


// =====================================================
// START EXAM
// =====================================================

function startExam(subject) {

    if (!exams[subject]) {
        return;
    }

    currentSubject = subject;

    currentExam = exams[subject];

    answers = [];

    let html = `

        <h2>📝 ${subject} Exam</h2>

        <p style="
            color:#64748b;
            margin:15px 0;
        ">
            اختر إجابة واحدة لكل سؤال.
        </p>

    `;

    currentExam.forEach((question, index) => {

        let options = [
            question[1],
            ...question[2]
        ];

        options.sort(() => Math.random() - 0.5);

        html += `

            <div class="question">

                <h3>
                    ${index + 1}. ${question[0]}
                </h3>

        `;

        options.forEach(option => {

            const safeOption = String(option)
                .replace(/'/g, "\\'");

            html += `

                <button
                    class="option"
                    onclick="
                        selectAnswer(
                            ${index},
                            '${safeOption}',
                            this
                        )
                    "
                >
                    ${option}
                </button>

            `;

        });

        html += `

            </div>

        `;

    });

    html += `

        <button
            class="main-btn"
            onclick="finishExam()"
        >
            إنهاء الامتحان
        </button>

    `;

    const content = document.getElementById("examContent");

    if (content) {
        content.innerHTML = html;
    }

    const modal = document.getElementById("examModal");

    if (modal) {
        modal.classList.add("show");
    }
}


// =====================================================
// SELECT ANSWER
// =====================================================

function selectAnswer(index, answer, button) {

    answers[index] = answer;

    const parent = button.parentElement;

    if (parent) {

        parent.querySelectorAll(".option").forEach(btn => {
            btn.classList.remove("selected");
        });

    }

    button.classList.add("selected");
}


// =====================================================
// FINISH EXAM
// =====================================================

function finishExam() {

    if (!currentExam || currentExam.length === 0) {
        return;
    }

    let score = 0;

    currentExam.forEach((question, index) => {

        if (answers[index] === question[1]) {
            score++;
        }

    });

    const percentage = Math.round(
        (score / currentExam.length) * 100
    );

    if (!currentUser.grades) {
        currentUser.grades = [];
    }

    currentUser.grades.push({

        subject: currentSubject,

        score: score,

        total: currentExam.length,

        percentage: percentage,

        date: new Date().toLocaleDateString("ar-EG")

    });

    updateCurrentUser();

    const content = document.getElementById("examContent");

    if (content) {

        content.innerHTML = `

            <div style="
                text-align:center;
                padding:20px;
            ">

                <h2>
                    🎉 انتهى الامتحان
                </h2>

                <div class="score">
                    ${percentage}%
                </div>

                <h3>
                    ${score} من ${currentExam.length}
                    إجابات صحيحة
                </h3>

                <p style="
                    margin:20px;
                    color:#64748b;
                ">
                    ${
                        percentage >= 80
                        ? "ممتاز جداً 👏"
                        : percentage >= 50
                        ? "جيد جداً 👍"
                        : "راجع الدرس وحاول مرة أخرى 💪"
                    }
                </p>

                <button
                    class="main-btn"
                    onclick="closeModal('examModal')"
                >
                    إغلاق
                </button>

            </div>

        `;

    }

    updateDashboard();
    updateGrades();
}


// =====================================================
// GRADES
// =====================================================

function updateGrades() {

    if (!currentUser) return;

    const list = document.getElementById("gradesList");

    if (!list) return;

    const grades = currentUser.grades || [];

    if (grades.length === 0) {

        list.innerHTML = `

            <div class="card">

                <h3>
                    📊 لا توجد درجات حتى الآن
                </h3>

                <p style="margin-top:10px">
                    ابدأ أول امتحان لك وستظهر نتيجتك هنا.
                </p>

            </div>

        `;

        return;
    }

    list.innerHTML = "";

    grades.slice().reverse().forEach(grade => {

        list.innerHTML += `

            <div
                class="card"
                style="margin-bottom:15px"
            >

                <h3>
                    📝 ${grade.subject} Exam
                </h3>

                <p style="margin-top:10px">
                    الدرجة:
                    <strong>
                        ${grade.score}/${grade.total}
                    </strong>
                </p>

                <p style="margin-top:7px">
                    النسبة:
                    <strong style="color:#2563eb">
                        ${grade.percentage}%
                    </strong>
                </p>

                <p style="
                    margin-top:7px;
                    color:#64748b;
                ">
                    التاريخ:
                    ${grade.date}
                </p>

            </div>

        `;

    });
}


// =====================================================
// SCHEDULE
// =====================================================

function renderSchedule() {

    const tableBody = document.getElementById("scheduleBody");

    if (!tableBody) return;

    let schedule = [];

    if (currentUser && currentUser.schedule) {
        schedule = currentUser.schedule;
    }

    tableBody.innerHTML = "";

    if (schedule.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="5" style="text-align:center">
                    لا توجد مواد في الجدول
                </td>

            </tr>

        `;

        return;
    }

    schedule.forEach((item, index) => {

        tableBody.innerHTML += `

            <tr>

                <td>
                    ${item.day}
                </td>

                <td>
                    ${item.subject}
                </td>

                <td>
                    ${item.time}
                </td>

                <td>
                    ${getScheduleStatus(item)}
                </td>

                <td>

                    <button
                        class="card button"
                        onclick="editSchedule(${index})"
                    >
                        ✏️ تعديل
                    </button>

                    <button
                        class="card button"
                        onclick="deleteSchedule(${index})"
                    >
                        🗑️ حذف
                    </button>

                </td>

            </tr>

        `;

    });
}


// =====================================================
// حالة الجدول
// =====================================================

function getScheduleStatus(item) {

    const now = new Date();

    const days = {
        "الأحد": 0,
        "الإثنين": 1,
        "الثلاثاء": 2,
        "الأربعاء": 3,
        "الخميس": 4,
        "الجمعة": 5,
        "السبت": 6
    };

    if (days[item.day] === undefined) {
        return "⏳ لم تبدأ";
    }

    const currentDay = now.getDay();

    if (currentDay !== days[item.day]) {
        return "⏳ لم تبدأ";
    }

    const timeParts = item.time.match(/(\d+):(\d+)/);

    if (!timeParts) {
        return "⏳ لم تبدأ";
    }

    let hour = parseInt(timeParts[1]);
    const minute = parseInt(timeParts[2]);

    if (item.time.includes("مساء")) {

        if (hour !== 12) {
            hour += 12;
        }

    } else if (item.time.includes("صباح")) {

        if (hour === 12) {
            hour = 0;
        }

    }

    if (
        now.getHours() === hour &&
        now.getMinutes() === minute
    ) {

        return "🔔 حان الموعد";
    }

    return "⏳ لم تبدأ";
}


// =====================================================
// إضافة مادة للجدول
// =====================================================

function addSchedule() {

    if (!currentUser) return;

    const day = prompt(
        "اكتب اليوم:\nالأحد - الإثنين - الثلاثاء - الأربعاء - الخميس - الجمعة - السبت"
    );

    if (!day) return;

    const subject = prompt(
        "اكتب اسم المادة:"
    );

    if (!subject) return;

    const time = prompt(
        "اكتب الوقت مثل: 8:00 مساءً"
    );

    if (!time) return;

    if (!currentUser.schedule) {
        currentUser.schedule = [];
    }

    currentUser.schedule.push({

        day: day.trim(),

        subject: subject.trim(),

        time: time.trim()

    });

    updateCurrentUser();

    renderSchedule();

    alert("✅ تم إضافة المادة إلى جدولك");
}


// =====================================================
// تعديل مادة
// =====================================================

function editSchedule(index) {

    if (!currentUser || !currentUser.schedule) {
        return;
    }

    const item = currentUser.schedule[index];

    if (!item) return;

    const newDay = prompt(
        "تعديل اليوم:",
        item.day
    );

    if (!newDay) return;

    const newSubject = prompt(
        "تعديل المادة:",
        item.subject
    );

    if (!newSubject) return;

    const newTime = prompt(
        "تعديل الوقت:",
        item.time
    );

    if (!newTime) return;

    currentUser.schedule[index] = {

        day: newDay.trim(),

        subject: newSubject.trim(),

        time: newTime.trim()

    };

    updateCurrentUser();

    renderSchedule();

    alert("✅ تم تعديل الجدول بنجاح");
}


// =====================================================
// حذف مادة
// =====================================================

function deleteSchedule(index) {

    if (!currentUser || !currentUser.schedule) {
        return;
    }

    const ok = confirm(
        "هل تريد حذف هذه المادة من الجدول؟"
    );

    if (!ok) return;

    currentUser.schedule.splice(index, 1);

    updateCurrentUser();

    renderSchedule();

    alert("🗑️ تم حذف المادة");
}


// =====================================================
// إشعار موعد المادة
// =====================================================

function checkScheduleNotification() {

    if (!currentUser || !currentUser.schedule) {
        return;
    }

    const now = new Date();

    const dayNames = [
        "الأحد",
        "الإثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
        "السبت"
    ];

    const today = dayNames[now.getDay()];

    currentUser.schedule.forEach(item => {

        if (item.day !== today) {
            return;
        }

        const match = item.time.match(/(\d+):(\d+)/);

        if (!match) {
            return;
        }

        let hour = parseInt(match[1]);

        const minute = parseInt(match[2]);

        if (item.time.includes("مساء")) {

            if (hour !== 12) {
                hour += 12;
            }

        } else if (item.time.includes("صباح")) {

            if (hour === 12) {
                hour = 0;
            }
        }

        if (
            now.getHours() === hour &&
            now.getMinutes() === minute
        ) {

            const notificationKey =
                "notification_" +
                today +
                "_" +
                item.subject +
                "_" +
                item.time;

            if (!sessionStorage.getItem(notificationKey)) {

                sessionStorage.setItem(
                    notificationKey,
                    "shown"
                );

                alert(
                    "🔔 حان الآن موعد مادة " +
                    item.subject +
                    "\nالوقت: " +
                    item.time
                );
            }
        }

    });
}


// =====================================================
// تحديث بيانات المستخدم
// =====================================================

function updateCurrentUser() {

    if (!currentUser) return;

    let users = getUsers();

    const index = users.findIndex(
        user => user.email === currentUser.email
    );

    if (index === -1) return;

    users[index] = currentUser;

    saveUsers(users);

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );
}


// =====================================================
// إغلاق النوافذ
// =====================================================

function closeModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("show");
    }
}


// =====================================================
// زر إضافة الجدول لو موجود
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const addButton = document.getElementById("addScheduleButton");

    if (addButton) {

        addButton.addEventListener(
            "click",
            addSchedule
        );

    }

});



